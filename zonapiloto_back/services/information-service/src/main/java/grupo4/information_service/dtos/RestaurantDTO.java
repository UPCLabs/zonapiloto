package grupo4.information_service.dtos;

import lombok.*;

@Data
public class RestaurantDTO {

    private Long ownerUserId;
    private String name;
    private String logo;
    private String location;
    private String menuUri;
    private boolean state;
}
