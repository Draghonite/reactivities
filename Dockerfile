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

# FROM build AS migrations
# WORKDIR /source/src/API
# COPY .env.example .env
# COPY .config .
# RUN dotnet tool restore
# ENTRYPOINT [ "dotnet", "ef", "migrations", "script", "--idempotent", "--output" ]
# TODO: figure out how to get the migration scripts

FROM build AS publish
RUN dotnet publish API.csproj -c Release -o /app/publish --no-restore

FROM base AS final
ENV ASPNETCORE_ENVIRONMENT "Production"
WORKDIR /app
COPY --from=publish /app/publish .
EXPOSE 5000
ENTRYPOINT [ "dotnet", "API.dll" ]

# https://hub.docker.com/_/microsoft-dotnet
# FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
# WORKDIR /sln

# COPY *.sln .

# COPY src/*/*.csproj ./
# RUN for file in $(ls *.csproj); do mkdir -p src/${file%.*}/ && mv $file src/${file%.*}/; done

# RUN dotnet restore

# COPY / projects
# RUN for project in $(ls -d projects/*/); do mv $project/* src/${project#projects/}/ && rm -r $project; done

# RUN dotnet publish src/API --configuration Release --output /app --no-restore

# FROM build as migrations
# WORKDIR /sln/src/API

# COPY .env.example .env
# COPY .config .

# RUN dotnet tool restore

# ENTRYPOINT [ "dotnet", "ef", "migrations", "script", "--idempotent", "--output" ]

# FROM mcr.microsoft.com/dotnet/aspnet:6.0
# WORKDIR /app
# COPY --from=build /app ./
# ENTRYPOINT ["dotnet", "API.dll"]
