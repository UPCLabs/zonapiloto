package grupo4.information_service.interfaces;

import grupo4.information_service.dtos.AdvertisementDTO;
import grupo4.information_service.entities.Advertisement;
import java.util.List;

public interface IAdvertisementService {
    boolean advertisementExists(Long advertisementId);
    Advertisement getAdvertisement(Long advertisementId);
    Advertisement getAdvertisementAdmin(Long advertisementId);
    Advertisement updateAdvertisement(
        Long advertisementId,
        AdvertisementDTO advertisementDTO
    );
    Advertisement createAdvertisement(AdvertisementDTO advertisementDTO);
    void deleteAdvertisement(Long advertisementId);
    List<Advertisement> getAllAdvertisements();
    List<Advertisement> getAllAdminAdvertisements();
}
