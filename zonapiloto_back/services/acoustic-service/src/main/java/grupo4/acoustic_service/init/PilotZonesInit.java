package grupo4.acoustic_service.init;

import grupo4.acoustic_service.entities.Zone;
import grupo4.acoustic_service.repositories.ZoneRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * Seeds the five pilot zones on an empty database. Positions project the
 * isometric campus map ("Conoce tu universidad") onto a top-down plan with
 * Carrera 8 on the left, Calle 46 at the bottom, and Cra. 13 on the right.
 */
@Component
@RequiredArgsConstructor
public class PilotZonesInit implements CommandLineRunner {

    private final ZoneRepository zoneRepository;

    private record Seed(String code, String name, String description, double x, double y) {}

    private static final List<Seed> PILOT_ZONES = List.of(
        new Seed("A", "Sede A", "Biblioteca", 28, 40),
        new Seed(
            "F",
            "Sede F",
            "Facultad de Arquitectura y Artes, zona de cafetería y laboratorios",
            33,
            14
        ),
        new Seed(
            "D",
            "Sede D",
            "Laboratorio de Informática, salas de cómputo y Mediexpress",
            55,
            20
        ),
        new Seed(
            "G",
            "Sede G",
            "Salas de cómputo, Dirección de Tecnología y sala múltiple",
            57,
            52
        ),
        new Seed(
            "APR",
            "Sede APR",
            "Auditorios, plazoleta de comidas, salones y salas de cómputo",
            46,
            80
        )
    );

    @Override
    public void run(String... args) {
        if (zoneRepository.count() > 0) {
            return;
        }
        for (Seed seed : PILOT_ZONES) {
            Zone zone = new Zone();
            zone.setCode(seed.code());
            zone.setName(seed.name());
            zone.setDescription(seed.description());
            zone.setMapX(seed.x());
            zone.setMapY(seed.y());
            zoneRepository.save(zone);
        }
    }
}
