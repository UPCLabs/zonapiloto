package grupo4.profile_service.controllers;

import grupo4.profile_service.entities.AcademicHistory;
import grupo4.profile_service.entities.AcademicProfile;
import grupo4.profile_service.entities.Subject;
import grupo4.profile_service.services.ProfileService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping("/{id}")
    public AcademicProfile getProfile(@PathVariable Long id) {
        return profileService.getProfile(id);
    }

    @GetMapping("/user/{userId}")
    public List<AcademicProfile> getProfilesByUser(@PathVariable Long userId) {
        return profileService.getProfilesByUser(userId);
    }

    @PostMapping
    public AcademicProfile saveProfile(@RequestBody AcademicProfile profile) {
        return profileService.saveProfile(profile);
    }

    @GetMapping("/{profileId}/subjects")
    public List<Subject> getSubjects(@PathVariable Long profileId) {
        return profileService.getSubjects(profileId);
    }

    @PostMapping("/{profileId}/subjects")
    public Subject addSubject(
        @PathVariable Long profileId,
        @RequestBody Subject subject
    ) {
        return profileService.addSubject(profileId, subject);
    }

    @GetMapping("/{profileId}/history")
    public List<AcademicHistory> getHistory(@PathVariable Long profileId) {
        return profileService.getHistory(profileId);
    }

    @PostMapping("/{profileId}/history")
    public AcademicHistory addHistory(
        @PathVariable Long profileId,
        @RequestBody AcademicHistory history
    ) {
        return profileService.addHistory(profileId, history);
    }
}
