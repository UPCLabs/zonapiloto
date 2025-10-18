package grupo4.zonapiloto.mappers;

import grupo4.zonapiloto.models.dtos.QuestionRequest;
import grupo4.zonapiloto.models.dtos.QuestionResponse;
import grupo4.zonapiloto.models.entities.Category;
import grupo4.zonapiloto.models.entities.Question;

public class QuestionMapper {
    public static Question toEntity(QuestionRequest request, Category category) {
        if (request == null || category == null)
            return null;

        return Question.builder()
                .question(request.getQuestion())
                .answer(request.getAnswer())
                .category(category)
                .build();
    }

    public static QuestionResponse toResponse(Question question) {
        if (question == null)
            return null;

        return QuestionResponse.builder()
                .questionId(question.getQuestionId())
                .question(question.getQuestion())
                .answer(question.getAnswer())
                .categoryId(question.getCategory().getCategoryId())
                .categoryName(question.getCategory().getName())
                .build();
    }
}
