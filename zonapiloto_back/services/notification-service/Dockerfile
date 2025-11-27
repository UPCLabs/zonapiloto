FROM eclipse-temurin:25-jdk

WORKDIR /app

COPY target/notification-service-0.0.1.jar app.jar

EXPOSE 5004

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
