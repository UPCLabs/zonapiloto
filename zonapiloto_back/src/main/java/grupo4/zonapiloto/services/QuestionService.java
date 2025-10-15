package grupo4.zonapiloto.services;

import grupo4.zonapiloto.models.dtos.QuestionRequest;
import grupo4.zonapiloto.models.dtos.QuestionResponse;
import grupo4.zonapiloto.models.entitys.Category;
import grupo4.zonapiloto.models.entitys.Question;
import grupo4.zonapiloto.models.repositories.CategoryRepo;
import grupo4.zonapiloto.models.repositories.QuestionRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class QuestionService {

    private final QuestionRepo questionRepository;
    private final CategoryRepo categoryRepository;

    public QuestionService(QuestionRepo questionRepository, CategoryRepo categoryRepository) {
        this.questionRepository = questionRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<QuestionResponse> getAllQuestionsDTO() {
        return questionRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    public Optional<Question> getById(Long id) {
        return questionRepository.findById(id);
    }

    public QuestionResponse createQuestion(QuestionRequest dto) {
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada"));

        Question question = new Question();
        question.setQuestion(dto.getQuestion());
        question.setAnswer(dto.getAnswer());
        question.setCategory(category);

        Question saved = questionRepository.save(question);
        return mapToResponse(saved);
    }

    public QuestionResponse updateQuestion(Long id, QuestionRequest dto) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Pregunta no encontrada"));

        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada"));

        question.setQuestion(dto.getQuestion());
        question.setAnswer(dto.getAnswer());
        question.setCategory(category);

        Question updated = questionRepository.save(question);
        return mapToResponse(updated);
    }

    public void delete(Long id) {
        questionRepository.deleteById(id);
    }

    public QuestionResponse mapToResponse(Question question) {
        QuestionResponse resp = new QuestionResponse();
        resp.setQuestionId(question.getQuestionId());
        resp.setQuestion(question.getQuestion());
        resp.setAnswer(question.getAnswer());
        resp.setCategoryId(question.getCategory().getCategoryId());
        resp.setCategoryName(question.getCategory().getName());
        return resp;
    }
}
