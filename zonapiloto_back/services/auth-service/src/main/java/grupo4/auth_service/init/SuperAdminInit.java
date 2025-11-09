package grupo4.auth_service.init;

import grupo4.auth_service.entities.User;
import grupo4.auth_service.enums.UserRole;
import grupo4.auth_service.repositories.UserRepository;
import grupo4.auth_service.util.UserUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class SuperAdminInit implements CommandLineRunner {

    private final UserRepository userRepository;

    @Value("${superadmin.username}")
    private String superAdminUsername;

    @Value("${superadmin.password}")
    private String superAdminPassword;

    public SuperAdminInit(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) {
        if (userRepository.findByUsername(superAdminUsername).isEmpty()) {
            User superAdmin = new User();
            superAdmin.setUsername(superAdminUsername);
            superAdmin.setPassword(
                UserUtil.encryptPassword(superAdminPassword)
            );
            superAdmin.setMfaPending(true);
            superAdmin.setRole(UserRole.SUPERADMIN);

            userRepository.save(superAdmin);
            System.out.println("SUPERADMIN created: " + superAdminUsername);
        } else {
            System.out.println("SUPERADMIN exists, Not create a new one");
        }
    }
}
