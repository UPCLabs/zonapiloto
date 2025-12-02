package grupo4.information_service.services;

import grupo4.information_service.dtos.RestaurantDTO;
import grupo4.information_service.entities.Restaurant;
import grupo4.information_service.interfaces.IRestaurantService;
import grupo4.information_service.repositories.IRestaurantRepo;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RestaurantService implements IRestaurantService {

    private final IRestaurantRepo restaurantRepository;

    @Override
    public boolean RestaurantExists(Long restaurantId) {
        return restaurantRepository.existsById(restaurantId);
    }

    @Override
    public Restaurant getRestaurant(Long ownerUserID) {
        return restaurantRepository
            .findByOwnerUserId(ownerUserID)
            .orElseThrow(() -> new RuntimeException("Restaurant not found"));
    }

    @Override
    public Restaurant getRestaurantAdmin(Long restaurantId) {
        return restaurantRepository.findById(restaurantId).orElse(null);
    }

    @Override
    public Restaurant updateRestaurant(Long ownerUserId, RestaurantDTO dto) {
        Restaurant restaurant = restaurantRepository
            .findByOwnerUserId(ownerUserId)
            .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        restaurant.setName(dto.getName());
        restaurant.setCategory(dto.getCategory());
        restaurant.setLogo(dto.getLogo());
        restaurant.setLocation(dto.getLocation());
        restaurant.setMenuUri(dto.getMenuUri());
        restaurant.setState(dto.isState());

        return restaurantRepository.save(restaurant);
    }

    @Override
    public Restaurant updateRestaurantAdmin(
        Long restaurantId,
        RestaurantDTO dto
    ) {
        Restaurant restaurant = restaurantRepository
            .findById(restaurantId)
            .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        restaurant.setName(dto.getName());
        restaurant.setCategory(dto.getCategory());
        restaurant.setLogo(dto.getLogo());
        restaurant.setLocation(dto.getLocation());
        restaurant.setMenuUri(dto.getMenuUri());
        restaurant.setState(dto.isState());

        return restaurantRepository.save(restaurant);
    }

    @Override
    public Restaurant createRestaurant(RestaurantDTO dto) {
        Optional<Restaurant> restaurantOPT =
            restaurantRepository.findByOwnerUserId(dto.getOwnerUserId());
        if (restaurantOPT.isPresent()) {
            return null;
        }

        Restaurant restaurant = Restaurant.builder()
            .ownerUserId(dto.getOwnerUserId())
            .name(dto.getName())
            .category(dto.getCategory())
            .logo(dto.getLogo())
            .location(dto.getLocation())
            .menuUri(dto.getMenuUri())
            .build();

        return restaurantRepository.save(restaurant);
    }

    @Override
    public void deleteRestaurant(Long restaurantId) {
        if (!restaurantRepository.existsById(restaurantId)) {
            throw new RuntimeException("Restaurant not found");
        }
        restaurantRepository.deleteById(restaurantId);
    }

    @Override
    public List<Restaurant> getAllRestaurants() {
        return restaurantRepository.findAllActive();
    }

    @Override
    public List<Restaurant> getAllAdminRestaurants() {
        return restaurantRepository.findAll();
    }
}
