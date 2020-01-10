#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/core/aspnet:2.2-stretch-slim AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/core/sdk:2.2-stretch AS build
WORKDIR /src
COPY ["EntityFrameworkCore.Diagrams.Demo/EntityFrameworkCore.Diagrams.Demo.csproj", "EntityFrameworkCore.Diagrams.Demo/"]
RUN dotnet restore "EntityFrameworkCore.Diagrams.Demo/EntityFrameworkCore.Diagrams.Demo.csproj"
COPY . .
WORKDIR "/src/EntityFrameworkCore.Diagrams.Demo"
RUN dotnet build "EntityFrameworkCore.Diagrams.Demo.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "EntityFrameworkCore.Diagrams.Demo.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "EntityFrameworkCore.Diagrams.Demo.dll"]