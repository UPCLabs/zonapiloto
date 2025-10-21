package grupo4.question_bank_service.models.dtos;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionRequest {
    private String question;
    private String answer;
    private Long categoryId;
}
