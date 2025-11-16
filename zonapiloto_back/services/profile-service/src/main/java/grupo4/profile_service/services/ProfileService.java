package grupo4.profile_service.services;

import grupo4.profile_service.entities.AcademicHistory;
import grupo4.profile_service.entities.AcademicProfile;
import grupo4.profile_service.entities.Subject;
import grupo4.profile_service.interfaces.IProfileService;
import grupo4.profile_service.repositories.AcademicHistoryRepository;
import grupo4.profile_service.repositories.AcademicProfileRepository;
import grupo4.profile_service.repositories.SubjectRepository;
import grupo4.profile_service.services.ProfileService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProfileService implements IProfileService {

    private final AcademicProfileRepository profileRepository;
    private final SubjectRepository subjectRepository;
    private final AcademicHistoryRepository historyRepository;

    @Override
    public AcademicProfile getProfile(Long id) {
        return profileRepository
            .findById(id)
            .orElseThrow(() -> new RuntimeException("Profile not found"));
    }

    @Override
    public List<AcademicProfile> getProfilesByUser(Long userId) {
        return profileRepository.findByUserId(userId);
    }

    @Override
    public AcademicProfile saveProfile(AcademicProfile profile) {
        return profileRepository.save(profile);
    }

    @Override
    public List<Subject> getSubjects(Long profileId) {
        return subjectRepository.findByProfileId(profileId);
    }

    @Override
    public Subject addSubject(Long profileId, Subject subject) {
        AcademicProfile profile = getProfile(profileId);
        subject.setProfile(profile);
        return subjectRepository.save(subject);
    }

    @Override
    public List<AcademicHistory> getHistory(Long profileId) {
        return historyRepository.findByProfileId(profileId);
    }

    @Override
    public AcademicHistory addHistory(Long profileId, AcademicHistory history) {
        AcademicProfile profile = getProfile(profileId);
        history.setProfile(profile);
        return historyRepository.save(history);
    }
}
