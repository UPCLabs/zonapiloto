package grupo4.information_service.services;

import grupo4.information_service.dtos.AdvertisementDTO;
import grupo4.information_service.entities.Advertisement;
import grupo4.information_service.interfaces.IAdvertisementService;
import grupo4.information_service.repositories.IAdvertisementRepo;
import java.util.List;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AdvertisementService implements IAdvertisementService {

    private final IAdvertisementRepo advertisementRepo;

    @Override
    public boolean advertisementExists(Long advertisement_id) {
        return advertisementRepo.existsById(advertisement_id);
    }

    @Override
    public Advertisement getAdvertisement(Long advertisement_id) {
        return advertisementRepo.findById(advertisement_id).orElse(null);
    }

    @Override
    public Advertisement updateAdvertisement(
        Long advertisement_id,
        AdvertisementDTO advertisementDTO
    ) {
        Advertisement advertisement = advertisementRepo
            .findById(advertisement_id)
            .orElseThrow();

        advertisement.setTitle(advertisementDTO.getTitle());
        advertisement.setDescription(advertisementDTO.getDescription());
        advertisement.setDate(advertisementDTO.getDate());
        advertisement.setType(advertisementDTO.getType());

        return advertisementRepo.save(advertisement);
    }

    @Override
    public Advertisement createAdvertisement(
        AdvertisementDTO advertisementDTO
    ) {
        Advertisement advertisement = Advertisement.builder()
            .title(advertisementDTO.getTitle())
            .description(advertisementDTO.getDescription())
            .date(advertisementDTO.getDate())
            .type(advertisementDTO.getType())
            .build();

        return advertisementRepo.save(advertisement);
    }

    @Override
    public void deleteAdvertisement(Long advertisement_id) {
        advertisementRepo.deleteById(advertisement_id);
    }

    @Override
    public List<Advertisement> getAllAdvertisements() {
        return advertisementRepo.findAll();
    }
}
