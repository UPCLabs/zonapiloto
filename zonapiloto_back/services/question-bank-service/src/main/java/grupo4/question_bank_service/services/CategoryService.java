package grupo4.question_bank_service.services;

import grupo4.question_bank_service.mappers.CategoryMapper;
import grupo4.question_bank_service.models.dtos.CategoryRequest;
import grupo4.question_bank_service.models.dtos.CategoryResponse;
import grupo4.question_bank_service.models.entities.Category;
import grupo4.question_bank_service.models.repositories.CategoryRepo;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepo categoryRepo;

    public List<CategoryResponse> getAllCategoriesDTO() {
        return categoryRepo.findAll().stream()
                .map(CategoryMapper::toResponse)
                .toList();
    }

    public CategoryResponse getCategoryById(Long id) {
        Category category = categoryRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Categoría no encontrada"));
        return CategoryMapper.toResponse(category);
    }

    public CategoryResponse createCategory(CategoryRequest dto) {
        Category category = CategoryMapper.toEntity(dto);
        Category saved = categoryRepo.save(category);
        return CategoryMapper.toResponse(saved);
    }

    public CategoryResponse updateCategory(Long id, CategoryRequest dto) {
        Category category = categoryRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Categoría no encontrada"));

        category.setName(dto.getName());
        category.setDescription(dto.getDescription());

        Category updated = categoryRepo.save(category);
        return CategoryMapper.toResponse(updated);
    }

    public void deleteCategory(Long id) {
        if (!categoryRepo.existsById(id)) {
            throw new EntityNotFoundException("Categoría no encontrada");
        }
        categoryRepo.deleteById(id);
    }
}
