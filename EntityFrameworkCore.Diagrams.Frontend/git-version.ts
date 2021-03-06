import fs = require('fs');
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

const exec = require('child_process').exec;

const revision = new Observable<string>(s => {
    exec('git rev-parse --short HEAD',
        function (error: Error, stdout: Buffer, stderr: Buffer) {
            if (error !== null) {
                console.log('git error: ' + error + stderr);
            }
            s.next(stdout.toString().trim());
            s.complete();
        });
});

const branch = new Observable<string>(s => {
    exec('git rev-parse --abbrev-ref HEAD',
        function (error: Error, stdout: Buffer, stderr: Buffer) {
            if (error !== null) {
                console.log('git error: ' + error + stderr);
            }
            s.next(stdout.toString().trim());
            s.complete();
        });
});

Observable
    .combineLatest(revision, branch)
    .subscribe(([revision, branch]) => {
        const fields = [
            `version: '${process.env.npm_package_version}'`,
            `revision: '${revision}'`,
            `branch: '${branch}'`,
            `repository: '${process.env.npm_package_repository_url}'`
        ];
        const indent = '    ';
        const versionsObj = '{\n' + indent + fields.join(',\n' + indent) + '\n}';
        console.log(versionsObj);

        const content =
`// this file is automatically generated by git-version.ts script
export const versions = ${versionsObj};
`;

        fs.writeFileSync(
            'src/environments/versions.ts',
            content,
            { encoding: 'utf8' }
        );
    });
