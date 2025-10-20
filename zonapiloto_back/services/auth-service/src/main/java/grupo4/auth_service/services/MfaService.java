package grupo4.auth_service.services;

import org.springframework.stereotype.Service;
import com.warrenstrange.googleauth.GoogleAuthenticator;
import com.warrenstrange.googleauth.GoogleAuthenticatorKey;
import com.warrenstrange.googleauth.GoogleAuthenticatorQRGenerator;

@Service
public class MfaService {

    private final GoogleAuthenticator gAuth = new GoogleAuthenticator();

    public MfaSetup generateSetup(String username) {
        final GoogleAuthenticatorKey key = gAuth.createCredentials();
        String secret = key.getKey();

        String qrUrl = GoogleAuthenticatorQRGenerator.getOtpAuthTotpURL(
                "ZonaPiloto", username, key);

        return new MfaSetup(secret, qrUrl);
    }

    public boolean verifyCode(String secret, int code) {
        return gAuth.authorize(secret, code);
    }

    public record MfaSetup(String secret, String qrUrl) {
    }
}
