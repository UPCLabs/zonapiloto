FROM eclipse-temurin:25-jdk

WORKDIR /app

COPY target/auth-service-0.0.1.jar app.jar

EXPOSE 5001

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
