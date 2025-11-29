package grupo4.auth_service.controllers;

import grupo4.auth_service.config.RoleDocumentConfig;
import grupo4.auth_service.dtos.UserRegisterDTO;
import grupo4.auth_service.entities.PendingDocument;
import grupo4.auth_service.entities.PendingUser;
import grupo4.auth_service.entities.User;
import grupo4.auth_service.enums.UserRole;
import grupo4.auth_service.services.PendingDocumentService;
import grupo4.auth_service.services.PendingUserService;
import grupo4.auth_service.services.UserDocumentService;
import grupo4.auth_service.services.UserService;
import grupo4.auth_service.util.PasswordGenerator;
import grupo4.common_messaging.email.EmailTemplate;
import grupo4.common_messaging.events.EmailEvent;
import grupo4.common_messaging.publisher.MessagePublisher;
import grupo4.common_messaging.queues.QueuesNames;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tools.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/auth/registration")
@RequiredArgsConstructor
public class RegisterController {

    @Value("${superadmin.email}")
    private String superAdminEmail;

    private final UserService userService;
    private final UserDocumentService userDocumentService;
    private final PendingDocumentService pendingDocumentService;
    private final PendingUserService pendingUserService;
    private final MessagePublisher messagePublisher;
    private final RoleDocumentConfig roleDocumentConfig;
    private final ObjectMapper objectMapper;

    @PostMapping(
        value = "/register",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<?> registerUser(
        @RequestPart("user") String userRequest,
        @RequestParam Map<String, MultipartFile> files
    ) {
        try {
            UserRegisterDTO uRegisterDTO = objectMapper.readValue(
                userRequest,
                UserRegisterDTO.class
            );

            if (pendingUserService.pendingUserExists(uRegisterDTO.getEmail())) {
                return ResponseEntity.badRequest().body(
                    Map.of(
                        "error",
                        "El correo ya esta en el registro, espera la confirmación"
                    )
                );
            }

            if (userService.userExists(uRegisterDTO.getEmail())) {
                return ResponseEntity.badRequest().body(
                    Map.of("error", "El correo ya fue aceptado")
                );
            }

            UserRole role = UserRole.valueOf(uRegisterDTO.getRole());
            List<String> requiredDocs =
                roleDocumentConfig.getRequiredDocumentsForRole(role);

            if (requiredDocs.isEmpty()) {
                return ResponseEntity.badRequest().body(
                    Map.of(
                        "error",
                        "Este rol no es elegible para hacer una solicitud"
                    )
                );
            }

            for (String required : requiredDocs) {
                if (!files.containsKey(required)) {
                    return ResponseEntity.badRequest().body(
                        Map.of("error", "Falta el documento: " + required)
                    );
                }
            }

            PendingUser pendingUser = pendingUserService.createPendingUser(
                uRegisterDTO.getUsername(),
                uRegisterDTO.getEmail(),
                role
            );

            for (Map.Entry<String, MultipartFile> entry : files.entrySet()) {
                pendingDocumentService.createDocument(
                    pendingUser.getId(),
                    entry.getKey(),
                    entry.getValue()
                );
            }

            EmailEvent userEmail = EmailEvent.builder()
                .to(uRegisterDTO.getEmail())
                .subject("Tu registro ha sido recibido")
                .template(EmailTemplate.USER_REGISTER)
                .variables(
                    Map.of(
                        "user",
                        uRegisterDTO.getUsername(),
                        "role",
                        role.name()
                    )
                )
                .build();

            messagePublisher.send(QueuesNames.EMAIL_QUEUE, userEmail);

            EmailEvent adminEmail = EmailEvent.builder()
                .to(superAdminEmail)
                .subject("Nuevo usuario en revisión")
                .template(EmailTemplate.ADMIN_NEW_USER)
                .variables(
                    Map.of(
                        "email",
                        uRegisterDTO.getEmail(),
                        "role",
                        role.name()
                    )
                )
                .build();

            messagePublisher.send(QueuesNames.EMAIL_QUEUE, adminEmail);

            return ResponseEntity.ok(
                Map.of("message", "Registro enviado a revisión")
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                Map.of(
                    "error",
                    "Error procesando solicitud",
                    "details",
                    e.getMessage()
                )
            );
        }
    }

    @PostMapping("/confirm")
    @PreAuthorize("hasAuthority('SUPERADMIN')")
    public ResponseEntity<?> confirmUser(
        @RequestBody Map<String, String> request
    ) {
        try {
            Long userId = Long.parseLong(request.get("user_id"));
            boolean confirm = Boolean.parseBoolean(request.get("confirm"));

            if (userId == null || request.get("confirm") == null) {
                return ResponseEntity.badRequest().body(
                    Map.of("error", "Se requiere user_id y confirm")
                );
            }

            PendingUser pending = pendingUserService.getPendingUser(userId);
            if (pending == null) {
                return ResponseEntity.badRequest().body(
                    Map.of("error", "Usuario pendiente no encontrado")
                );
            }

            if (!confirm) {
                String rejectReason = request.get("reject_reason");
                EmailEvent rejectEmail = EmailEvent.builder()
                    .to(pending.getEmail())
                    .subject("Tu registro fue rechazado")
                    .template(EmailTemplate.USER_REJECTED)
                    .variables(
                        Map.of(
                            "user",
                            pending.getUsername(),
                            "reason",
                            rejectReason
                        )
                    )
                    .build();

                messagePublisher.send(QueuesNames.EMAIL_QUEUE, rejectEmail);

                pendingUserService.deletePendingUser(userId);

                return ResponseEntity.ok(
                    Map.of("message", "Usuario rechazado")
                );
            }

            String password = PasswordGenerator.generateRandomPassword(10);
            List<PendingDocument> pendingDocuments =
                pendingDocumentService.getAllPendingDocuments(pending.getId());

            User userCreated = userService.createUser(
                pending.getUsername(),
                pending.getEmail(),
                password,
                pending.getRoleRequested()
            );

            pendingDocuments.forEach(doc -> {
                userDocumentService.create(
                    userCreated.getId(),
                    doc.getDocumentName(),
                    doc.getDocumentUri()
                );
            });

            EmailEvent credentialsEmail = EmailEvent.builder()
                .to(pending.getEmail())
                .subject("Tu cuenta ha sido aprobada")
                .template(EmailTemplate.USER_ACCEPTED)
                .variables(
                    Map.of(
                        "user",
                        pending.getUsername(),
                        "email",
                        userCreated.getEmail(),
                        "password",
                        password
                    )
                )
                .build();

            messagePublisher.send(QueuesNames.EMAIL_QUEUE, credentialsEmail);

            pendingUserService.deletePendingUser(userId);

            return ResponseEntity.ok(Map.of("message", "Usuario aprobado"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                Map.of(
                    "error",
                    "Error procesando solicitud",
                    "details",
                    e.getMessage()
                )
            );
        }
    }
}
