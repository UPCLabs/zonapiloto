package grupo4.information_service.dtos;

import java.util.List;
import lombok.*;

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
