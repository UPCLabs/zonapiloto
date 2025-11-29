package grupo4.information_service.interfaces;

import grupo4.information_service.dtos.RestaurantDTO;
import grupo4.information_service.entities.Restaurant;
import java.util.List;

public interface IRestaurantService {
    boolean RestaurantExists(Long restaurantId);
    Restaurant getRestaurant(Long ownerUserId);
    Restaurant getRestaurantAdmin(Long restaurantId);
    Restaurant updateRestaurant(Long ownerUserId, RestaurantDTO restaurantDTO);
    Restaurant updateRestaurantAdmin(
        Long restaurantId,
        RestaurantDTO restaurantDTO
    );
    Restaurant createRestaurant(RestaurantDTO restaurantDTO);
    void deleteRestaurant(Long restaurantId);
    List<Restaurant> getAllRestaurants();
    List<Restaurant> getAllAdminRestaurants();
}
