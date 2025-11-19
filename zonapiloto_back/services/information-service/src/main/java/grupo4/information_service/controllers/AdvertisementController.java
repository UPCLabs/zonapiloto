package grupo4.information_service.controllers;

import grupo4.information_service.dtos.AdvertisementDTO;
import grupo4.information_service.entities.Advertisement;
import grupo4.information_service.interfaces.IAdvertisementService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("information/advertisements")
@RequiredArgsConstructor
public class AdvertisementController {

    private final IAdvertisementService advertisementService;

    @GetMapping
    public ResponseEntity<?> getAllAdvertisements() {
        List<Advertisement> events =
            advertisementService.getAllAdvertisements();
        return ResponseEntity.ok(events);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAdvertisement(@PathVariable Long id) {
        Advertisement event = advertisementService.getAdvertisement(id);

        if (event == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(event);
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'SUPERADMIN')")
    public ResponseEntity<?> createAdvertisement(
        @RequestBody AdvertisementDTO eventDTO
    ) {
        Advertisement event = advertisementService.createAdvertisement(
            eventDTO
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(event);
    }

    @PutMapping("{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'SUPERADMIN')")
    public ResponseEntity<?> updateAdvertisement(
        @PathVariable Long id,
        @RequestBody AdvertisementDTO eventDTO
    ) {
        Advertisement updated = advertisementService.updateAdvertisement(
            id,
            eventDTO
        );
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'SUPERADMIN')")
    public void deleteAdvertisement(@PathVariable Long id) {
        advertisementService.deleteAdvertisement(id);
    }
}
