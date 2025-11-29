package grupo4.auth_service.controllers;

import grupo4.auth_service.entities.User;
import grupo4.auth_service.enums.UserRole;
import grupo4.auth_service.services.UserDocumentService;
import grupo4.auth_service.services.UserService;
import grupo4.auth_service.util.UserUtil;
import grupo4.common_messaging.email.EmailTemplate;
import grupo4.common_messaging.events.EmailEvent;
import grupo4.common_messaging.publisher.MessagePublisher;
import grupo4.common_messaging.queues.QueuesNames;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserDocumentService userDocumentService;
    private final MessagePublisher messagePublisher;

    @GetMapping("/users/me")
    public ResponseEntity<?> userInfo(
        @RequestHeader("X-UserId") Long userId,
        @RequestHeader("X-User") String user,
        @RequestHeader("X-Role") String role
    ) {
        User usuario = userService.getUserEntity(userId);

        if (usuario == null) {
            ResponseCookie cookie = ResponseCookie.from("token", "")
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .path("/")
                .maxAge(0)
                .build();

            return ResponseEntity.status(401)
                .header("Set-Cookie", cookie.toString())
                .body("Sesión inválida");
        }

        return ResponseEntity.ok(
            Map.of("user", usuario.getUsername(), "role", role)
        );
    }

    @GetMapping("/users")
    @PreAuthorize("hasAuthority('SUPERADMIN')")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/users/detail")
    @PreAuthorize("hasAuthority('SUPERADMIN')")
    public ResponseEntity<?> getAllDetaiUsers() {
        return ResponseEntity.ok(userService.getAllWithDocumentsUsers());
    }

    @PostMapping("/users")
    @PreAuthorize("hasAuthority('SUPERADMIN')")
    public ResponseEntity<?> register(@RequestBody Map<String, String> req) {
        String username = req.get("username");
        String password = req.get("password");
        String email = req.get("email");
        UserRole role = UserRole.valueOf(req.get("role"));

        if (userService.userExists(email)) {
            return ResponseEntity.badRequest().body(
                Map.of("error", "Usuario ya existe")
            );
        }

        userService.createUser(username, email, password, role);

        EmailEvent credentialsEmail = EmailEvent.builder()
            .to(email)
            .subject("El admin te ha creado un usuario")
            .template(EmailTemplate.USER_ACCEPTED)
            .variables(
                Map.of("user", username, "email", email, "password", password)
            )
            .build();

        messagePublisher.send(QueuesNames.EMAIL_QUEUE, credentialsEmail);

        return ResponseEntity.ok(
            Map.of(
                "message",
                "Usuario creado exitosamente. Pendiente de confirmar registro (configurar MFA)."
            )
        );
    }

    @PutMapping("/users/{user_id}")
    @PreAuthorize("hasAuthority('SUPERADMIN')")
    public ResponseEntity<?> updateUser(
        @RequestHeader("X-UserId") Long requesterUserId,
        @RequestBody Map<String, String> req,
        @PathVariable Long user_id
    ) {
        String newUsername = req.get("username");
        String newEmail = req.get("email");
        String newPassword = req.get("password");
        UserRole newRole = UserRole.valueOf(req.get("role"));

        User user = userService.getUserEntity(user_id);
        if (user == null) {
            return ResponseEntity.status(404).body(
                Map.of("error", "Usuario no encontrado")
            );
        }

        if (newRole != user.getRole() && requesterUserId == user.getId()) {
            return ResponseEntity.status(403).body(
                Map.of("error", "No puedes cambiarte el rol")
            );
        }

        if (newPassword != null) {
            user.setPassword(UserUtil.encryptPassword(newPassword));
        }
        if (newEmail != null) {
            user.setEmail(newEmail);
        }

        user.setRole(newRole);
        user.setUsername(newUsername);

        userService.updateUser(user);
        return ResponseEntity.ok(Map.of("message", "Usuario actualizado"));
    }

    @DeleteMapping("/users/{user_id}")
    @PreAuthorize("hasAuthority('SUPERADMIN')")
    public ResponseEntity<?> deleteUser(
        @RequestHeader("X-UserId") Long requesterUserId,
        @PathVariable Long user_id
    ) {
        User user = userService.getUserEntity(user_id);

        if (user == null) {
            return ResponseEntity.status(404).body(
                Map.of("error", "Usuario no encontrado")
            );
        }

        if (requesterUserId == user.getId()) {
            return ResponseEntity.status(400).body(
                Map.of("error", "No puedes eliminar tu propio usuario")
            );
        }

        userDocumentService.deleteAll(user_id);
        userService.deleteUser(user.getId());

        return ResponseEntity.ok(
            Map.of(
                "message",
                "Usuario eliminado correctamente",
                "deletedUser",
                user.getUsername()
            )
        );
    }
}
