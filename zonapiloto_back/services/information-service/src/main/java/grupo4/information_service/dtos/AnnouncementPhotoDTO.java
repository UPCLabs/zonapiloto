package grupo4.information_service.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AnnouncementPhotoDTO {

    private Long id;
    private String title;
    private String url;
    private boolean active;
}
