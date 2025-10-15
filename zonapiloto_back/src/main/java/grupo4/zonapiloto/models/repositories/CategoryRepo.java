package grupo4.zonapiloto.models.repositories;

import grupo4.zonapiloto.models.entitys.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoryRepo extends JpaRepository<Category, Long> {
    @Query("SELECT c FROM Category c LEFT JOIN FETCH c.questions WHERE c.categoryId = :id")
    Optional<Category> findCategoryWithQuestions(@Param("id") Long id);
}
