package grupo4.information_service.controllers;

import grupo4.information_service.dtos.InstitutionalEventDTO;
import grupo4.information_service.entities.InstitutionalEvent;
import grupo4.information_service.interfaces.IInstitutionalService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("information/institutional-events/events")
@RequiredArgsConstructor
public class InstitutionalEventController {

    private final IInstitutionalService eventService;

    @GetMapping
    public ResponseEntity<?> getAllEvents() {
        List<InstitutionalEvent> events = eventService.getAllEvents();
        return ResponseEntity.ok(events);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getEvent(@PathVariable Long id) {
        InstitutionalEvent event = eventService.getEvent(id);

        if (event == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(event);
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'SUPERADMIN')")
    public ResponseEntity<?> createEvent(
        @RequestBody InstitutionalEventDTO eventDTO
    ) {
        InstitutionalEvent event = eventService.createEvent(eventDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(event);
    }

    @PutMapping("{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'SUPERADMIN')")
    public ResponseEntity<?> updateEvent(
        @PathVariable Long id,
        @RequestBody InstitutionalEventDTO eventDTO
    ) {
        InstitutionalEvent updated = eventService.updateEvent(id, eventDTO);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'SUPERADMIN')")
    public void deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
    }
}
