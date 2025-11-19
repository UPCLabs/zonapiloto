package grupo4.information_service.interfaces;

import grupo4.information_service.dtos.QuestionRequest;
import grupo4.information_service.dtos.QuestionResponse;
import java.util.List;

public interface IQuestionService {
    boolean questionExists(Long question_id);
    QuestionResponse getQuestion(Long question_id);
    QuestionResponse updateQuestion(
        Long question_id,
        QuestionRequest questionRequest
    );
    QuestionResponse createQuestion(QuestionRequest questionRequest);
    void deleteQuestion(Long event_id);
    List<QuestionResponse> getAllQuestions();
}
