package grupo4.information_service.controllers;

import grupo4.information_service.dtos.CategoryRequest;
import grupo4.information_service.dtos.CategoryResponse;
import grupo4.information_service.interfaces.ICategoryService;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/information/question-bank/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final ICategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getAllCategories() {
        List<CategoryResponse> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponse> getCategoryById(
        @PathVariable Long id
    ) {
        try {
            CategoryResponse response = categoryService.getCategory(id);
            return ResponseEntity.ok(response);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('QUESTIONSADMIN', 'ADMIN', 'SUPERADMIN')")
    public ResponseEntity<CategoryResponse> createCategory(
        @RequestBody CategoryRequest dto
    ) {
        CategoryResponse response = categoryService.createCategory(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('QUESTIONSADMIN','ADMIN', 'SUPERADMIN')")
    public ResponseEntity<CategoryResponse> updateCategory(
        @PathVariable Long id,
        @RequestBody CategoryRequest dto
    ) {
        try {
            CategoryResponse updated = categoryService.updateCategory(id, dto);
            return ResponseEntity.ok(updated);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('QUESTIONSADMIN','ADMIN', 'SUPERADMIN')")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        try {
            categoryService.deleteCategory(id);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
