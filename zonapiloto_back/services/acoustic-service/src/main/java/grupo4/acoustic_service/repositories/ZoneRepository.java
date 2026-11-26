package grupo4.acoustic_service.repositories;

import grupo4.acoustic_service.entities.Zone;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ZoneRepository extends JpaRepository<Zone, Long> {
    List<Zone> findByActiveTrueOrderByCodeAsc();

    List<Zone> findAllByOrderByCodeAsc();

    boolean existsByCodeIgnoreCase(String code);

    boolean existsByCodeIgnoreCaseAndIdNot(String code, Long id);
}
