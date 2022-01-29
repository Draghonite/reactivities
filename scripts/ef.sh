#!/bin/sh

args="$*"

dotnet tool restore
docker compose up -d

dotnet ef $args --project './src/Persistence' --startup-project './src/API'