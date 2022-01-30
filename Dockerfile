FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /source
COPY *.sln .
COPY src/*/*.csproj ./
RUN for file in $(ls *.csproj); do mkdir -p src/${file%.*}/ && mv $file src/${file%.*}/; done
RUN dotnet restore
COPY . .
WORKDIR /source/src/API
RUN dotnet build API.csproj -c Release -o /app/build --no-restore

FROM build AS migrations
WORKDIR /source
RUN dotnet tool install --global dotnet-ef
ENV PATH $PATH:/root/.dotnet/tools
RUN dotnet ef migrations script -i -o migrations.sql -s ./src/API -p ./src/Persistence

FROM build AS publish
RUN dotnet publish API.csproj -c Release -o /app/publish --no-restore

FROM base AS final
ENV ASPNETCORE_ENVIRONMENT "Production"
WORKDIR /app
COPY --from=publish /app/publish .
COPY --from=migrations /source/migrations.sql .
EXPOSE 5000
ENTRYPOINT [ "dotnet", "API.dll" ]
