package grupo4.auth_service.controllers;

import grupo4.common_messaging.email.EmailTemplate;
import grupo4.common_messaging.events.EmailEvent;
import grupo4.common_messaging.publisher.MessagePublisher;
import grupo4.common_messaging.queues.QueuesNames;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/notification")
@RequiredArgsConstructor
public class NotesController {

    @Value("${superadmin.email}")
    private String superAdminEmail;

    private final MessagePublisher messagePublisher;

    @PostMapping("/support-email")
    public ResponseEntity<?> supportEmail(
        @RequestBody Map<String, String> request
    ) {
        try {
            String nombre = request.get("nombre");
            String email = request.get("email");
            String asunto = request.get("asunto");
            String mensaje = request.get("mensaje");

            EmailEvent emailEvent = EmailEvent.builder()
                .to(superAdminEmail)
                .subject("Nuevo mensaje de soporte: " + asunto)
                .template(EmailTemplate.SUPPORT_EMAIL)
                .variables(
                    Map.of(
                        "nombre",
                        nombre,
                        "correo",
                        email,
                        "asunto",
                        asunto,
                        "mensaje",
                        mensaje
                    )
                )
                .build();

            messagePublisher.send(QueuesNames.EMAIL_QUEUE, emailEvent);

            return ResponseEntity.ok(
                Map.of("message", "Mensaje enviado correctamente")
            );
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                Map.of("error", "No se pudo enviar el mensaje")
            );
        }
    }
}
