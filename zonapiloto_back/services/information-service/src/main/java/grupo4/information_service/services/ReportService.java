package grupo4.information_service.services;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import grupo4.information_service.entities.Advertisement;
import java.awt.Color;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import javax.imageio.ImageIO;
import lombok.RequiredArgsConstructor;
import org.jfree.chart.ChartFactory;
import org.jfree.chart.JFreeChart;
import org.jfree.data.category.DefaultCategoryDataset;
import org.jfree.data.general.DefaultPieDataset;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final AdvertisementService advertisementService;
    private final QuestionService questionService;
    private final CategoryService categoryService;
    private final EventService eventService;

    public byte[] generateGeneralReport() throws Exception {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4);

        PdfWriter.getInstance(document, out);
        document.open();

        addCoverPage(document);

        addAdvertisementStats(document);
        document.newPage();

        addEventStats(document);

        document.close();
        return out.toByteArray();
    }

    private void addCoverPage(Document document) throws Exception {
        Font titleFont = new Font(Font.HELVETICA, 28, Font.BOLD, Color.RED);
        Font subFont = new Font(Font.HELVETICA, 16, Font.NORMAL, Color.BLACK);

        Paragraph title = new Paragraph(
            "ZonaPiloto – Reporte General",
            titleFont
        );
        title.setAlignment(Element.ALIGN_CENTER);
        title.setSpacingAfter(30);

        Paragraph sub = new Paragraph(
            "Reporte automático generado por el sistema",
            subFont
        );
        sub.setAlignment(Element.ALIGN_CENTER);

        document.add(title);
        document.add(sub);
    }

    private void addAdvertisementStats(Document document) throws Exception {
        document.add(
            new Paragraph(
                "📌 Publicaciones activas/inactivas",
                new Font(Font.HELVETICA, 18, Font.BOLD)
            )
        );

        var ads = advertisementService.getAllAdminAdvertisements();

        long active = ads.stream().filter(Advertisement::isState).count();
        long inactive = ads
            .stream()
            .filter(ad -> !ad.isState())
            .count();

        DefaultPieDataset dataset = new DefaultPieDataset();
        dataset.setValue("Activas", active);
        dataset.setValue("Inactivas", inactive);

        JFreeChart chart = ChartFactory.createPieChart(
            "Publicaciones",
            dataset,
            true,
            true,
            false
        );

        addChartToDocument(document, chart);
    }

    private void addEventStats(Document document) throws Exception {
        document.add(
            new Paragraph(
                "📌 Eventos por tipo",
                new Font(Font.HELVETICA, 18, Font.BOLD)
            )
        );

        DefaultCategoryDataset dataset = new DefaultCategoryDataset();

        eventService
            .getAllEvents()
            .forEach(ev -> {
                dataset.addValue(1, "Eventos", ev.getType());
            });

        JFreeChart chart = ChartFactory.createBarChart(
            "Eventos registrados",
            "Tipo",
            "Cantidad",
            dataset
        );

        addChartToDocument(document, chart);
    }

    private void addChartToDocument(Document document, JFreeChart chart)
        throws Exception {
        BufferedImage chartImage = chart.createBufferedImage(500, 350);

        ByteArrayOutputStream imgBytes = new ByteArrayOutputStream();
        ImageIO.write(chartImage, "png", imgBytes);

        Image pdfImage = Image.getInstance(imgBytes.toByteArray());
        pdfImage.setAlignment(Image.ALIGN_CENTER);
        pdfImage.scaleToFit(450, 300);

        document.add(pdfImage);
    }
}
