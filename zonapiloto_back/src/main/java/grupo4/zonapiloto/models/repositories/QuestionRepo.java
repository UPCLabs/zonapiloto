package grupo4.zonapiloto.models.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import grupo4.zonapiloto.models.entities.Question;

@Repository
public interface QuestionRepo extends JpaRepository<Question, Long> {
}
