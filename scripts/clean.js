#!/usr/bin/env bun
import { rmSync, existsSync } from "fs";
import { resolve } from "path";
import { log } from "./utils.js";

/**
 * Clean script to remove build artifacts
 */

const distDir = resolve("dist");

function clean() {
  log("Cleaning build artifacts...");

  if (existsSync(distDir)) {
    try {
      rmSync(distDir, { recursive: true, force: true });
      log(`Removed ${distDir}`);
    } catch (error) {
      log(`Error removing ${distDir}: ${error.message}`, "error");
      process.exit(1);
    }
  } else {
    log("No build artifacts to clean");
  }

  log("Clean completed");
}

clean();
