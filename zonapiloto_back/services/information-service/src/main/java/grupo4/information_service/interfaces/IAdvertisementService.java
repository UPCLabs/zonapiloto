package grupo4.information_service.interfaces;

import grupo4.information_service.dtos.AdvertisementDTO;
import grupo4.information_service.entities.Advertisement;
import java.util.List;

public interface IAdvertisementService {
    boolean advertisementExists(Long advertisement_id);
    Advertisement getAdvertisement(Long advertisement_id);
    Advertisement updateAdvertisement(
        Long advertisement_id,
        AdvertisementDTO advertisementDTO
    );
    Advertisement createAdvertisement(AdvertisementDTO advertisementDTO);
    void deleteAdvertisement(Long advertisement_id);
    List<Advertisement> getAllAdvertisements();
    List<Advertisement> getAllAdminAdvertisements();
}
