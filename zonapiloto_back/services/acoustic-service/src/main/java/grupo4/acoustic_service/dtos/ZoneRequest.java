package grupo4.acoustic_service.dtos;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ZoneRequest(
    @NotBlank @Size(max = 10) @Pattern(regexp = "[A-Za-z0-9-]+") String code,
    @NotBlank @Size(max = 80) String name,
    @Size(max = 255) String description,
    @NotNull @DecimalMin("0") @DecimalMax("100") Double mapX,
    @NotNull @DecimalMin("0") @DecimalMax("100") Double mapY,
    Boolean active
) {}
