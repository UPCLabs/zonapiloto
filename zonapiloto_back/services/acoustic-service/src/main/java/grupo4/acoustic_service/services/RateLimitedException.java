package grupo4.acoustic_service.services;

import java.time.Duration;

public class RateLimitedException extends RuntimeException {

    private final Duration retryAfter;

    public RateLimitedException(Duration retryAfter) {
        super("Ya registraste una medición en esta zona hace poco.");
        this.retryAfter = retryAfter;
    }

    public Duration getRetryAfter() {
        return retryAfter;
    }
}
