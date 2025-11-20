package grupo4.information_service.repositories;

import grupo4.information_service.entities.Advertisement;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface IAdvertisementRepo extends JpaRepository<Advertisement, Long> {
    @Query(value = "SELECT * FROM advertisements", nativeQuery = true)
    List<Advertisement> findAllIncludingInactive();
}
