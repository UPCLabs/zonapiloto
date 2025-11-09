package grupo4.gateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {

    @Bean
    public RouteLocator customRoutes(RouteLocatorBuilder builder) {
        return builder
            .routes()
            .route("auth-service", r ->
                r
                    .path("/api/auth/**")
                    .filters(f -> f.stripPrefix(1))
                    .uri("http://auth-service:5001")
            )
            .route("question-bank-service", r ->
                r
                    .path("/api/question-bank/**")
                    .filters(f -> f.stripPrefix(1))
                    .uri("http://question-bank-service:5002")
            )
            .route("calendar-service", r ->
                r
                    .path("/api/calendar-events/**")
                    .filters(f -> f.stripPrefix(1))
                    .uri("http://calendar-service:5003")
            )
            .build();
    }
}
