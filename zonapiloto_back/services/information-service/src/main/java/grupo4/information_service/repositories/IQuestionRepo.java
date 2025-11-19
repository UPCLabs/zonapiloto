package grupo4.information_service.repositories;

import grupo4.information_service.entities.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IQuestionRepo extends JpaRepository<Question, Long> {}
