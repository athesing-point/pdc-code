import { minify as htmlMinify } from "html-minifier-terser";
import { transform } from "esbuild";
import { getFileExtension, removeConsoleLogs } from "./utils.js";

/**
 * Minification functions for different file types
 */

/**
 * Minify HTML content
 * @param {string} content - HTML content
 * @param {boolean} isProduction - Whether this is a production build
 * @returns {Promise<string>} Minified HTML
 */
export async function minifyHTML(content, isProduction = false) {
  if (!isProduction) {
    return content; // Return as-is for staging
  }

  try {
    return await htmlMinify(content, {
      collapseWhitespace: true,
      removeComments: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      useShortDoctype: true,
      minifyCSS: true,
      minifyJS: true,
      removeEmptyAttributes: true,
      removeOptionalTags: false,
      caseSensitive: true,
    });
  } catch (error) {
    console.warn(`Warning: Failed to minify HTML: ${error.message}`);
    return content;
  }
}

/**
 * Minify CSS content
 * @param {string} content - CSS content
 * @param {boolean} isProduction - Whether this is a production build
 * @returns {Promise<string>} Minified CSS
 */
export async function minifyCSS(content, isProduction = false) {
  if (!isProduction) {
    return content; // Return as-is for staging
  }

  try {
    const result = await transform(content, {
      loader: "css",
      minify: true,
    });
    return result.code;
  } catch (error) {
    console.warn(`Warning: Failed to minify CSS: ${error.message}`);
    return content;
  }
}

/**
 * Minify JavaScript content
 * @param {string} content - JavaScript content
 * @param {boolean} isProduction - Whether this is a production build
 * @returns {Promise<string>} Minified JavaScript
 */
export async function minifyJS(content, isProduction = false) {
  if (!isProduction) {
    return content; // Return as-is for staging
  }

  try {
    // First remove console logs
    let processedContent = removeConsoleLogs(content);

    // Then minify
    const result = await transform(processedContent, {
      loader: "js",
      minify: true,
      target: "es2020",
      format: "iife",
      drop: ["console", "debugger"],
    });

    return result.code;
  } catch (error) {
    console.warn(`Warning: Failed to minify JavaScript: ${error.message}`);
    return content;
  }
}

/**
 * Process file content based on file type
 * @param {string} content - File content
 * @param {string} filePath - File path
 * @param {boolean} isProduction - Whether this is a production build
 * @returns {Promise<string>} Processed content
 */
export async function processFile(content, filePath, isProduction = false) {
  const ext = getFileExtension(filePath);

  switch (ext) {
    case "html":
      return await minifyHTML(content, isProduction);
    case "css":
      return await minifyCSS(content, isProduction);
    case "js":
      return await minifyJS(content, isProduction);
    default:
      return content; // Return as-is for unsupported file types
  }
}

/**
 * Get minification stats
 * @param {string} original - Original content
 * @param {string} minified - Minified content
 * @returns {object} Stats object
 */
export function getMinificationStats(original, minified) {
  const originalSize = Buffer.byteLength(original, "utf8");
  const minifiedSize = Buffer.byteLength(minified, "utf8");
  const savings = originalSize - minifiedSize;
  const percentage = originalSize > 0 ? ((savings / originalSize) * 100).toFixed(1) : 0;

  return {
    originalSize,
    minifiedSize,
    savings,
    percentage,
  };
}
