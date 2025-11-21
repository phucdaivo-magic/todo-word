/**
 * ES Animation Component
 * A custom web component for scroll-based animations
 *
 * Attributes:
 * - max-steps: Maximum animation steps (default: 10)
 * - initial-step: Starting step (default: 0)
 * - debounce-time: Debounce delay in ms (default: 50)
 * - scroll-sensitivity: Pixels to scroll per step (default: 100)
 * - animation-speed: Animation transition speed (default: 'normal')
 *
 * Usage:
 * <es-animation max-steps="10" initial-step="0">
 *   <div class="es-animation-item">Content</div>
 * </es-animation>
 */

/**
 * Debounce utility function
 * Delays function execution until after wait time has elapsed
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func.apply(this, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle utility function
 * Ensures function is called at most once per specified time period
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
const throttle = (func, limit) => {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

class EsAnimation extends HTMLElement {
  constructor() {
    super();

    // Configuration
    this.config = {
      maxSteps: 10,
      initialStep: 0,
      debounceTime: 50,
      scrollSensitivity: 100,
      animationSpeed: "normal",
    };

    // State
    this.currentStep = 0;
    this.isAnimating = false;
    this.animationItems = [];

    // Bound methods for event listeners
    this.boundHandleWheel = null;
    this.boundHandleKeyboard = null;

    // Performance tracking
    this.lastScrollTime = 0;
    this.scrollAccumulator = 0;
  }

  /**
   * Called when element is inserted into DOM
   */
  connectedCallback() {
    this.init();
    this.registerEvents();
    this.updateAnimation();

    if (this.hasAttribute("debug")) {
      console.log("ES Animation initialized:", {
        config: this.config,
        items: this.animationItems.length,
      });
    }
  }

  /**
   * Called when element is removed from DOM
   */
  disconnectedCallback() {
    this.cleanup();
  }

  /**
   * Initialize component
   */
  init() {
    // Parse attributes
    this.parseAttributes();

    // Get animation items
    this.animationItems = Array.from(
      this.querySelectorAll(".es-animation-item")
    );

    if (this.animationItems.length === 0) {
      console.warn("ES Animation: No .es-animation-item elements found");
    }

    // Set initial step
    this.currentStep = this.config.initialStep;

    // Add container class
    this.classList.add("es-animation-container");

    // Set animation speed
    this.style.setProperty("--animation-speed", this.getAnimationSpeed());
  }

  /**
   * Parse component attributes
   */
  parseAttributes() {
    this.config.maxSteps = parseInt(
      this.getAttribute("max-steps") || this.config.maxSteps,
      10
    );

    this.config.initialStep = parseInt(
      this.getAttribute("initial-step") || this.config.initialStep,
      10
    );

    this.config.debounceTime = parseInt(
      this.getAttribute("debounce-time") || this.config.debounceTime,
      10
    );

    this.config.scrollSensitivity = parseInt(
      this.getAttribute("scroll-sensitivity") || this.config.scrollSensitivity,
      10
    );

    this.config.animationSpeed =
      this.getAttribute("animation-speed") || this.config.animationSpeed;
  }

  /**
   * Get CSS animation speed value
   * @returns {string} CSS time value
   */
  getAnimationSpeed() {
    const speeds = {
      slow: "0.6s",
      normal: "0.3s",
      fast: "0.15s",
    };
    return speeds[this.config.animationSpeed] || speeds.normal;
  }

  /**
   * Register event listeners
   */
  registerEvents() {
    // Wheel event with throttle for better performance
    this.boundHandleWheel = throttle(
      this.handleWheel.bind(this),
      this.config.debounceTime
    );

    // Keyboard navigation
    this.boundHandleKeyboard = this.handleKeyboard.bind(this);

    window.addEventListener("wheel", this.boundHandleWheel, { passive: true });
    window.addEventListener("keydown", this.boundHandleKeyboard);
  }

  /**
   * Handle wheel event
   * @param {WheelEvent} event - Wheel event
   */
  handleWheel(event) {
    const delta = Math.sign(event.deltaY);

    // Accumulate scroll for smoother control
    this.scrollAccumulator += Math.abs(event.deltaY);

    if (this.scrollAccumulator >= this.config.scrollSensitivity) {
      this.changeStep(delta);
      this.scrollAccumulator = 0;
    }
  }

  /**
   * Handle keyboard events
   * @param {KeyboardEvent} event - Keyboard event
   */
  handleKeyboard(event) {
    switch (event.key) {
      case "ArrowUp":
      case "ArrowLeft":
        event.preventDefault();
        this.changeStep(-1);
        break;
      case "ArrowDown":
      case "ArrowRight":
        event.preventDefault();
        this.changeStep(1);
        break;
      case "Home":
        event.preventDefault();
        this.goToStep(0);
        break;
      case "End":
        event.preventDefault();
        this.goToStep(this.config.maxSteps);
        break;
    }
  }

  /**
   * Change animation step by delta
   * @param {number} delta - Step change amount (+1 or -1)
   */
  changeStep(delta) {
    const newStep = this.currentStep + delta;
    this.goToStep(newStep);
  }

  /**
   * Go to specific animation step
   * @param {number} step - Target step
   */
  goToStep(step) {
    // Clamp step to valid range
    const clampedStep = Math.max(0, Math.min(step, this.config.maxSteps));

    if (clampedStep === this.currentStep) {
      return;
    }

    this.currentStep = clampedStep;
    this.updateAnimation();

    // Dispatch custom event
    this.dispatchEvent(
      new CustomEvent("step-change", {
        detail: {
          step: this.currentStep,
          maxSteps: this.config.maxSteps,
          progress: this.currentStep / this.config.maxSteps,
        },
        bubbles: true,
      })
    );
  }

  /**
   * Update animation classes
   */
  updateAnimation() {
    if (this.isAnimating) return;

    this.isAnimating = true;

    // Use requestAnimationFrame for smooth updates
    requestAnimationFrame(() => {
      this.animationItems.forEach((element) => {
        // Remove all step classes
        for (let i = 0; i <= this.config.maxSteps; i++) {
          element.classList.remove(`es-animation-step-${i}`);
          element.style = "";
        }

        // Add current and previous step classes
        for (let i = 0; i <= this.currentStep; i++) {
          element.classList.add(`es-animation-step-${i}`);
          element.style = this.animationItems[i].getAttribute(`data-step-${i}`);
        }

        // Set data attribute for CSS targeting
        element.setAttribute("data-step", this.currentStep);
      });

      // Update container data attribute
      this.setAttribute("data-current-step", this.currentStep);

      this.isAnimating = false;
    });
  }

  /**
   * Public API: Reset to initial step
   */
  reset() {
    this.goToStep(this.config.initialStep);
  }

  /**
   * Public API: Go to next step
   */
  next() {
    this.changeStep(1);
  }

  /**
   * Public API: Go to previous step
   */
  prev() {
    this.changeStep(-1);
  }

  /**
   * Public API: Get current step
   * @returns {number} Current step
   */
  getCurrentStep() {
    return this.currentStep;
  }

  /**
   * Public API: Get progress percentage
   * @returns {number} Progress (0-100)
   */
  getProgress() {
    return (this.currentStep / this.config.maxSteps) * 100;
  }

  /**
   * Cleanup event listeners
   */
  cleanup() {
    if (this.boundHandleWheel) {
      window.removeEventListener("wheel", this.boundHandleWheel);
    }
    if (this.boundHandleKeyboard) {
      window.removeEventListener("keydown", this.boundHandleKeyboard);
    }
  }

  /**
   * Observed attributes for attribute change callbacks
   */
  static get observedAttributes() {
    return ["max-steps", "initial-step", "animation-speed"];
  }

  /**
   * Called when observed attributes change
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    switch (name) {
      case "max-steps":
        this.config.maxSteps = parseInt(newValue, 10);
        if (this.currentStep > this.config.maxSteps) {
          this.goToStep(this.config.maxSteps);
        }
        break;
      case "initial-step":
        this.config.initialStep = parseInt(newValue, 10);
        break;
      case "animation-speed":
        this.config.animationSpeed = newValue;
        this.style.setProperty("--animation-speed", this.getAnimationSpeed());
        break;
    }
  }
}

// Register custom element
customElements.define("es-animation", EsAnimation);

// Hot reload for development
new EventSource("/esbuild").addEventListener("change", () => location.reload());
