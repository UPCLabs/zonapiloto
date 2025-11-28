package grupo4.auth_service.controllers;

import grupo4.auth_service.services.StorageService;
import java.nio.file.Files;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/storage")
@RequiredArgsConstructor
public class DocumentsController {

    private final StorageService storageService;

    @GetMapping("/documents/{status}/{userId}/{fileName}")
    @PreAuthorize("hasAuthority('SUPERADMIN')")
    public ResponseEntity<?> getDocument(
        @PathVariable String status,
        @PathVariable String userId,
        @PathVariable String fileName
    ) {
        try {
            Resource file = storageService.getFile(status, userId, fileName);

            String contentType = Files.probeContentType(
                file.getFile().toPath()
            );
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                .header(
                    HttpHeaders.CONTENT_DISPOSITION,
                    "inline; filename=\"" + fileName + "\""
                )
                .contentType(MediaType.parseMediaType(contentType))
                .body(file);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
