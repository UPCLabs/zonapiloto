package grupo4.profile_service.entities;

import jakarta.persistence.*;
import java.math.BigDecimal;
import lombok.*;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "academic_subjects")
public class Subject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id", nullable = false)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private AcademicProfile profile;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "code")
    private String code;

    @Column(name = "credits")
    private Integer credits;

    @Column(name = "hours_attended")
    private Integer hoursAttended;

    @Column(name = "semester_taken")
    private Integer semesterTaken;

    @Column(name = "grade", precision = 4, scale = 2)
    private BigDecimal grade;
}
