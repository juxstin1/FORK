const { spawn } = require("child_process");

const EXPO_PORT = 8081;

const colors = {
  green: (t) => `\x1b[32m${t}\x1b[0m`,
  blue: (t) => `\x1b[34m${t}\x1b[0m`,
  yellow: (t) => `\x1b[33m${t}\x1b[0m`,
  cyan: (t) => `\x1b[36m${t}\x1b[0m`,
};

console.log(colors.cyan("\nRORK Dev Server Starting...\n"));

const expo = spawn("npx", ["expo", "start", "--web", "--port", EXPO_PORT.toString()], {
  stdio: ["ignore", "pipe", "pipe"],
  shell: true,
  detached: false,
});

expo.stdout.on("data", (data) => {
  const output = data.toString();
  process.stdout.write(output);

  if (output.includes("Web is waiting") || output.includes("Waiting on")) {
    console.log(colors.green(`Expo web server ready: http://localhost:${EXPO_PORT}`));
    console.log(colors.green("Hot reload active - changes appear instantly\n"));
  }
});

expo.stderr.on("data", (data) => {
  const output = data.toString();
  if (output.trim()) process.stderr.write(output);
});

process.on("SIGINT", () => {
  console.log(colors.yellow("\n\nShutting down..."));
  expo.kill();
  process.exit(0);
});

process.on("SIGTERM", () => {
  expo.kill();
  process.exit(0);
});

console.log(colors.blue("Starting Expo server..."));
