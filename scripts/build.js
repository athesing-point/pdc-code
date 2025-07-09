#!/usr/bin/env bun
import { watch } from "chokidar";
import { readFileSync, rmSync, existsSync } from "fs";
import { join, resolve } from "path";
import { getSourceFiles, getOutputPath, log, copyFile } from "./utils.js";
import { processFile, getMinificationStats } from "./minify.js";

/**
 * Main build script for pdc-code
 */

// Parse command line arguments
const args = process.argv.slice(2);
const environment = args.find((arg) => arg.startsWith("--env="))?.split("=")[1] || "staging";
const isProduction = environment === "production";
const isWatch = args.includes("--watch");
const srcDir = args.find((arg) => arg.startsWith("--src="))?.split("=")[1] || "src";

// Configuration
const config = {
  srcDir: resolve(srcDir),
  outDir: resolve(`dist/${environment === "production" ? "prod" : environment}`),
  patterns: ["**/*.{html,css,js}"],
  exclude: ["**/node_modules/**", "**/.git/**", "**/dist/**"],
  isProduction,
  environment,
};

/**
 * Build a single file
 * @param {string} srcPath - Source file path
 * @returns {Promise<void>}
 */
async function buildFile(srcPath) {
  try {
    const outputPath = getOutputPath(srcPath, config.srcDir, config.outDir);
    const originalContent = readFileSync(srcPath, "utf8");

    // Process the file content
    const processedContent = await processFile(originalContent, srcPath, config.isProduction);

    // Write the processed file
    copyFile(srcPath, outputPath, () => processedContent);

    // Log stats
    if (config.isProduction) {
      const stats = getMinificationStats(originalContent, processedContent);
      log(`Built ${srcPath} → ${outputPath} (${stats.percentage}% smaller)`);
    } else {
      log(`Built ${srcPath} → ${outputPath}`);
    }
  } catch (error) {
    log(`Error building ${srcPath}: ${error.message}`, "error");
  }
}

/**
 * Build all files
 * @returns {Promise<void>}
 */
async function buildAll() {
  const startTime = Date.now();

  log(`Starting ${config.environment} build...`);

  // Clean output directory
  if (existsSync(config.outDir)) {
    rmSync(config.outDir, { recursive: true, force: true });
  }

  try {
    // Get all source files
    const files = await getSourceFiles(config.srcDir, config.patterns, config.exclude);

    if (files.length === 0) {
      log(`No source files found in ${config.srcDir}`, "warn");
      return;
    }

    log(`Found ${files.length} files to build`);

    // Build all files
    const buildPromises = files.map(buildFile);
    await Promise.all(buildPromises);

    const duration = Date.now() - startTime;
    log(`Build completed in ${duration}ms (${config.environment})`);

    // Show summary
    const totalFiles = files.length;
    log(`Successfully built ${totalFiles} files to ${config.outDir}`);
  } catch (error) {
    log(`Build failed: ${error.message}`, "error");
    process.exit(1);
  }
}

/**
 * Watch for file changes
 * @returns {void}
 */
function startWatch() {
  log(`Starting watch mode for ${config.environment}...`);

  const watcher = watch(join(config.srcDir, "**/*.{html,css,js}"), {
    ignored: config.exclude,
    persistent: true,
  });

  watcher
    .on("add", (path) => {
      log(`File added: ${path}`);
      buildFile(path);
    })
    .on("change", (path) => {
      log(`File changed: ${path}`);
      buildFile(path);
    })
    .on("unlink", (path) => {
      log(`File removed: ${path}`);
      // Could implement file deletion from dist here if needed
    })
    .on("error", (error) => {
      log(`Watcher error: ${error.message}`, "error");
    });

  log("Watching for changes... Press Ctrl+C to stop");
}

/**
 * Main function
 */
async function main() {
  // Validate source directory
  if (!existsSync(config.srcDir)) {
    log(`Source directory ${config.srcDir} does not exist`, "error");
    process.exit(1);
  }

  // Initial build
  await buildAll();

  // Start watch mode if requested
  if (isWatch) {
    startWatch();
  }
}

// Handle process termination
process.on("SIGINT", () => {
  log("Build process terminated");
  process.exit(0);
});

process.on("SIGTERM", () => {
  log("Build process terminated");
  process.exit(0);
});

// Run the build
main().catch((error) => {
  log(`Fatal error: ${error.message}`, "error");
  process.exit(1);
});
