package grupo4.information_service.mappers;

import grupo4.information_service.dtos.CategoryRequest;
import grupo4.information_service.dtos.CategoryResponse;
import grupo4.information_service.entities.Category;

public class CategoryMapper {

    public static Category toEntity(CategoryRequest request) {
        if (request == null) {
            return null;
        }

        return Category.builder()
            .name(request.getName())
            .description(request.getDescription())
            .build();
    }

    public static CategoryResponse toResponse(Category category) {
        if (category == null) return null;

        return CategoryResponse.builder()
            .categoryId(category.getCategoryId())
            .name(category.getName())
            .description(category.getDescription())
            .build();
    }
}
