FROM eclipse-temurin:25-jdk

WORKDIR /app

COPY target/question-bank-service-0.0.1.jar app.jar

EXPOSE 5000

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
