import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const workingDir: string = process.argv[2] || process.cwd();

const packageJsonPath: string = path.join(workingDir, "package.json");

// Read package.json
const packageJson: Record<string, unknown> = JSON.parse(
  readFileSync(packageJsonPath, "utf8")
);

// Remove "type" key
delete packageJson["type"];

// Write back package.json without "type"
writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n");

console.log("✅ Removed 'type' from package.json before publishing.");