#!/bin/bash
set -e

ROOT_DIR=$(pwd)

echo "🔧 Compilando zonapiloto backend..."
cd "$ROOT_DIR/zonapiloto_back"
./mvnw clean package -DskipTests

cd "$ROOT_DIR"

echo "Construyendo y levantando los contenedores Docker..."
docker compose -f docker-compose.dev.yml up --build
