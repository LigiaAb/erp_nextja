import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

export type ButtonLogEntry = {
  buttonId: string;
  label?: string;
  module: string;
  route?: string;
  cod_usuario?: string;
  extra?: Record<string, unknown>;
};

export type GenericLogEntry = {
  module: string;
  route?: string;
  cod_usuario?: string;
  extra?: Record<string, unknown>;
  [key: string]: unknown;
};

const DEFAULT_LOG_FILE = "logbotones.log";
const LOGS_DIR = path.join(process.cwd(), "logs");

const normalizeLogFileName = (fileName?: string) => {
  const candidate = (fileName ?? DEFAULT_LOG_FILE).trim();

  // Permite solo nombres simples y evita path traversal.
  const safeName = path.basename(candidate).replace(/[^a-zA-Z0-9._-]/g, "_");
  return safeName.length > 0 ? safeName : DEFAULT_LOG_FILE;
};

export const writeButtonLog = async (entry: ButtonLogEntry, fileName?: string) => {
  return writeGenericLog(entry, fileName);
};

export const writeGenericLog = async (entry: GenericLogEntry, fileName?: string) => {
  const safeFileName = normalizeLogFileName(fileName);
  const targetPath = path.join(LOGS_DIR, safeFileName);

  await mkdir(LOGS_DIR, { recursive: true });

  const line = `${JSON.stringify({
    timestamp: new Date().toISOString(),
    ...entry,
  })}\n`;

  await appendFile(targetPath, line, "utf8");
};
