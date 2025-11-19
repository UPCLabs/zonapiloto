package grupo4.information_service.controllers;

import grupo4.information_service.dtos.CalendaryEventDTO;
import grupo4.information_service.entities.CalendaryEvent;
import grupo4.information_service.interfaces.IEventService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("information/calendar-events/events")
@RequiredArgsConstructor
public class CalendaryEventController {

    private final IEventService eventService;

    @GetMapping
    public ResponseEntity<?> getAllEvents() {
        List<CalendaryEvent> events = eventService.getAllEvents();
        return ResponseEntity.ok(events);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getEvent(@PathVariable Long id) {
        CalendaryEvent event = eventService.getEvent(id);

        if (event == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(event);
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'SUPERADMIN')")
    public ResponseEntity<?> createEvent(
        @RequestBody CalendaryEventDTO eventDTO
    ) {
        CalendaryEvent event = eventService.createEvent(eventDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(event);
    }

    @PutMapping("{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'SUPERADMIN')")
    public ResponseEntity<?> updateEvent(
        @PathVariable Long id,
        @RequestBody CalendaryEventDTO eventDTO
    ) {
        CalendaryEvent updated = eventService.updateEvent(id, eventDTO);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'SUPERADMIN')")
    public void deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
    }
}
