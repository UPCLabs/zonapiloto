package grupo4.zonapiloto.services;

import grupo4.zonapiloto.mappers.QuestionMapper;
import grupo4.zonapiloto.models.dtos.QuestionRequest;
import grupo4.zonapiloto.models.dtos.QuestionResponse;
import grupo4.zonapiloto.models.entities.Category;
import grupo4.zonapiloto.models.entities.Question;
import grupo4.zonapiloto.models.repositories.CategoryRepo;
import grupo4.zonapiloto.models.repositories.QuestionRepo;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepo questionRepository;
    private final CategoryRepo categoryRepository;

    public List<QuestionResponse> getAllQuestionsDTO() {
        return questionRepository.findAll().stream()
                .map(QuestionMapper::toResponse)
                .toList();
    }

    public QuestionResponse getById(Long id) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Pregunta no encontrada"));
        return QuestionMapper.toResponse(question);
    }

    public QuestionResponse createQuestion(QuestionRequest dto) {
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new EntityNotFoundException("Categoría no encontrada"));

        Question question = QuestionMapper.toEntity(dto, category);
        Question saved = questionRepository.save(question);

        return QuestionMapper.toResponse(saved);
    }

    public QuestionResponse updateQuestion(Long id, QuestionRequest dto) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Pregunta no encontrada"));

        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new EntityNotFoundException("Categoría no encontrada"));

        question.setQuestion(dto.getQuestion());
        question.setAnswer(dto.getAnswer());
        question.setCategory(category);

        Question updated = questionRepository.save(question);
        return QuestionMapper.toResponse(updated);
    }

    public void delete(Long id) {
        if (!questionRepository.existsById(id)) {
            throw new EntityNotFoundException("Pregunta no encontrada");
        }
        questionRepository.deleteById(id);
    }
}
