package grupo4.zonapiloto.models.dtos;

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
