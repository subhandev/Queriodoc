#!/usr/bin/env node
/**
 * Checks required environment variables for local/dev setup.
 * Run: node scripts/verify-setup.mjs
 * Loads .env.local if present (simple KEY=value parser).
 */

import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const envPath = resolve(root, ".env.local");

function loadEnvLocal() {
  if (!existsSync(envPath)) {
    return;
  }
  const raw = readFileSync(envPath, "utf8");
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }
    const eq = trimmed.indexOf("=");
    if (eq === -1) {
      continue;
    }
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadEnvLocal();

const required = [
  "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
  "CLERK_SECRET_KEY",
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "OPENAI_API_KEY",
];

const optional = ["NEXT_PUBLIC_SUPABASE_ANON_KEY"];

let failed = false;

console.log("Queriodoc environment check\n");

for (const key of required) {
  const value = process.env[key]?.trim();
  if (!value) {
    console.log(`  ✗ ${key} — missing`);
    failed = true;
  } else {
    console.log(`  ✓ ${key}`);
  }
}

for (const key of optional) {
  const value = process.env[key]?.trim();
  console.log(value ? `  ✓ ${key} (optional)` : `  ○ ${key} (optional, not set)`);
}

console.log("\nDatabase:");
console.log("  Apply migrations in supabase/migrations/ (001–013) via Supabase SQL or CLI.");
console.log("  Migration 007 creates the private documents storage bucket.");

if (failed) {
  console.log("\nCopy .env.example to .env.local and fill in missing values.\n");
  process.exit(1);
}

console.log("\nAll required variables are set. Run npm run dev and smoke-test upload + chat.\n");
