import { glob } from "glob";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { dirname, join, relative, extname } from "path";

/**
 * Utility functions for the build system
 */

/**
 * Get all source files matching the specified patterns
 * @param {string} srcDir - Source directory
 * @param {string[]} patterns - File patterns to match
 * @param {string[]} exclude - Patterns to exclude
 * @returns {Promise<string[]>} Array of file paths
 */
export async function getSourceFiles(srcDir = "src", patterns = ["**/*.{html,css,js}"], exclude = []) {
  const files = [];

  for (const pattern of patterns) {
    const matches = await glob(join(srcDir, pattern), {
      ignore: exclude.map((ex) => join(srcDir, ex)),
    });
    files.push(...matches);
  }

  return [...new Set(files)]; // Remove duplicates
}

/**
 * Ensure directory exists
 * @param {string} filePath - File path
 */
export function ensureDir(filePath) {
  const dir = dirname(filePath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

/**
 * Copy file with optional transformation
 * @param {string} srcPath - Source file path
 * @param {string} destPath - Destination file path
 * @param {Function} transform - Optional transformation function
 */
export function copyFile(srcPath, destPath, transform = null) {
  ensureDir(destPath);

  let content = readFileSync(srcPath, "utf8");

  if (transform) {
    content = transform(content, srcPath);
  }

  writeFileSync(destPath, content, "utf8");
}

/**
 * Get output path for a source file
 * @param {string} srcPath - Source file path
 * @param {string} srcDir - Source directory
 * @param {string} outDir - Output directory
 * @returns {string} Output file path
 */
export function getOutputPath(srcPath, srcDir, outDir) {
  const relativePath = relative(srcDir, srcPath);
  return join(outDir, relativePath);
}

/**
 * Log with timestamp
 * @param {string} message - Message to log
 * @param {string} level - Log level (info, warn, error)
 */
export function log(message, level = "info") {
  const timestamp = new Date().toLocaleTimeString();
  const prefix = level === "error" ? "❌" : level === "warn" ? "⚠️" : "✅";
  console.log(`[${timestamp}] ${prefix} ${message}`);
}

/**
 * Remove console.log statements from JavaScript code
 * @param {string} code - JavaScript code
 * @returns {string} Code with console.log statements removed
 */
export function removeConsoleLogs(code) {
  // Remove console.log, console.warn, console.error, console.info, console.debug
  return code.replace(/console\.(log|warn|error|info|debug|trace)\s*\([^)]*\)\s*;?/g, "");
}

/**
 * Get file extension
 * @param {string} filePath - File path
 * @returns {string} File extension without dot
 */
export function getFileExtension(filePath) {
  return extname(filePath).slice(1).toLowerCase();
}

/**
 * Check if file should be processed
 * @param {string} filePath - File path
 * @param {string[]} supportedExtensions - Supported file extensions
 * @returns {boolean} Whether file should be processed
 */
export function shouldProcessFile(filePath, supportedExtensions = ["html", "css", "js"]) {
  const ext = getFileExtension(filePath);
  return supportedExtensions.includes(ext);
}
