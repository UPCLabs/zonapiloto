package grupo4.question_bank_service.models.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import grupo4.question_bank_service.models.entities.Question;

@Repository
public interface QuestionRepo extends JpaRepository<Question, Long> {
}
