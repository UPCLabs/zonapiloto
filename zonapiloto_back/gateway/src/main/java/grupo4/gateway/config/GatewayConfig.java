package grupo4.gateway.config;

import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import reactor.core.publisher.Mono;

@Configuration
public class GatewayConfig {

    @Bean
    public RouteLocator customRoutes(RouteLocatorBuilder builder) {
        return builder
            .routes()
            .route("gateway-service", r ->
                r
                    .path("/api/system/**")
                    .filters(f -> f.stripPrefix(1))
                    .uri("http://gateway:5000")
            )
            .route("auth-service", r ->
                r
                    .path("/api/auth/**")
                    .filters(f -> f.stripPrefix(1))
                    .uri("http://auth-service:5001")
            )
            .route("legal-documents", r ->
                r
                    .path("/api/storage/**")
                    .filters(f -> f.stripPrefix(1))
                    .uri("http://auth-service:5001")
            )
            .route("notifications", r ->
                r
                    .path("/api/notification/**")
                    .filters(f -> f.stripPrefix(1))
                    .uri("http://auth-service:5001")
            )
            .route("information-service", r ->
                r
                    .path("/api/information/**")
                    .filters(f -> f.stripPrefix(1))
                    .uri("http://information-service:5002")
            )
            .route("reports-chart", r ->
                r
                    .path("/api/report/**")
                    .filters(f -> f.stripPrefix(1))
                    .uri("http://information-service:5002")
            )
            .route("zonapiloto_images", r ->
                r
                    .path("/api/zonapiloto_images/**")
                    .filters(f -> f.stripPrefix(1))
                    .uri("http://information-service:5002")
            )
            .route("profile-service", r ->
                r
                    .path("/api/profile/**")
                    .filters(f -> f.stripPrefix(1))
                    .uri("http://profile-service:5003")
            )
            .build();
    }

    @Bean
    public GlobalFilter globalCircuitBreaker() {
        return (exchange, chain) ->
            chain
                .filter(exchange)
                .onErrorResume(ex -> {
                    var response = exchange.getResponse();
                    response.setStatusCode(HttpStatus.SERVICE_UNAVAILABLE);
                    response
                        .getHeaders()
                        .setContentType(MediaType.APPLICATION_JSON);

                    var dataBuffer = response
                        .bufferFactory()
                        .wrap(
                            "{\"error\":\"Servicio no disponible\",\"status\":503}".getBytes()
                        );

                    return response.writeWith(Mono.just(dataBuffer));
                });
    }
}
