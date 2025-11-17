package grupo4.information_service.repositories;

import grupo4.information_service.entities.InstitutionalEvent;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IInstitutionalRepo
    extends JpaRepository<InstitutionalEvent, Long> {}
