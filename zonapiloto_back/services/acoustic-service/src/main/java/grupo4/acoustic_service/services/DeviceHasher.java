package grupo4.acoustic_service.services;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import java.util.logging.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/** The raw device identifier is never stored; only its salted hash. */
@Component
public class DeviceHasher {

    private static final Logger logger = Logger.getLogger(
        DeviceHasher.class.getName()
    );
    private static final String FALLBACK_SALT = "zonapiloto-sonoro";

    private final String salt;

    public DeviceHasher(@Value("${acoustic.device-salt:}") String salt) {
        // Compose passes an empty string when the variable is missing from .env.
        if (salt == null || salt.isBlank()) {
            logger.warning(
                "ACOUSTIC_DEVICE_SALT is not set; using the built-in fallback salt."
            );
            this.salt = FALLBACK_SALT;
        } else {
            this.salt = salt;
        }
    }

    public String hash(String deviceId) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] bytes = digest.digest(
                (salt + ":" + deviceId).getBytes(StandardCharsets.UTF_8)
            );
            return HexFormat.of().formatHex(bytes);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 unavailable", e);
        }
    }
}
