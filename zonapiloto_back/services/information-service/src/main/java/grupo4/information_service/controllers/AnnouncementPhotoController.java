package grupo4.information_service.controllers;

import grupo4.information_service.entities.AnnouncementPhoto;
import grupo4.information_service.services.AnnouncementPhotoService;
import java.io.IOException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/information/announcements-photos")
@RequiredArgsConstructor
public class AnnouncementPhotoController {

    private final AnnouncementPhotoService service;

    @GetMapping
    public ResponseEntity<List<AnnouncementPhoto>> getAll() {
        return ResponseEntity.ok(service.getAllPhotos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AnnouncementPhoto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getPhoto(id));
    }

    @GetMapping("/admin")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'SUPERADMIN')")
    public ResponseEntity<?> getAllAdminPhotos() {
        List<AnnouncementPhoto> events = service.getAllAdminPhotos();
        return ResponseEntity.ok(events);
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'SUPERADMIN')")
    public ResponseEntity<AnnouncementPhoto> create(
        @RequestParam("title") String title,
        @RequestParam("file") MultipartFile file
    ) throws IOException {
        AnnouncementPhoto saved = service.createPhoto(title, file);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'SUPERADMIN')")
    public ResponseEntity<AnnouncementPhoto> update(
        @PathVariable Long id,
        @RequestParam("title") String title,
        @RequestParam("active") boolean active,
        @RequestParam(value = "file", required = false) MultipartFile file
    ) throws IOException {
        AnnouncementPhoto updated = service.updatePhoto(
            id,
            title,
            active,
            file
        );
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'SUPERADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deletePhoto(id);
        return ResponseEntity.noContent().build();
    }
}
