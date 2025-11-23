package grupo4.information_service.services;

import grupo4.information_service.dtos.QuestionRequest;
import grupo4.information_service.dtos.QuestionResponse;
import grupo4.information_service.entities.Category;
import grupo4.information_service.entities.Question;
import grupo4.information_service.interfaces.IQuestionService;
import grupo4.information_service.mappers.QuestionMapper;
import grupo4.information_service.repositories.ICategoryRepo;
import grupo4.information_service.repositories.IQuestionRepo;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class QuestionService implements IQuestionService {

    private final IQuestionRepo questionRepository;
    private final ICategoryRepo categoryRepository;

    public QuestionResponse createQuestion(QuestionRequest dto) {
        Category category = categoryRepository
            .findByName(dto.getCategoryName())
            .orElseThrow(() ->
                new EntityNotFoundException("Categoría no encontrada")
            );

        Question question = QuestionMapper.toEntity(dto, category);
        Question saved = questionRepository.save(question);

        return QuestionMapper.toResponse(saved);
    }

    public QuestionResponse updateQuestion(Long id, QuestionRequest dto) {
        Question question = questionRepository
            .findById(id)
            .orElseThrow(() ->
                new EntityNotFoundException("Pregunta no encontrada")
            );

        Category category = categoryRepository
            .findByName(dto.getCategoryName())
            .orElseThrow(() ->
                new EntityNotFoundException("Categoría no encontrada")
            );

        question.setQuestion(dto.getQuestion());
        question.setAnswer(dto.getAnswer());
        question.setCategory(category);

        Question updated = questionRepository.save(question);
        return QuestionMapper.toResponse(updated);
    }

    @Override
    public boolean questionExists(Long question_id) {
        return questionRepository.existsById(question_id);
    }

    @Override
    public QuestionResponse getQuestion(Long question_id) {
        Question question = questionRepository
            .findById(question_id)
            .orElseThrow(() ->
                new EntityNotFoundException("Pregunta no encontrada")
            );
        return QuestionMapper.toResponse(question);
    }

    @Override
    public void deleteQuestion(Long event_id) {
        if (!questionRepository.existsById(event_id)) {
            throw new EntityNotFoundException("Pregunta no encontrada");
        }
        questionRepository.deleteById(event_id);
    }

    @Override
    public List<QuestionResponse> getAllQuestions() {
        return questionRepository
            .findAll()
            .stream()
            .map(QuestionMapper::toResponse)
            .toList();
    }
}
