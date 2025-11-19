package grupo4.information_service.mappers;

import grupo4.information_service.dtos.QuestionRequest;
import grupo4.information_service.dtos.QuestionResponse;
import grupo4.information_service.entities.Category;
import grupo4.information_service.entities.Question;

public class QuestionMapper {

    public static Question toEntity(
        QuestionRequest request,
        Category category
    ) {
        if (request == null || category == null) return null;

        return Question.builder()
            .question(request.getQuestion())
            .answer(request.getAnswer())
            .category(category)
            .build();
    }

    public static QuestionResponse toResponse(Question question) {
        if (question == null) return null;

        return QuestionResponse.builder()
            .questionId(question.getQuestionId())
            .question(question.getQuestion())
            .answer(question.getAnswer())
            .categoryId(question.getCategory().getCategoryId())
            .categoryName(question.getCategory().getName())
            .build();
    }
}
