package grupo4.zonapiloto.models.repositories;

import grupo4.zonapiloto.models.entitys.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuestionRepo extends JpaRepository<Question, Long> {
}
