package grupo4.auth_service.services;

import grupo4.auth_service.entities.UserDocument;
import grupo4.auth_service.repositories.UserDocumentRepo;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDocumentService {

    private final UserDocumentRepo userDocumentRepo;
    private final StorageService storageService;

    public UserDocument create(Long userId, String documentName, String uri) {
        String newUri = storageService.moveToPermanentStorage(uri, userId);

        UserDocument doc = UserDocument.builder()
            .userId(userId)
            .documentName(documentName)
            .documentUri(newUri)
            .build();

        return userDocumentRepo.save(doc);
    }

    public List<UserDocument> getAll(Long userId) {
        return userDocumentRepo.findByUserId(userId);
    }

    public UserDocument get(Long id) {
        return userDocumentRepo.findById(id).orElse(null);
    }

    public UserDocument update(Long id, String newDocumentName) {
        UserDocument existing = get(id);
        if (existing == null) return null;

        existing.setDocumentName(newDocumentName);

        return userDocumentRepo.save(existing);
    }

    public boolean delete(Long id) {
        UserDocument doc = get(id);
        if (doc == null) return false;

        storageService.deleteFile(doc.getDocumentUri());
        userDocumentRepo.delete(doc);

        return true;
    }

    public void deleteAll(Long userId) {
        List<UserDocument> docs = getAll(userId);

        docs.forEach(d -> storageService.deleteFile(d.getDocumentUri()));

        userDocumentRepo.deleteAll(docs);
    }
}
