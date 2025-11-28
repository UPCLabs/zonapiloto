package grupo4.auth_service.util;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Component;

@Component
public class EmailCodeCache {

    private final Map<String, String> codes = new ConcurrentHashMap<>();
    private final Map<String, Long> expirations = new ConcurrentHashMap<>();

    public void saveCode(String email, String code) {
        codes.put(email, code);
        expirations.put(email, System.currentTimeMillis() + 10 * 60 * 1000);
    }

    public boolean validate(String email, String code) {
        if (!codes.containsKey(email)) return false;
        if (System.currentTimeMillis() > expirations.get(email)) return false;

        return codes.get(email).equals(code);
    }

    public void remove(String email) {
        codes.remove(email);
        expirations.remove(email);
    }
}
