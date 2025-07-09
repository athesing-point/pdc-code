/**
 * Header component JavaScript for Point.com
 * Handles navigation interactions and responsive behavior
 */

// Debug logging for development
console.log("Header component loaded");
console.warn("This is a warning message for testing");

class HeaderComponent {
  constructor() {
    this.header = document.querySelector(".main-header");
    this.navigation = document.querySelector(".navigation");
    this.init();

    console.log("HeaderComponent initialized");
  }

  init() {
    this.setupEventListeners();
    this.handleScrollBehavior();
    console.info("Header component setup complete");
  }

  setupEventListeners() {
    // Handle navigation clicks
    const navLinks = this.navigation.querySelectorAll("a");

    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        this.handleNavClick(e, link);
      });
    });

    // Handle window resize
    window.addEventListener("resize", () => {
      this.handleResize();
    });

    console.debug("Event listeners attached");
  }

  handleNavClick(event, link) {
    // Remove active class from all links
    const allLinks = this.navigation.querySelectorAll("a");
    allLinks.forEach((l) => l.classList.remove("active"));

    // Add active class to clicked link
    link.classList.add("active");

    console.log(`Navigation clicked: ${link.href}`);

    // Custom navigation logic can be added here
    if (link.getAttribute("href").startsWith("#")) {
      event.preventDefault();
      this.smoothScrollTo(link.getAttribute("href"));
    }
  }

  handleScrollBehavior() {
    let lastScrollY = window.scrollY;

    window.addEventListener("scroll", () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        this.header.classList.add("header-hidden");
      } else {
        // Scrolling up
        this.header.classList.remove("header-hidden");
      }

      lastScrollY = currentScrollY;
    });
  }

  handleResize() {
    const width = window.innerWidth;
    console.log(`Window resized to: ${width}px`);

    // Handle mobile/desktop navigation differences
    if (width < 768) {
      this.enableMobileNavigation();
    } else {
      this.disableMobileNavigation();
    }
  }

  enableMobileNavigation() {
    console.log("Mobile navigation enabled");
    // Mobile-specific navigation logic
  }

  disableMobileNavigation() {
    console.log("Desktop navigation enabled");
    // Desktop-specific navigation logic
  }

  smoothScrollTo(target) {
    const element = document.querySelector(target);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      console.log(`Smooth scrolled to: ${target}`);
    }
  }

  // Utility method for debugging
  getHeaderInfo() {
    return {
      height: this.header.offsetHeight,
      position: this.header.getBoundingClientRect(),
      isSticky: getComputedStyle(this.header).position === "sticky",
    };
  }
}

// Initialize header component when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, initializing header...");
  window.headerComponent = new HeaderComponent();
});

// Export for module usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = HeaderComponent;
}
