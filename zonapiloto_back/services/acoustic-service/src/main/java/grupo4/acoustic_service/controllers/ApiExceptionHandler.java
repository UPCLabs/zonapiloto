package grupo4.acoustic_service.controllers;

import grupo4.acoustic_service.services.RateLimitedException;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(RateLimitedException.class)
    public ResponseEntity<Map<String, Object>> rateLimited(
        RateLimitedException e
    ) {
        long seconds = Math.max(1, e.getRetryAfter().toSeconds());
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
            .header(HttpHeaders.RETRY_AFTER, String.valueOf(seconds))
            .body(Map.of("error", e.getMessage(), "retryAfterSeconds", seconds));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> invalid(
        MethodArgumentNotValidException e
    ) {
        Map<String, String> fields = e
            .getBindingResult()
            .getFieldErrors()
            .stream()
            .collect(
                Collectors.toMap(
                    f -> f.getField(),
                    f -> String.valueOf(f.getDefaultMessage()),
                    (a, b) -> a
                )
            );
        return ResponseEntity.badRequest().body(
            Map.of("error", "Datos inválidos", "fields", fields)
        );
    }

    @ExceptionHandler({
        HttpMessageNotReadableException.class,
        MethodArgumentTypeMismatchException.class,
    })
    public ResponseEntity<Map<String, Object>> unreadable(Exception e) {
        return ResponseEntity.badRequest().body(Map.of("error", "Solicitud mal formada"));
    }

    @ExceptionHandler(AuthorizationDeniedException.class)
    public ResponseEntity<Map<String, Object>> forbidden(
        AuthorizationDeniedException e
    ) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
            Map.of("error", "No autorizado")
        );
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, Object>> status(ResponseStatusException e) {
        return ResponseEntity.status(e.getStatusCode()).body(
            Map.of("error", String.valueOf(e.getReason()))
        );
    }
}
