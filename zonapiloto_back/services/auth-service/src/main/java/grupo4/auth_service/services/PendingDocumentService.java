package grupo4.auth_service.services;

import grupo4.auth_service.entities.PendingDocument;
import grupo4.auth_service.repositories.PendingDocumentRepo;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class PendingDocumentService {

    private final PendingDocumentRepo pendingDocumentRepo;
    private final StorageService storageService;

    public PendingDocument createDocument(
        Long pendingUserId,
        String docName,
        MultipartFile file
    ) {
        String uri = storageService.saveTemporaryFile(
            file,
            pendingUserId,
            docName
        );

        PendingDocument doc = PendingDocument.builder()
            .pendingUserId(pendingUserId)
            .documentName(docName)
            .documentUri(uri)
            .build();

        return pendingDocumentRepo.save(doc);
    }

    public List<PendingDocument> getAllPendingDocuments(Long pendingUserId) {
        return pendingDocumentRepo.findByPendingUserId(pendingUserId);
    }

    public PendingDocument getById(Long id) {
        return pendingDocumentRepo.findById(id).orElse(null);
    }

    public PendingDocument updateDocument(Long id, String newDocumentName) {
        PendingDocument existing = getById(id);
        if (existing == null) return null;

        existing.setDocumentName(newDocumentName);

        return pendingDocumentRepo.save(existing);
    }

    public void deleteDocument(Long id) {
        PendingDocument doc = getById(id);
        if (doc != null) {
            storageService.deleteFile(doc.getDocumentUri());

            pendingDocumentRepo.delete(doc);
        }
    }

    public void deleteAllDocumentsForPendingUser(Long pendingUserId) {
        List<PendingDocument> docs = getAllPendingDocuments(pendingUserId);

        docs.forEach(d -> storageService.deleteFile(d.getDocumentUri()));

        pendingDocumentRepo.deleteAll(docs);
    }
}
