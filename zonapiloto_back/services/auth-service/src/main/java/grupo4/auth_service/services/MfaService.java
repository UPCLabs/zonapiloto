package grupo4.auth_service.services;

import com.warrenstrange.googleauth.GoogleAuthenticator;
import com.warrenstrange.googleauth.GoogleAuthenticatorKey;
import com.warrenstrange.googleauth.GoogleAuthenticatorQRGenerator;
import java.util.HashMap;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class MfaService {

    private final GoogleAuthenticator gAuth = new GoogleAuthenticator();
    private final Map<String, Long> lastUsedCode = new HashMap<>();

    public MfaSetup generateSetup(String email) {
        final GoogleAuthenticatorKey key = gAuth.createCredentials();
        String secret = key.getKey();

        String qrUrl = GoogleAuthenticatorQRGenerator.getOtpAuthTotpURL(
            "ZonaPiloto",
            email,
            key
        );

        return new MfaSetup(secret, qrUrl);
    }

    public boolean verifyCode(String email, String secret, int code) {
        long timestamp = (System.currentTimeMillis() / 1000L) / 30;

        if (lastUsedCode.getOrDefault(email, -1L) == timestamp) {
            return false;
        }

        boolean isValid = gAuth.authorize(secret, code);
        if (isValid) {
            lastUsedCode.put(email, timestamp);
        }

        return isValid;
    }

    public record MfaSetup(String secret, String qrUrl) {}
}
