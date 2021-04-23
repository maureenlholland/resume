const THEME_STORAGE_KEY = "theme";

class ThemeSwitcher {
  constructor() {
    this.activeTheme = "default";
    this.hasLocalStorage = typeof Storage !== "undefined";
    this.svg = document.getElementById("photo__themes");
    this.toggle = document.getElementById("theme-switcher__display");
    this.themeSwitcher = document.querySelector(".theme-switcher");
    this.themeOptionsContainer = document.querySelector(
      ".theme-switcher__options"
    );
    this.themeOptions = document.querySelectorAll(".theme-switcher__option");

    this.init();
  }

  init() {
    const systemPreference = this.getSystemPreference();
    const storedPreference = this.getStoredPreference();

    if (storedPreference) {
      this.activeTheme = storedPreference;
    } else if (systemPreference) {
      this.activeTheme = systemPreference;
    }

    this.bindEvents();
    this.setTheme(this.activeTheme);
    document.documentElement.setAttribute("data-switcher-open", false);
    this.themeOptionsContainer.setAttribute("hidden", true);
  }

  bindEvents() {
    this.toggle.addEventListener("click", () => this.toggleOptionDisplay());
    this.themeOptions.forEach((option) => {
      const id = option.dataset.theme;
      if (id) {
        option.addEventListener("click", () => this.setTheme(id));
      }
    });

    // need the exact same function object to reference to remove this event listener, using bind instead of arrow function here
    this.handleThemeMenu = this.handleThemeMenu.bind(this);
    this.forceCloseThemeMenu = this.forceCloseThemeMenu.bind(this);
    // observe aria-expanded attribute on toggle button
    new MutationObserver(this.handleThemeMenu).observe(this.toggle, {
      attributes: true,
      attributeFilter: ["aria-expanded"],
    });
    // bind method for tab trap for same reason (needs same reference to remove)
    this.tabTrapThemeMenu = this.tabTrapThemeMenu.bind(this);
  }

  handleThemeMenu(mutationsList) {
    // Use traditional 'for loops' for IE 11
    for (const mutation of mutationsList) {
      if (mutation.type === "attributes") {
        if (mutation.target.ariaExpanded === "true") {
          /*
            When theme menu is expanded
            - blur background
            - display options
            - tab trap inside theme menu
            - listen for ESC or outside theme menu event
            */
          document.documentElement.setAttribute("data-switcher-open", true);
          this.themeOptionsContainer.removeAttribute("hidden");
          this.themeSwitcher.addEventListener("keydown", this.tabTrapThemeMenu);
          document.addEventListener("keydown", this.forceCloseThemeMenu);
          document.addEventListener("click", this.forceCloseThemeMenu);
        } else {
          /*
            When theme menu is closed
            - do not blur background
            - hide options
            - remove tab trap
            - remove ESC or outside theme menu event listeners
          */
          document.documentElement.setAttribute("data-switcher-open", false);
          this.themeOptionsContainer.setAttribute("hidden", true);
          this.themeSwitcher.removeEventListener(
            "keydown",
            this.tabTrapThemeMenu
          );
          document.removeEventListener("keydown", this.forceCloseThemeMenu);
          document.removeEventListener("click", this.forceCloseThemeMenu);
        }
      }
    }
  }

  getSystemPreference() {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return false;
  }

  getStoredPreference() {
    if (this.hasLocalStorage) {
      return localStorage.getItem(THEME_STORAGE_KEY);
    }
    return false;
  }

  toggleOptionDisplay(options = {}) {
    if (options.forceClose) {
      this.toggle.setAttribute("aria-expanded", false);
      // set focus on toggle button after menu closes
      return this.toggle.focus();
    }

    const currentState =
      this.toggle.getAttribute("aria-expanded") === "false" ? false : true;
    return this.toggle.setAttribute("aria-expanded", String(!currentState));
  }

  tabTrapThemeMenu(e) {
    const firstStop = this.toggle;
    const lastStop = this.themeOptions.item(this.themeOptions.length - 1);

    if (e.target === firstStop && e.shiftKey && e.key === "Tab") {
      // need to prevent default focus change because we are manually focusing on the desired element
      e.preventDefault();
      return lastStop.focus();
    }
    if (e.target === lastStop && !e.shiftKey && e.key === "Tab") {
      e.preventDefault();
      return firstStop.focus();
    }
  }

  forceCloseThemeMenu(e) {
    if (e.type === "keydown" && e.key === "Escape") {
      return this.toggleOptionDisplay({ forceClose: true });
    }
    if (e.type === "click" && !e.path.includes(this.themeSwitcher)) {
      return this.toggleOptionDisplay({ forceClose: true });
    }
  }

  setTheme(id) {
    this.activeTheme = id;
    document.documentElement.setAttribute("data-theme", id);
    this.themeOptions.forEach((option) => {
      if (option.dataset.theme !== id) {
        option.removeAttribute("aria-checked");
      } else {
        option.setAttribute("aria-checked", "true");
      }
    });

    if (this.hasLocalStorage) {
      localStorage.setItem(THEME_STORAGE_KEY, id);
    }
  }
}

if (window.CSS && CSS.supports("color", "var(--fake-var)")) {
  new ThemeSwitcher();
}
