#!/bin/bash
set -e

ROOT_DIR=$(pwd)

echo "🔧 Compilando Gateway..."
cd "$ROOT_DIR/zonapiloto_back/gateway"
./mvnw clean package -DskipTests

echo "🔧 Compilando Auth Service..."
cd "$ROOT_DIR/zonapiloto_back//services/auth-service"
./mvnw clean package -DskipTests

echo "🔧 Compilando Question bank..."
cd "$ROOT_DIR/zonapiloto_back/services/question-bank-service"
./mvnw clean package -DskipTests

echo "🔧 Compilando Calendar service..."
cd "$ROOT_DIR/zonapiloto_back/services/calendar-service"
./mvnw clean package -DskipTests

cd "$ROOT_DIR"

echo "Compilado todo"
