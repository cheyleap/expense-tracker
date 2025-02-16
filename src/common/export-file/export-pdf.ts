import { ColumnDefinitionDto } from '../dto/column-definition.dto';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import { HEADER_KEY } from '../constants/excel-header-key.constant';
import { getNestedProperty } from './export-file';

export const createPdf = async (
  dataTableName: string,
  columnDefinitions: ColumnDefinitionDto[],
  data: any[],
): Promise<Buffer> => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);
  const { height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 12;
  const margin = 50;
  let yPosition = height - margin;

  page.drawText(dataTableName, { x: margin, y: yPosition, font, size: 16 });
  yPosition -= 25;

  columnDefinitions.forEach(({ header }, index) => {
    page.drawText(header, {
      x: margin + index * 100,
      y: yPosition,
      font,
      size: fontSize,
    });
  });
  yPosition -= 20;

  data.forEach((row) => {
    columnDefinitions.forEach(({ key }, index) => {
      const value =
        key === HEADER_KEY
          ? String(index + 1)
          : (getNestedProperty(row, key) ?? '-');
      page.drawText(value, {
        x: margin + index * 100,
        y: yPosition,
        font,
        size: fontSize,
      });
    });
    yPosition -= 20;
  });

  return Buffer.from(await pdfDoc.save());
};
