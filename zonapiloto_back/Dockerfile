FROM eclipse-temurin:25-jdk-jammy

WORKDIR /app

COPY target/zonapiloto-0.0.1.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
