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
            .route("information-service", r ->
                r
                    .path("/api/information/**")
                    .filters(f -> f.stripPrefix(1))
                    .uri("http://information-service:5002")
            )
            .build();
    }
}
