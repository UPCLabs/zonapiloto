package grupo4.question_bank_service.models.dtos;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryResponse {

    private Long categoryId;
    private String name;
    private String description;
    private List<QuestionResponse> questions;
}
