package grupo4.information_service.dtos;

import grupo4.information_service.enums.AdvertisementType;
import java.time.LocalDate;
import lombok.*;

@Data
public class AdvertisementDTO {

    private String title;
    private String description;
    private LocalDate date;
    private AdvertisementType type;
    private boolean state;
}
