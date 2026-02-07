import * as fs from "fs";
import * as path from "path";
import { runBuildStage } from "../src/stages/build";
import { runReadStage } from "../src/stages/read";
import { runDockerStage } from "../src/stages/docker";

type CheckResult = {
  name: string;
  pass: boolean;
  detail?: string;
};

async function main() {
  const projectDir = process.cwd();
  const auditPath = path.join(projectDir, ".rork", "audit.log");

  if (fs.existsSync(auditPath)) fs.unlinkSync(auditPath);

  const checks: CheckResult[] = [];

  const buildRes = await runBuildStage({
    projectDir,
    files: [{ path: "..\\..\\..\\evil.txt", content: "blocked" }],
  });
  checks.push({
    name: "build escape blocked",
    pass: buildRes.errors.some((e) => e.includes("path escapes project root")),
    detail: JSON.stringify(buildRes),
  });

  const readRes = await runReadStage({
    projectDir,
    files: ["..\\..\\..\\Windows\\win.ini"],
  });
  checks.push({
    name: "read escape blocked",
    pass: readRes[0]?.error === "Access denied: Path is outside project directory",
    detail: JSON.stringify(readRes[0]),
  });

  const dockerMetaRes = await runDockerStage({
    command: "ps && whoami",
    projectDir,
  });
  checks.push({
    name: "docker metachar blocked",
    pass: (dockerMetaRes.error ?? "").includes("forbidden shell metacharacters"),
    detail: JSON.stringify(dockerMetaRes),
  });

  const dockerPrivRes = await runDockerStage({
    command: "run --privileged alpine echo hi",
    projectDir,
  });
  checks.push({
    name: "docker mutating command blocked in safe mode",
    pass:
      (dockerPrivRes.error ?? "").includes("blocked in SAFE mode") ||
      (dockerPrivRes.error ?? "").includes("--privileged"),
    detail: JSON.stringify(dockerPrivRes),
  });

  const auditExists = fs.existsSync(auditPath);
  checks.push({
    name: "audit log created",
    pass: auditExists,
  });

  let jsonlValid = false;
  let auditCount = 0;
  if (auditExists) {
    const lines = fs.readFileSync(auditPath, "utf-8").split("\n").filter(Boolean);
    auditCount = lines.length;
    try {
      lines.forEach((line) => JSON.parse(line));
      jsonlValid = true;
    } catch {
      jsonlValid = false;
    }
  }
  checks.push({
    name: "audit log is valid jsonl",
    pass: jsonlValid,
    detail: `lines=${auditCount}`,
  });

  const failed = checks.filter((c) => !c.pass);
  const summary = {
    passed: checks.length - failed.length,
    failed: failed.length,
    checks,
  };

  console.log(JSON.stringify(summary, null, 2));
  if (failed.length > 0) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
