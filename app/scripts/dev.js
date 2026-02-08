const { spawn } = require("child_process");
const path = require("path");

const EXPO_PORT = 8081;
const PREVIEW_PORT = 3333;

const colors = {
  green: (t) => `\x1b[32m${t}\x1b[0m`,
  blue: (t) => `\x1b[34m${t}\x1b[0m`,
  yellow: (t) => `\x1b[33m${t}\x1b[0m`,
  cyan: (t) => `\x1b[36m${t}\x1b[0m`,
  dim: (t) => `\x1b[2m${t}\x1b[0m`,
};

console.log(colors.cyan("\nFORK Dev Server Starting...\n"));

const children = [];

// Spawn Expo
const expo = spawn("npx", ["expo", "start", "--web", "--port", EXPO_PORT.toString()], {
  stdio: ["ignore", "pipe", "pipe"],
  shell: true,
  detached: false,
});
children.push(expo);

expo.stdout.on("data", (data) => {
  const output = data.toString();
  process.stdout.write(output);

  if (output.includes("Web is waiting") || output.includes("Waiting on")) {
    console.log(colors.green(`\nExpo ready: http://localhost:${EXPO_PORT}`));

    // Launch preview server after Expo is ready
    const preview = spawn("node", [path.join(__dirname, "preview-server.js")], {
      stdio: ["ignore", "pipe", "pipe"],
      shell: true,
      detached: false,
    });
    children.push(preview);

    preview.stdout.on("data", (d) => {
      const msg = d.toString().trim();
      if (msg) console.log(colors.dim(`[preview] ${msg}`));
    });

    preview.stderr.on("data", (d) => {
      const msg = d.toString().trim();
      if (msg) console.error(colors.dim(`[preview] ${msg}`));
    });

    preview.on("exit", (code) => {
      if (code !== 0 && code !== null) {
        console.error(colors.yellow(`Preview server exited with code ${code}`));
      }
    });

    console.log(colors.green(`Preview: http://localhost:${PREVIEW_PORT}`));
    console.log(colors.green("Hot reload active — changes appear instantly\n"));
    console.log(colors.dim(`  Expo:    http://localhost:${EXPO_PORT}`));
    console.log(colors.dim(`  Preview: http://localhost:${PREVIEW_PORT}\n`));
  }
});

expo.stderr.on("data", (data) => {
  const output = data.toString();
  if (output.trim()) process.stderr.write(output);
});

function shutdown() {
  console.log(colors.yellow("\n\nShutting down..."));
  for (const child of children) {
    try { child.kill(); } catch {}
  }
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

console.log(colors.blue("Starting Expo server..."));
