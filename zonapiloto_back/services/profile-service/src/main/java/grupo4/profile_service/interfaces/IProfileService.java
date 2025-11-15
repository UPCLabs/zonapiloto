package grupo4.profile_service.interfaces;

import grupo4.profile_service.entities.AcademicHistory;
import grupo4.profile_service.entities.AcademicProfile;
import grupo4.profile_service.entities.Subject;
import java.util.List;

public interface IProfileService {
    AcademicProfile getProfile(Long id);

    List<AcademicProfile> getProfilesByUser(Long userId);

    AcademicProfile saveProfile(AcademicProfile profile);

    List<Subject> getSubjects(Long profileId);

    Subject addSubject(Long profileId, Subject subject);

    List<AcademicHistory> getHistory(Long profileId);

    AcademicHistory addHistory(Long profileId, AcademicHistory history);
}
