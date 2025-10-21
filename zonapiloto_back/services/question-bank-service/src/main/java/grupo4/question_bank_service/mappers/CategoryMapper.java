package grupo4.question_bank_service.mappers;

import java.util.stream.Collectors;

import grupo4.question_bank_service.models.dtos.CategoryRequest;
import grupo4.question_bank_service.models.dtos.CategoryResponse;
import grupo4.question_bank_service.models.entities.Category;

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
        if (category == null)
            return null;

        return CategoryResponse.builder()
                .categoryId(category.getCategoryId())
                .name(category.getName())
                .description(category.getDescription())
                .questions(category.getQuestions().stream()
                        .map(QuestionMapper::toResponse)
                        .collect(Collectors.toList()))
                .build();
    }
}
