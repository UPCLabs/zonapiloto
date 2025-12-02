package grupo4.gateway.filters;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.logging.Logger;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class JwtAuthFilter implements GlobalFilter {

    private static final Logger logger = Logger.getLogger(
        JwtAuthFilter.class.getName()
    );

    @Value("${jwt.secret}")
    private String secret;

    private final List<String> PRIVATE_GET = List.of(
        "/auth/users/me",
        "/auth/users",
        "/auth/users/detail",
        "/information/**/admin",
        "/auth/pending-users",
        "/storage/**",
        "/information/**/own"
    );

    private final List<String> PUBLIC_POST = List.of(
        "/auth/registration/register",
        "/auth/notification/**",
        "/auth/send-email-code",
        "/auth/verify-email-code",
        "/auth/login",
        "/auth/check-credentials",
        "/auth/confirm-registration",
        "/auth/verify-registration"
    );

    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    @Override
    public Mono<Void> filter(
        ServerWebExchange exchange,
        GatewayFilterChain chain
    ) {
        String path = exchange.getRequest().getURI().getPath();
        HttpMethod method = exchange.getRequest().getMethod();

        if (HttpMethod.OPTIONS.equals(method)) {
            return chain.filter(exchange);
        }

        boolean isPrivateGet = PRIVATE_GET.stream().anyMatch(pattern ->
            pathMatcher.match(pattern, path)
        );
        if (HttpMethod.GET.equals(method) && !isPrivateGet) {
            logger.info(
                String.format("Public GET method: [%s], redirecting", path)
            );
            return chain.filter(exchange);
        }

        if (HttpMethod.POST.equals(method) && PUBLIC_POST.contains(path)) {
            logger.info(
                String.format("Public POST method: [%s], redirecting", path)
            );
            return chain.filter(exchange);
        }

        var cookie = exchange.getRequest().getCookies().getFirst("token");
        if (cookie == null) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        try {
            SecretKey key = Keys.hmacShaKeyFor(
                secret.getBytes(StandardCharsets.UTF_8)
            );
            Claims claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(cookie.getValue())
                .getPayload();

            exchange = exchange
                .mutate()
                .request(
                    exchange
                        .getRequest()
                        .mutate()
                        .header("X-User", claims.getSubject())
                        .header("X-Role", (String) claims.get("role"))
                        .header(
                            "X-UserId",
                            String.valueOf(claims.get("userId"))
                        )
                        .build()
                )
                .build();

            logger.info(
                String.format(
                    "UserId: %s, User: %s, role: %s - request: %s",
                    claims.get("userId"),
                    claims.getSubject(),
                    claims.get("role"),
                    path
                )
            );
        } catch (Exception e) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        return chain.filter(exchange);
    }
}
