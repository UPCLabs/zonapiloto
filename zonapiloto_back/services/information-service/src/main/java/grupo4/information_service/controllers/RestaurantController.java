package grupo4.information_service.controllers;

import grupo4.information_service.dtos.RestaurantDTO;
import grupo4.information_service.entities.Restaurant;
import grupo4.information_service.interfaces.IRestaurantService;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("information/restaurants")
@RequiredArgsConstructor
public class RestaurantController {

    private final IRestaurantService restaurantService;

    @GetMapping
    public ResponseEntity<?> getAllRestaurants() {
        List<Restaurant> events = restaurantService.getAllRestaurants();
        return ResponseEntity.ok(events);
    }

    @GetMapping("/own")
    @PreAuthorize("hasAnyAuthority('RESTAURANTADMIN', 'ADMIN', 'SUPERADMIN')")
    public ResponseEntity<?> getRestaurant(
        @RequestHeader("X-UserId") Long userId
    ) {
        try {
            Restaurant restaurant = restaurantService.getRestaurant(userId);

            if (restaurant == null) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok(restaurant);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/admin")
    @PreAuthorize("hasAnyAuthority( 'ADMIN', 'SUPERADMIN')")
    public ResponseEntity<?> getAllAdminRestaurants() {
        List<Restaurant> events = restaurantService.getAllAdminRestaurants();
        return ResponseEntity.ok(events);
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('RESTAURANTADMIN', 'ADMIN', 'SUPERADMIN')")
    public ResponseEntity<?> createRestaurant(
        @RequestHeader("X-UserId") Long userId,
        @RequestBody RestaurantDTO restaurantDTO
    ) {
        restaurantDTO.setOwnerUserId(userId);
        Restaurant restaurant = restaurantService.createRestaurant(
            restaurantDTO
        );

        if (restaurant == null) {
            ResponseEntity.badRequest().body(
                Map.of("error", "El usuario ya tiene un restaurante")
            );
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(restaurant);
    }

    @PutMapping
    @PreAuthorize("hasAnyAuthority('RESTAURANTADMIN', 'ADMIN', 'SUPERADMIN')")
    public ResponseEntity<?> updateRestaurant(
        @RequestHeader("X-UserId") Long userId,
        @RequestBody RestaurantDTO eventDTO
    ) {
        Restaurant updated = restaurantService.updateRestaurant(
            userId,
            eventDTO
        );
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/admin/{id}")
    @PreAuthorize("hasAnyAuthority( 'ADMIN', 'SUPERADMIN')")
    public ResponseEntity<?> updateRestaurantAdmin(
        @PathVariable Long id,
        @RequestBody RestaurantDTO eventDTO
    ) {
        Restaurant updated = restaurantService.updateRestaurantAdmin(
            id,
            eventDTO
        );
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'SUPERADMIN')")
    public void deleteEvent(@PathVariable Long id) {
        restaurantService.deleteRestaurant(id);
    }
}
