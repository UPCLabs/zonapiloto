package grupo4.auth_service.config;

import grupo4.auth_service.enums.UserRole;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Component;

@Component
public class RoleDocumentConfig {

    private final Map<UserRole, List<String>> requiredDocumentsByRole = Map.of(
        UserRole.EVENTSADMIN,
        List.of(
            "documento",
            "carta_de_solicitud",
            "certificado_laboral",
            "carta_administrativa"
        ),
        UserRole.QUESTIONSADMIN,
        List.of(
            "documento",
            "carta_de_solicitud",
            "certificado_laboral",
            "carta_administrativa"
        ),
        UserRole.RESTAURANTADMIN,
        List.of("documento", "camara_de_comercio", "rut", "carta_de_solicitud")
    );

    public List<String> getRequiredDocumentsForRole(UserRole role) {
        return requiredDocumentsByRole.getOrDefault(role, List.of());
    }
}
