package grupo4.information_service.interfaces;

import grupo4.information_service.dtos.CategoryRequest;
import grupo4.information_service.dtos.CategoryResponse;
import java.util.List;

public interface ICategoryService {
    boolean categoryExists(Long category_id);
    CategoryResponse getCategory(Long category_id);
    CategoryResponse updateCategory(
        Long category_id,
        CategoryRequest categoryRequest
    );
    CategoryResponse createCategory(CategoryRequest categoryRequest);
    void deleteCategory(Long event_id);
    List<CategoryResponse> getAllCategories();
}
