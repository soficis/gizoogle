import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import path from "node:path";

const scriptPath = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(scriptPath), "..");

function collectFiles(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name === ".git" || entry.name === "node_modules") {
      continue;
    }

    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...collectFiles(fullPath));
      continue;
    }

    files.push(fullPath);
  }

  return files;
}

function normalizePath(filePath) {
  return filePath.split(path.sep).join("/");
}

function relative(filePath) {
  return normalizePath(path.relative(repoRoot, filePath));
}

function fail(message) {
  console.error(`CHECK FAILED: ${message}`);
  process.exit(1);
}

const allFiles = collectFiles(repoRoot);
const jsFiles = allFiles.filter((filePath) => filePath.endsWith(".js"));

for (const filePath of jsFiles) {
  execFileSync(process.execPath, ["--check", filePath], { stdio: "inherit" });
}

const disallowedPatterns = [
  { pattern: /catch\s*\{\s*\}/g, message: "empty catch blocks are disallowed" },
  { pattern: /\bTODO\b/g, message: "TODO comments are disallowed" }
];

for (const filePath of jsFiles) {
  const source = fs.readFileSync(filePath, "utf8");
  const relPath = relative(filePath);

  for (const rule of disallowedPatterns) {
    if (rule.pattern.test(source)) {
      fail(`${relPath}: ${rule.message}`);
    }
  }

  if (/[ \t]+$/m.test(source)) {
    fail(`${relPath}: trailing whitespace found`);
  }
}

const legacyFiles = [
  "content-script.js",
  "popup.js",
  "translator.js",
  "scripts/smoke-test-wikipedia.js"
];

for (const legacyFile of legacyFiles) {
  const absolutePath = path.join(repoRoot, legacyFile);

  if (fs.existsSync(absolutePath)) {
    fail(`legacy file remains: ${legacyFile}`);
  }
}

console.log("CHECK PASSED");
