package grupo4.acoustic_service.dtos;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * The complete payload of a measurement. It carries numeric descriptors only;
 * there is deliberately no field that could hold audio.
 */
public record SampleRequest(
    @NotNull Long zoneId,
    @NotBlank @Size(min = 16, max = 64) @Pattern(regexp = "[A-Za-z0-9-]+") String deviceId,
    @NotNull @DecimalMin("-160") @DecimalMax("0") Double leqDbfs,
    @NotNull @DecimalMin("0") @DecimalMax("120") Double durationSeconds,
    @NotNull @DecimalMin("0") @DecimalMax("1") Double clippingRatio
) {}
