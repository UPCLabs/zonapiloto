package grupo4.information_service.services;

import grupo4.information_service.dtos.CategoryRequest;
import grupo4.information_service.dtos.CategoryResponse;
import grupo4.information_service.entities.Category;
import grupo4.information_service.interfaces.ICategoryService;
import grupo4.information_service.mappers.CategoryMapper;
import grupo4.information_service.repositories.ICategoryRepo;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CategoryService implements ICategoryService {

    private final ICategoryRepo categoryRepo;

    @Override
    public List<CategoryResponse> getAllCategories() {
        return categoryRepo
            .findAll()
            .stream()
            .map(CategoryMapper::toResponse)
            .toList();
    }

    public CategoryResponse createCategory(CategoryRequest dto) {
        Category category = CategoryMapper.toEntity(dto);
        Category saved = categoryRepo.save(category);
        return CategoryMapper.toResponse(saved);
    }

    public CategoryResponse updateCategory(Long id, CategoryRequest dto) {
        Category category = categoryRepo
            .findById(id)
            .orElseThrow(() ->
                new EntityNotFoundException("Categoría no encontrada")
            );

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

    @Override
    public boolean categoryExists(Long category_id) {
        return categoryRepo.existsById(category_id);
    }

    @Override
    public CategoryResponse getCategory(Long category_id) {
        Category category = categoryRepo
            .findById(category_id)
            .orElseThrow(() ->
                new EntityNotFoundException("Categoría no encontrada")
            );
        return CategoryMapper.toResponse(category);
    }
}
