const { spawn, exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const PREVIEW_PORT = 3000;
const EXPO_PORT = 8081;

// Colors for console output
const colors = {
  green: (t) => `\x1b[32m${t}\x1b[0m`,
  blue: (t) => `\x1b[34m${t}\x1b[0m`,
  yellow: (t) => `\x1b[33m${t}\x1b[0m`,
  cyan: (t) => `\x1b[36m${t}\x1b[0m`,
};

console.log(colors.cyan("\n🚀 RORK Dev Server Starting...\n"));

// Start Expo web server in background
const expo = spawn("npx", ["expo", "start", "--web", "--port", EXPO_PORT.toString()], {
  stdio: ["ignore", "pipe", "pipe"],
  shell: true,
  detached: false,
});

expo.stdout.on("data", (data) => {
  const output = data.toString();
  if (output.includes("Web is waiting")) {
    console.log(colors.green("✓ Expo web server ready"));
    openPreview();
  }
});

expo.stderr.on("data", (data) => {
  // Filter out noise
  const output = data.toString();
  if (!output.includes("WARN") && output.trim()) {
    console.log(output);
  }
});

function openPreview() {
  const previewPath = path.join(__dirname, "..", "web", "preview.html");
  const previewUrl = `file:///${previewPath.replace(/\\/g, "/")}`;

  console.log(colors.blue(`\n📱 Opening iPhone preview...`));
  console.log(colors.yellow(`   Preview: ${previewUrl}`));
  console.log(colors.yellow(`   App: http://localhost:${EXPO_PORT}`));
  console.log(colors.green(`\n✓ Hot reload active - changes appear instantly\n`));

  // Open in default browser (Windows)
  exec(`start "" "${previewUrl}"`, (err) => {
    if (err) {
      console.log(colors.yellow(`Open manually: ${previewUrl}`));
    }
  });
}

// Handle cleanup
process.on("SIGINT", () => {
  console.log(colors.yellow("\n\nShutting down..."));
  expo.kill();
  process.exit(0);
});

process.on("SIGTERM", () => {
  expo.kill();
  process.exit(0);
});

// Keep alive
console.log(colors.blue("Starting Expo server..."));
