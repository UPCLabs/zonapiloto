package grupo4.zonapiloto.services;

import grupo4.zonapiloto.models.dtos.CategoryRequest;
import grupo4.zonapiloto.models.dtos.CategoryResponse;
import grupo4.zonapiloto.models.dtos.QuestionResponse;
import grupo4.zonapiloto.models.entitys.Category;
import grupo4.zonapiloto.models.entitys.Question;
import grupo4.zonapiloto.models.repositories.CategoryRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    private final CategoryRepo categoryRepo;

    public CategoryService(CategoryRepo categoryRepo) {
        this.categoryRepo = categoryRepo;
    }

    public List<CategoryResponse> getAllCategoriesDTO() {
        return categoryRepo.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    public Optional<Category> getCategoryById(Long id) {
        return categoryRepo.findById(id);
    }

    public CategoryResponse createCategory(CategoryRequest dto) {
        Category category = new Category();
        category.setName(dto.getName());
        category.setDescription(dto.getDescription());

        Category saved = categoryRepo.save(category);
        return mapToResponse(saved);
    }

    public CategoryResponse updateCategory(Long id, CategoryRequest dto) {
        Category category = categoryRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada"));

        category.setName(dto.getName());
        category.setDescription(dto.getDescription());

        Category updated = categoryRepo.save(category);
        return mapToResponse(updated);
    }

    public void deleteCategory(Long id) {
        categoryRepo.deleteById(id);
    }

    public CategoryResponse mapToResponse(Category category) {
        CategoryResponse resp = new CategoryResponse();
        resp.setCategoryId(category.getCategoryId());
        resp.setName(category.getName());
        resp.setDescription(category.getDescription());

        if (category.getQuestions() != null) {
            resp.setQuestions(category.getQuestions().stream()
                    .map(this::mapQuestionToResponse)
                    .toList());
        }

        return resp;
    }

    private QuestionResponse mapQuestionToResponse(Question question) {
        QuestionResponse qr = new QuestionResponse();
        qr.setQuestionId(question.getQuestionId());
        qr.setQuestion(question.getQuestion());
        qr.setAnswer(question.getAnswer());
        qr.setCategoryId(question.getCategory().getCategoryId());
        qr.setCategoryName(question.getCategory().getName());
        return qr;
    }
}
