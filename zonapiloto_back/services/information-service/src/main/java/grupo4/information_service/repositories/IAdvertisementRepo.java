package grupo4.information_service.repositories;

import grupo4.information_service.entities.Advertisement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IAdvertisementRepo
    extends JpaRepository<Advertisement, Long> {}
