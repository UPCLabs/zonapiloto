package grupo4.auth_service.controllers;

import grupo4.auth_service.services.PendingUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth/pending-users")
@RequiredArgsConstructor
public class PendingUserController {

    private final PendingUserService pendingUserService;

    @GetMapping
    @PreAuthorize("hasAuthority('SUPERADMIN')")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(pendingUserService.getAllPendingUsers());
    }
}
