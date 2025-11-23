package grupo4.information_service.repositories;

import grupo4.information_service.entities.Advertisement;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface IAdvertisementRepo extends JpaRepository<Advertisement, Long> {
    @Query(
        value = "SELECT * FROM advertisements where state = true",
        nativeQuery = true
    )
    List<Advertisement> findAllActive();

    @Query(
        value = "SELECT * FROM advertisements WHERE id = :id AND state = true",
        nativeQuery = true
    )
    Optional<Advertisement> findByIdActive(@Param("id") Long id);
}
