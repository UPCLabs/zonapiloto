package grupo4.notification_service.services;

import com.lowagie.text.Document;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import grupo4.common_messaging.email.EmailTemplate;
import grupo4.common_messaging.events.EmailEvent;
import jakarta.mail.internet.MimeMessage;
import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    @Value("${spring.mail.username}")
    private String hostMail;

    private final JavaMailSender mailSender;

    @Async
    public void sendEmail(EmailEvent request) {
        try {
            String html = loadTemplate(request.getTemplate().toString());

            for (var entry : request.getVariables().entrySet()) {
                html = html.replace(
                    "{{" + entry.getKey() + "}}",
                    entry.getValue()
                );
            }

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(
                message,
                true,
                "UTF-8"
            );

            helper.setFrom("ZonaPiloto <" + hostMail + ">");
            helper.setTo(request.getTo());
            helper.setSubject(request.getSubject());
            helper.setText(html, true);

            if (request.getTemplate() == EmailTemplate.USER_ACCEPTED) {
                byte[] pdfBytes = generatePdf(request);

                if (pdfBytes != null) {
                    helper.addAttachment(
                        "credenciales.pdf",
                        new org.springframework.core.io.ByteArrayResource(
                            pdfBytes
                        )
                    );
                }
            }

            mailSender.send(message);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private byte[] generatePdf(EmailEvent request) {
        try (var output = new ByteArrayOutputStream()) {
            Document document = new Document();
            PdfWriter.getInstance(document, output);

            document.open();

            var red = new java.awt.Color(200, 0, 0);
            com.lowagie.text.Font titleFont = new com.lowagie.text.Font(
                com.lowagie.text.Font.HELVETICA,
                24,
                com.lowagie.text.Font.BOLD,
                red
            );

            com.lowagie.text.Font labelFont = new com.lowagie.text.Font(
                com.lowagie.text.Font.HELVETICA,
                12,
                com.lowagie.text.Font.BOLD
            );

            com.lowagie.text.Font valueFont = new com.lowagie.text.Font(
                com.lowagie.text.Font.HELVETICA,
                12,
                com.lowagie.text.Font.NORMAL
            );

            Paragraph title = new Paragraph("ZonaPiloto", titleFont);
            title.setAlignment(Paragraph.ALIGN_CENTER);
            document.add(title);

            document.add(new Paragraph("\n"));

            Paragraph subtitle = new Paragraph(
                "Reporte generado automáticamente",
                new com.lowagie.text.Font(com.lowagie.text.Font.HELVETICA, 12)
            );
            subtitle.setAlignment(Paragraph.ALIGN_CENTER);
            document.add(subtitle);

            document.add(new Paragraph("\n\n"));

            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(100);
            table.setSpacingBefore(10);
            table.setWidths(new float[] { 30, 70 });

            for (var entry : request.getVariables().entrySet()) {
                PdfPCell keyCell = new PdfPCell(
                    new Paragraph(entry.getKey(), labelFont)
                );
                keyCell.setPadding(10);
                keyCell.setBackgroundColor(new java.awt.Color(240, 240, 240));
                table.addCell(keyCell);

                PdfPCell valueCell = new PdfPCell(
                    new Paragraph(entry.getValue(), valueFont)
                );
                valueCell.setPadding(10);
                table.addCell(valueCell);
            }

            document.add(table);

            document.add(new Paragraph("\n"));
            Paragraph footer = new Paragraph(
                "© ZonaPiloto - Documento generado automáticamente",
                new com.lowagie.text.Font(
                    com.lowagie.text.Font.HELVETICA,
                    10,
                    com.lowagie.text.Font.ITALIC
                )
            );
            footer.setAlignment(Paragraph.ALIGN_CENTER);
            document.add(footer);

            document.close();
            return output.toByteArray();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private String loadTemplate(String name) throws Exception {
        ClassPathResource resource = new ClassPathResource(
            "templates/email/" + name + ".html"
        );
        try (InputStream inputStream = resource.getInputStream()) {
            return new String(
                inputStream.readAllBytes(),
                StandardCharsets.UTF_8
            );
        }
    }
}
