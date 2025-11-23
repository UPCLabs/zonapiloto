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
    public boolean advertisementExists(Long advertisementId) {
        return advertisementRepo.existsById(advertisementId);
    }

    @Override
    public Advertisement getAdvertisement(Long advertisementId) {
        return advertisementRepo.findByIdActive(advertisementId).orElse(null);
    }

    @Override
    public Advertisement getAdvertisementAdmin(Long advertisementId) {
        return advertisementRepo.findById(advertisementId).orElse(null);
    }

    @Override
    public Advertisement updateAdvertisement(
        Long advertisementId,
        AdvertisementDTO advertisementDTO
    ) {
        Advertisement advertisement = advertisementRepo
            .findById(advertisementId)
            .orElseThrow();

        advertisement.setTitle(advertisementDTO.getTitle());
        advertisement.setDescription(advertisementDTO.getDescription());
        advertisement.setDate(advertisementDTO.getDate());
        advertisement.setType(advertisementDTO.getType());
        advertisement.setState(advertisementDTO.isState());

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
    public void deleteAdvertisement(Long advertisementId) {
        advertisementRepo.deleteById(advertisementId);
    }

    @Override
    public List<Advertisement> getAllAdvertisements() {
        return advertisementRepo.findAllActive();
    }

    @Override
    public List<Advertisement> getAllAdminAdvertisements() {
        return advertisementRepo.findAll();
    }
}
