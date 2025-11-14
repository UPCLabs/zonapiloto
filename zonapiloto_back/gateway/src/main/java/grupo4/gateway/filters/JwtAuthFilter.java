package grupo4.gateway.filters;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.util.logging.Logger;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class JwtAuthFilter implements GlobalFilter {

    private static final Logger logger = Logger.getLogger(
        JwtAuthFilter.class.getName()
    );

    @Value("${jwt.secret}")
    private String secret;

    @Override
    public Mono<Void> filter(
        ServerWebExchange exchange,
        GatewayFilterChain chain
    ) {
        String path = exchange.getRequest().getURI().getPath();
        HttpMethod method = exchange.getRequest().getMethod();

        if (HttpMethod.GET.equals(method)) {
            logger.info("Allowed GET method: " + path);
            return chain.filter(exchange);
        }

        if (
            path.startsWith("/auth/") &&
            !path.equals("/auth/register") &&
            !path.equals("/auth/me")
        ) {
            logger.info("Public route (auth module): " + path);
            return chain.filter(exchange);
        }

        var cookie = exchange.getRequest().getCookies().getFirst("token");
        if (cookie == null) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        String token = cookie.getValue();

        try {
            SecretKey key = Keys.hmacShaKeyFor(
                secret.getBytes(StandardCharsets.UTF_8)
            );
            Claims claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();

            exchange = exchange
                .mutate()
                .request(
                    exchange
                        .getRequest()
                        .mutate()
                        .header("X-User", claims.getSubject())
                        .header("X-Role", (String) claims.get("role"))
                        .build()
                )
                .build();
        } catch (Exception e) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        return chain.filter(exchange);
    }
}
