package grupo4.profile_service.entities;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.*;

@Entity
@Table(name = "academic_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AcademicHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id", nullable = false)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private AcademicProfile profile;

    @Column(name = "semester_average", precision = 4, scale = 2)
    private BigDecimal semesterAverage;

    @Column(name = "semester_number")
    private Integer semesterNumber;

    @Column(name = "updated_at")
    private LocalDate updatedAt;
}
