package grupo4.question_bank_service.models.dtos;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionResponse {
    private Long questionId;
    private String question;
    private String answer;
    private Long categoryId;
    private String categoryName;
}
