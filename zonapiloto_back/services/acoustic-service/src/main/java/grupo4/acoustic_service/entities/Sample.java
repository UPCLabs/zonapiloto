package grupo4.acoustic_service.entities;

import grupo4.acoustic_service.enums.RejectionReason;
import grupo4.acoustic_service.enums.SampleStatus;
import grupo4.acoustic_service.enums.TimeSlot;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.DayOfWeek;
import java.time.Instant;
import java.time.LocalDate;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * One measurement. Only numeric descriptors computed on the device are
 * stored; audio never reaches the server.
 */
@Entity
@Table(
    name = "samples",
    indexes = {
        @Index(name = "idx_samples_zone_captured", columnList = "zone_id,captured_at"),
        @Index(name = "idx_samples_device_zone", columnList = "device_hash,zone_id,captured_at"),
    }
)
@Getter
@Setter
@NoArgsConstructor
public class Sample {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "zone_id", nullable = false)
    private Zone zone;

    @Column(nullable = false)
    private double leqDbfs;

    @Column(name = "acoustic_index", nullable = false)
    private double acousticIndex;

    @Column(nullable = false)
    private double durationSeconds;

    @Column(nullable = false)
    private double clippingRatio;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private SampleStatus status;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private RejectionReason rejectionReason;

    /** Salted SHA-256 of the anonymous device identifier, used only for rate limiting. */
    @Column(name = "device_hash", nullable = false, length = 64)
    private String deviceHash;

    @Column(name = "captured_at", nullable = false)
    private Instant capturedAt;

    @Column(nullable = false)
    private LocalDate localDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private DayOfWeek dayOfWeek;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private TimeSlot timeSlot;
}
