import * as path from "path";

export function resolveWithinRoot(root: string, targetPath: string): string | null {
  if (targetPath.includes("\0")) return null;
  if (process.platform === "win32") {
    const trimmed = targetPath.trim();
    if (/^[a-zA-Z]:/.test(trimmed)) return null;
    if (trimmed.startsWith("\\\\") || trimmed.startsWith("//")) return null;
  }

  const resolvedRoot = path.resolve(root);
  const resolvedTarget = path.resolve(resolvedRoot, targetPath);
  const relative = path.relative(resolvedRoot, resolvedTarget);

  if (relative === "") return resolvedTarget;
  if (relative.startsWith("..") || path.isAbsolute(relative)) return null;

  return resolvedTarget;
}

export function isWithinRoot(root: string, targetPath: string): boolean {
  return resolveWithinRoot(root, targetPath) !== null;
}
