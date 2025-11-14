FROM eclipse-temurin:25-jdk

WORKDIR /app

COPY target/information-service-0.0.1.jar app.jar

EXPOSE 5002

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
