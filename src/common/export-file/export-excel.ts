import * as ExcelJS from 'exceljs';
import { ExportDataTypeEnum } from '../enums/export-data-type.enum';
import { ResourceBadRequestException } from '../../exception-base/exception/bad-request.exception';
import { ExportResult } from '../dto/export-result';
import { generateExportFileName } from './export-file';

export const exportFilesByType = async (
  exportType: string,
  dataTableName: string,
  workbook: ExcelJS.Workbook,
): Promise<ExportResult> => {
  switch (exportType) {
    case ExportDataTypeEnum.EXCEL:
      return {
        file: Buffer.from(await workbook.xlsx.writeBuffer()),
        filename: generateExportFileName(dataTableName, '.xlsx'),
        headers: {
          'Content-Type':
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': 'attachment;',
        },
      };
    case ExportDataTypeEnum.CSV:
      return {
        file: Buffer.from(await workbook.csv.writeBuffer()),
        filename: generateExportFileName(dataTableName, '.csv'),
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': 'attachment;',
        },
      };
    default:
      throw new ResourceBadRequestException(
        exportType,
        'Not supported export type.',
      );
  }
};
