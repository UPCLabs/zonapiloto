FROM eclipse-temurin:25-jdk

WORKDIR /app

COPY target/calendar-service-0.0.1.jar app.jar

EXPOSE 5003

ENTRYPOINT ["java", "-jar", "app.jar"]
