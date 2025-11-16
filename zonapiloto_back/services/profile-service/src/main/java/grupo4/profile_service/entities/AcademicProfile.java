package grupo4.profile_service.entities;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.List;
import lombok.*;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "academic_profile")
public class AcademicProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "program", nullable = false)
    private String program;

    @Column(name = "current_semester")
    private Integer currentSemester;

    @Column(name = "gpa", precision = 3, scale = 2)
    private BigDecimal gpa;

    @Column(name = "status")
    private String status;

    @OneToMany(
        mappedBy = "profile",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private List<Subject> subjects;

    @OneToMany(
        mappedBy = "profile",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private List<AcademicHistory> histories;
}
