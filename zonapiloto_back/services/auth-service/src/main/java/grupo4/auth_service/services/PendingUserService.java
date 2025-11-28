package grupo4.auth_service.services;

import grupo4.auth_service.dtos.PendingUserDTO;
import grupo4.auth_service.entities.PendingDocument;
import grupo4.auth_service.entities.PendingUser;
import grupo4.auth_service.enums.UserRole;
import grupo4.auth_service.repositories.PendingUserRepo;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PendingUserService {

    private final PendingUserRepo pendingUserRepo;
    private final PendingDocumentService pendingDocumentService;

    public PendingUser createPendingUser(
        String username,
        String email,
        UserRole roleRequested
    ) {
        PendingUser pending = PendingUser.builder()
            .username(username)
            .email(email)
            .roleRequested(roleRequested)
            .build();
        return pendingUserRepo.save(pending);
    }

    public List<PendingUserDTO> getAllPendingUsers() {
        return pendingUserRepo
            .findAll()
            .stream()
            .map(pu ->
                new PendingUserDTO(
                    pu.getId(),
                    pu.getUsername(),
                    pu.getEmail(),
                    pu.getRoleRequested().toString(),
                    pendingDocumentService.getAllPendingDocuments(pu.getId())
                )
            )
            .toList();
    }

    public PendingUser getPendingUser(Long pendingId) {
        return pendingUserRepo.findById(pendingId).orElse(null);
    }

    public PendingUserDTO getPendingUserDTO(Long pendingId) {
        PendingUser pu = getPendingUser(pendingId);
        if (pu == null) return null;

        List<PendingDocument> docs =
            pendingDocumentService.getAllPendingDocuments(pendingId);

        return new PendingUserDTO(
            pu.getId(),
            pu.getUsername(),
            pu.getEmail(),
            pu.getRoleRequested().name(),
            docs
        );
    }

    public boolean pendingUserExists(String email) {
        return pendingUserRepo.findByEmail(email).isPresent();
    }

    public PendingUser updatePendingUser(PendingUser pending) {
        return pendingUserRepo.save(pending);
    }

    public void deletePendingUser(Long pendingId) {
        pendingDocumentService.deleteAllDocumentsForPendingUser(pendingId);
        pendingUserRepo.deleteById(pendingId);
    }
}
