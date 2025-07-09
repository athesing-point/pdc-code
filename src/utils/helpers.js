/**
 * Utility helper functions for Point.com
 */

// Development logging
console.log("Helpers module loaded");

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
  let timeout;
  console.debug(`Debounce function created with ${wait}ms delay`);

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function to limit function calls
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, limit) {
  let inThrottle;
  console.debug(`Throttle function created with ${limit}ms limit`);

  return function () {
    const args = arguments;
    const context = this;

    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Format currency for display
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: USD)
 * @returns {string} Formatted currency string
 */
function formatCurrency(amount, currency = "USD") {
  console.log(`Formatting currency: ${amount} ${currency}`);

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
}

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} Whether email is valid
 */
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailRegex.test(email);

  console.log(`Email validation for ${email}: ${isValid}`);
  return isValid;
}

/**
 * Get cookie value by name
 * @param {string} name - Cookie name
 * @returns {string|null} Cookie value or null
 */
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    const cookieValue = parts.pop().split(";").shift();
    console.log(`Cookie ${name} found: ${cookieValue}`);
    return cookieValue;
  }

  console.warn(`Cookie ${name} not found`);
  return null;
}

/**
 * Set cookie with expiration
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {number} days - Days until expiration
 */
function setCookie(name, value, days = 30) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  console.log(`Cookie ${name} set with value: ${value}, expires: ${expires}`);
}

/**
 * Generate random ID
 * @param {number} length - Length of ID (default: 8)
 * @returns {string} Random ID
 */
function generateId(length = 8) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  console.log(`Generated ID: ${result}`);
  return result;
}

// Export functions for module usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    debounce,
    throttle,
    formatCurrency,
    validateEmail,
    getCookie,
    setCookie,
    generateId,
  };
}

// Global namespace for browser usage
if (typeof window !== "undefined") {
  window.PointHelpers = {
    debounce,
    throttle,
    formatCurrency,
    validateEmail,
    getCookie,
    setCookie,
    generateId,
  };

  console.log("PointHelpers namespace created on window object");
}
