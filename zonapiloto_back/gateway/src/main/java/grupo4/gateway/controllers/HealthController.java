package grupo4.gateway.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/system")
public class HealthController {

    private final WebClient webClient = WebClient.create();

    @Value("${SERVICES_URLS:}")
    private String servicesEnv;

    @GetMapping("/status")
    public Mono<ResponseEntity<Map<String, Object>>> checkAllServices() {
        Map<String, Object> result = new ConcurrentHashMap<>();
        result.put("gateway", Map.of("status", "UP"));

        Map<String, String> services = parseServices(servicesEnv);

        List<Mono<Void>> checks = services.entrySet().stream()
                .map(entry -> checkService(entry.getKey(), entry.getValue(), result))
                .toList();

        return Mono.when(checks)
                .thenReturn(ResponseEntity.ok(result));
    }

    private Map<String, String> parseServices(String env) {
        Map<String, String> map = new HashMap<>();
        if (env != null && !env.isBlank()) {
            for (String entry : env.split(",")) {
                String[] parts = entry.trim().split("=");
                if (parts.length == 2) {
                    map.put(parts[0].trim(), parts[1].trim());
                }
            }
        }
        return map;
    }

    private Mono<Void> checkService(String name, String url, Map<String, Object> result) {
        return webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(Map.class)
                .map(res -> {
                    result.put(name, res);
                    return res;
                })
                .onErrorResume(e -> {
                    result.put(name, Map.of("status", "DOWN", "error", e.getMessage()));
                    return Mono.empty();
                })
                .then();
    }
}
