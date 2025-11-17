package grupo4.profile_service.controllers;

import grupo4.profile_service.entities.AcademicHistory;
import grupo4.profile_service.entities.AcademicProfile;
import grupo4.profile_service.entities.Subject;
import grupo4.profile_service.services.ProfileService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping("/{id}")
    public AcademicProfile getProfile(@PathVariable Long id) {
        AcademicProfile profile = profileService.getProfile(id);
        if (profile == null) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Perfil no encontrado"
            );
        }
        return profile;
    }

    @GetMapping("/user/{userId}")
    public List<AcademicProfile> getProfilesByUser(@PathVariable Long userId) {
        List<AcademicProfile> profiles = profileService.getProfilesByUser(
            userId
        );
        if (profiles == null || profiles.isEmpty()) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "No hay perfiles para este usuario"
            );
        }
        return profiles;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AcademicProfile saveProfile(@RequestBody AcademicProfile profile) {
        if (profile == null) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Datos inválidos"
            );
        }
        return profileService.saveProfile(profile);
    }

    @GetMapping("/{profileId}/subjects")
    public List<Subject> getSubjects(@PathVariable Long profileId) {
        List<Subject> subjects = profileService.getSubjects(profileId);
        if (subjects == null) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Perfil no encontrado"
            );
        }
        return subjects;
    }

    @PostMapping("/{profileId}/subjects")
    @ResponseStatus(HttpStatus.CREATED)
    public Subject addSubject(
        @PathVariable Long profileId,
        @RequestBody Subject subject
    ) {
        Subject created = profileService.addSubject(profileId, subject);
        if (created == null) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Perfil no encontrado"
            );
        }
        return created;
    }

    @GetMapping("/{profileId}/history")
    public List<AcademicHistory> getHistory(@PathVariable Long profileId) {
        List<AcademicHistory> history = profileService.getHistory(profileId);
        if (history == null) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Perfil no encontrado"
            );
        }
        return history;
    }

    @PostMapping("/{profileId}/history")
    @ResponseStatus(HttpStatus.CREATED)
    public AcademicHistory addHistory(
        @PathVariable Long profileId,
        @RequestBody AcademicHistory history
    ) {
        AcademicHistory created = profileService.addHistory(profileId, history);
        if (created == null) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Perfil no encontrado"
            );
        }
        return created;
    }
}
