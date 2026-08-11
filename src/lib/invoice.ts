import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { formatPrice } from "@/lib/pricing";

type InvoiceData = {
  invoiceNumber: string;
  purchaseDate: Date;
  customerName: string;
  customerEmail: string;
  productName: string;
  pricePaid: number;
};

export async function generateInvoicePdf(data: InvoiceData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const darkBlue = rgb(0.043, 0.055, 0.102);
  const violet = rgb(0.416, 0.388, 0.722);
  const gray = rgb(0.35, 0.38, 0.45);

  let y = 780;

  page.drawText("Juriskills", { x: 50, y, size: 26, font: fontBold, color: violet });
  y -= 18;
  page.drawText("Marketplace IA pour juristes", { x: 50, y, size: 10, font, color: gray });

  y -= 50;
  page.drawText("FACTURE", { x: 50, y, size: 18, font: fontBold, color: darkBlue });
  y -= 24;
  page.drawText(`Numéro de facture : ${data.invoiceNumber}`, { x: 50, y, size: 11, font, color: darkBlue });
  y -= 16;
  page.drawText(`Date : ${data.purchaseDate.toLocaleDateString("fr-FR")}`, {
    x: 50,
    y,
    size: 11,
    font,
    color: darkBlue,
  });

  y -= 40;
  page.drawText("Facturé à :", { x: 50, y, size: 11, font: fontBold, color: darkBlue });
  y -= 16;
  page.drawText(data.customerName, { x: 50, y, size: 11, font, color: darkBlue });
  y -= 16;
  page.drawText(data.customerEmail, { x: 50, y, size: 11, font, color: darkBlue });

  y -= 50;
  page.drawLine({ start: { x: 50, y }, end: { x: 545, y }, thickness: 1, color: gray });
  y -= 24;
  page.drawText("Produit", { x: 50, y, size: 11, font: fontBold, color: darkBlue });
  page.drawText("Montant", { x: 470, y, size: 11, font: fontBold, color: darkBlue });
  y -= 20;
  page.drawText(data.productName, { x: 50, y, size: 11, font, color: darkBlue });
  page.drawText(formatPrice(data.pricePaid), { x: 470, y, size: 11, font, color: darkBlue });

  y -= 20;
  page.drawLine({ start: { x: 50, y }, end: { x: 545, y }, thickness: 1, color: gray });
  y -= 30;
  page.drawText("Total TTC", { x: 400, y, size: 13, font: fontBold, color: darkBlue });
  page.drawText(formatPrice(data.pricePaid), { x: 470, y, size: 13, font: fontBold, color: violet });

  page.drawText("Merci pour votre confiance.", { x: 50, y: 60, size: 9, font, color: gray });
  page.drawText("Juriskills — cette facture ne nécessite pas de signature.", {
    x: 50,
    y: 46,
    size: 9,
    font,
    color: gray,
  });

  return pdfDoc.save();
}
