#!/bin/bash
set -e

ROOT_DIR=$(pwd)

echo "🔧 Compilando Gateway..."
cd "$ROOT_DIR/zonapiloto_back/gateway"
./mvnw clean package -DskipTests

echo "🔧 Compilando Auth Service..."
cd "$ROOT_DIR/zonapiloto_back//services/auth-service"
./mvnw clean package -DskipTests

echo "🔧 Compilando Information service..."
cd "$ROOT_DIR/zonapiloto_back/services/information-service"
./mvnw clean package -DskipTests

echo "🔧 Compilando Profile service..."
cd "$ROOT_DIR/zonapiloto_back/services/profile-service"
./mvnw clean package -DskipTests

echo "🔧 Compilando Notification service..."
cd "$ROOT_DIR/zonapiloto_back/services/notification-service"
./mvnw clean package -DskipTests

cd "$ROOT_DIR"

echo "Construyendo y levantando los contenedores Docker..."
docker compose -f docker-compose.dev.yml up --build
