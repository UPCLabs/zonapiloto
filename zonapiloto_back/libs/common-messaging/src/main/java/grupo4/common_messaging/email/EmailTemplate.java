package grupo4.common_messaging.email;

public enum EmailTemplate {
    USER_REGISTER,
    ADMIN_NEW_USER,
    PASSWORD_RESET,
    USER_ACCEPTED,
    USER_REJECTED,
    SUPPORT_EMAIL,
    EMAIL_VERIFY;

    @Override
    public String toString() {
        return name().toLowerCase();
    }
}
