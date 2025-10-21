package grupo4.auth_service.services;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;
import com.warrenstrange.googleauth.GoogleAuthenticator;
import com.warrenstrange.googleauth.GoogleAuthenticatorKey;
import com.warrenstrange.googleauth.GoogleAuthenticatorQRGenerator;

@Service
public class MfaService {

    private final GoogleAuthenticator gAuth = new GoogleAuthenticator();
    private final Map<String, Long> lastUsedCode = new HashMap<>();

    public MfaSetup generateSetup(String username) {
        final GoogleAuthenticatorKey key = gAuth.createCredentials();
        String secret = key.getKey();

        String qrUrl = GoogleAuthenticatorQRGenerator.getOtpAuthTotpURL(
                "ZonaPiloto", username, key);

        return new MfaSetup(secret, qrUrl);
    }

    public boolean verifyCode(String username, String secret, int code) {
        long timestamp = (System.currentTimeMillis() / 1000L) / 30;

        if (lastUsedCode.getOrDefault(username, -1L) == timestamp) {
            return false;
        }

        boolean isValid = gAuth.authorize(secret, code);
        if (isValid) {
            lastUsedCode.put(username, timestamp);
        }

        return isValid;
    }

    public record MfaSetup(String secret, String qrUrl) {
    }
}
