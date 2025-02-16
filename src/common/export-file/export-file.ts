import * as ExcelJS from 'exceljs';
import { ExportFileDto } from '../dto/export.dto';
import { ColumnDefinitionDto } from '../dto/column-definition.dto';
import { ExportDataTypeEnum } from '../enums/export-data-type.enum';
import { HEADER_KEY } from '../constants/excel-header-key.constant';
import { createPdf } from './export-pdf';
import { exportFilesByType } from './export-excel';
import { ExportResult } from '../dto/export-result';
import { dayJs } from '../utils/date.util';
import { DEFAULT_DATE_TIME_FORMAT } from '../constants/date.constant';

export const exportDataFiles = async (
  exportType: string,
  dataTableName: string,
  exportFileDto: ExportFileDto,
  data: any[],
): Promise<ExportResult> => {
  const columnDefinitions: ColumnDefinitionDto[] = [
    { header: 'No', key: 'no' },
    ...exportFileDto.headers,
  ];

  if (exportType === ExportDataTypeEnum.PDF) {
    return {
      file: await createPdf(dataTableName, columnDefinitions, data),
      filename: generateExportFileName(dataTableName, '.pdf'),
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename='.concat(
          generateExportFileName(dataTableName, '.pdf'),
        ),
      },
    };
  }

  const workbook: ExcelJS.Workbook = new ExcelJS.Workbook();
  const worksheet: ExcelJS.Worksheet = workbook.addWorksheet(
    dataTableName.toLowerCase(),
  );
  const headers: string[] = columnDefinitions.map(({ header }) => header);
  const headerRow: ExcelJS.Row = worksheet.addRow(headers);
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, size: 12 };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
  });
  headerRow.height = 25;

  worksheet.addRows(getRows(data, columnDefinitions)).forEach((row) => {
    row.eachCell((cell) => {
      cell.font = { name: 'Kantumruy Pro' };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });
  });

  worksheet.columns.forEach((column) => {
    let maxLength = 4;
    column.eachCell?.((cell) => {
      maxLength = Math.max(maxLength, String(cell.value || '').trim().length);
    });
    column.width = maxLength + 2;
  });

  worksheet.eachRow((row) => (row.height = 20));
  return exportFilesByType(exportType, dataTableName, workbook);
};

const getRows = (
  data: any[],
  columnDefinitions: ColumnDefinitionDto[],
): any[][] =>
  data.map((item) =>
    columnDefinitions.map((col, index) =>
      col.key === HEADER_KEY ? index + 1 : getNestedProperty(item, col.key),
    ),
  );

export const getNestedProperty = (data: any, path: string): string =>
  splitProperty(path)
    .map((key) => getValueFromProp(key, data))
    .join('');

const getValueFromProp = (key: string, data: any): string => {
  if (/\[\d+]/.test(key)) {
    const [arrayKey, index] = key.split(/\[|]/);
    return String(data?.[arrayKey]?.[Number(index)] ?? '-');
  }
  return key.match(/[`']/)
    ? key.replace(/['|`]/g, '')
    : String(data?.[key] ?? '-');
};

const splitProperty = (path: string): string[] => path.split(/[.,]/);
export const generateExportFileName = (
  dataTableName: string,
  extension: string,
): string => {
  const currentDateTime: string = dayJs().format(DEFAULT_DATE_TIME_FORMAT);
  return dataTableName.toLowerCase().concat('-', currentDateTime, extension);
};
