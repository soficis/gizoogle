#!/usr/bin/env node
/* eslint-disable no-console */

const https = require("https");
const path = require("path");

const { translateText } = require(path.join(__dirname, "..", "translator.js"));

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https
      .get(
        url,
        {
          headers: {
            "User-Agent": "gizoogle-local-smoke-test",
            "Accept-Encoding": "identity"
          }
        },
        (res) => {
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            res.resume();
            resolve(fetchText(res.headers.location));
            return;
          }

          if (res.statusCode !== 200) {
            res.resume();
            reject(new Error(`Request failed: ${res.statusCode}`));
            return;
          }

          res.setEncoding("utf8");
          let data = "";
          res.on("data", (chunk) => (data += chunk));
          res.on("end", () => resolve(data));
        }
      )
      .on("error", reject);
  });
}

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function main() {
  const url = "https://en.wikipedia.org/wiki/North_Korea";
  const html = await fetchText(url);
  const text = stripHtml(html);

  const translated = translateText(text);
  const hasUptown = translated.includes("Uptown Korea");
  const hasDowntown = translated.includes("downtown korea");

  console.log(`Fetched: ${url}`);
  console.log(`Bytes: ${Buffer.byteLength(html, "utf8")}`);
  console.log(`Uptown Korea present: ${hasUptown}`);
  console.log(`downtown korea present: ${hasDowntown}`);

  if (!hasUptown) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

