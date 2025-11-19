package grupo4.information_service.dtos;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionRequest {

    private String question;
    private String answer;
    private String categoryName;
}
