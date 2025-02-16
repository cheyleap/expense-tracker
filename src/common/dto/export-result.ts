export type ExportResult = {
  file: Buffer;
  filename: string;
  headers: Record<string, string>;
};
