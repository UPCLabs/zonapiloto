package grupo4.calendar_service.controllers;

import grupo4.calendar_service.entities.Event;
import grupo4.calendar_service.entities.EventDTO;
import grupo4.calendar_service.interfaces.IEventService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/calendar-events")
@RequiredArgsConstructor
public class EventController {

    private final IEventService eventService;

    @GetMapping
    public ResponseEntity<?> getAllEvents() {
        List<Event> events = eventService.getAllEvents();
        return ResponseEntity.ok(events);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getEvent(@PathVariable Long id) {
        Event event = eventService.getEvent(id);

        if (event == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(event);
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN', 'SUPERADMIN')")
    public ResponseEntity<?> createEvent(@RequestBody EventDTO eventDTO) {
        Event event = eventService.createEvent(eventDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(event);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN', 'SUPERADMIN')")
    public ResponseEntity<?> updateEvent(
        @PathVariable Long id,
        @RequestBody EventDTO eventDTO
    ) {
        Event updated = eventService.updateEvent(id, eventDTO);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN', 'SUPERADMIN')")
    public void deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
    }
}
