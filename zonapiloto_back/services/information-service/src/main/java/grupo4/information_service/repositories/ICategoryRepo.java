package grupo4.information_service.repositories;

import grupo4.information_service.entities.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ICategoryRepo extends JpaRepository<Category, Long> {}
