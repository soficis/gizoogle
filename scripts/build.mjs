import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import path from "node:path";

const scriptPath = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(scriptPath), "..");
const manifestPath = path.join(repoRoot, "manifest.json");
const popupPath = path.join(repoRoot, "popup.html");

function fail(message) {
  console.error(`BUILD FAILED: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(manifestPath)) {
  fail("manifest.json not found");
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const contentScriptFiles = manifest.content_scripts
  .flatMap((entry) => entry.js || [])
  .map((relativePath) => path.join(repoRoot, relativePath));

if (!fs.existsSync(popupPath)) {
  fail("popup.html not found");
}

const popupHtml = fs.readFileSync(popupPath, "utf8");
const popupScriptMatches = [...popupHtml.matchAll(/<script\s+src="([^"]+)"\s*><\/script>/g)];
const popupScriptFiles = popupScriptMatches.map((match) => path.join(repoRoot, match[1]));

const runtimeFiles = [...new Set([...contentScriptFiles, ...popupScriptFiles])];

for (const runtimeFile of runtimeFiles) {
  if (!fs.existsSync(runtimeFile)) {
    fail(`missing runtime script: ${path.relative(repoRoot, runtimeFile)}`);
  }

  execFileSync(process.execPath, ["--check", runtimeFile], { stdio: "inherit" });
}

const extensionSummary = {
  contentScriptFileCount: contentScriptFiles.length,
  popupScriptFileCount: popupScriptFiles.length,
  runtimeFileCount: runtimeFiles.length
};

console.log("BUILD PASSED", extensionSummary);
