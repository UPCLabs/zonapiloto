package grupo4.zonapiloto.models.dtos;

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
