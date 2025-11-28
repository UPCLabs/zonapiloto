package grupo4.information_service.repositories;

import grupo4.information_service.entities.Restaurant;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface IRestaurantRepo extends JpaRepository<Restaurant, Long> {
    @Query(
        value = "SELECT * FROM restaurants WHERE state = true",
        nativeQuery = true
    )
    List<Restaurant> findAllActive();

    @Query(
        value = "SELECT * FROM restaurants WHERE id = :id AND state = true",
        nativeQuery = true
    )
    Optional<Restaurant> findByIdActive(@Param("id") Long id);

    Optional<Restaurant> findByOwnerUserId(Long ownerUserId);
}
