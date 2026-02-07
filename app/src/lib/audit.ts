import * as fs from "fs";
import * as path from "path";

type AuditLevel = "info" | "warn" | "error";

function toJsonLine(value: unknown): string {
  return JSON.stringify(value, (_key, v) => {
    if (typeof v === "string") return v.replace(/\r?\n/g, "\\n");
    return v;
  });
}

export function appendAuditLog(
  projectDir: string,
  event: string,
  details: Record<string, unknown> = {},
  level: AuditLevel = "info"
) {
  try {
    const root = path.resolve(projectDir);
    const rorkDir = path.join(root, ".rork");
    if (!fs.existsSync(rorkDir)) fs.mkdirSync(rorkDir, { recursive: true });

    const record = {
      schemaVersion: 1,
      ts: new Date().toISOString(),
      level,
      event,
      ...details,
    };

    const line = `${toJsonLine(record)}\n`;
    fs.appendFileSync(path.join(rorkDir, "audit.log"), line, "utf-8");
  } catch {
    // Never fail tool execution because audit logging failed.
  }
}
