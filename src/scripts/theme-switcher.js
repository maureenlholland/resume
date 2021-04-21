const THEME_STORAGE_KEY = "theme";

class ThemeSwitcher {
  constructor() {
    this.activeTheme = "default";
    this.hasLocalStorage = typeof Storage !== "undefined";
    this.svg = document.getElementById("photo__themes");
    this.toggle = document.getElementById("theme-switcher__display");
    this.themeMenu = document.getElementById("theme-switcher__options");
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
  }

  handleThemeMenu(mutationsList) {
    // Use traditional 'for loops' for IE 11
    for (const mutation of mutationsList) {
      if (mutation.type === "attributes") {
        if (mutation.target.ariaExpanded === "true") {
          /*
            When theme menu is expanded
            - blur background
            - tab trap inside theme menu
            - listen for ESC or outside theme menu event
            */
          document.documentElement.setAttribute("data-switcher-open", true);
          document.addEventListener("keydown", this.forceCloseThemeMenu);
          document.addEventListener("click", this.forceCloseThemeMenu);
        } else {
          /*
            When theme menu is closed
            - do not blur background
            - remove tab trap
            - remove ESC or outside theme menu event listeners
          */
          document.documentElement.setAttribute("data-switcher-open", false);
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
      this.toggle.focus();
    } else {
      const currentState =
        this.toggle.getAttribute("aria-expanded") === "false" ? false : true;
      this.toggle.setAttribute("aria-expanded", String(!currentState));
    }
  }

  tabTrapThemeMenu() {}

  forceCloseThemeMenu(e) {
    if (e.type === "keydown" && e.key === "Escape") {
      return this.toggleOptionDisplay({ forceClose: true });
    }
    if (
      e.type === "click" &&
      !e.path.includes(this.themeMenu) &&
      !e.path.includes(this.toggle)
    ) {
      return this.toggleOptionDisplay({ forceClose: true });
    }
  }

  setTheme(id) {
    this.activeTheme = id;
    document.documentElement.setAttribute("data-theme", id);

    // todo, change to overlay with z-index stacking updates
    const pans = {
      galaxy: 840,
      shire: 4120,
      default: 2500,
    };

    this.svg.setAttribute("viewBox", `${pans[id]} -50 450 2376`);

    if (this.hasLocalStorage) {
      localStorage.setItem(THEME_STORAGE_KEY, id);
    }
  }
}

if (window.CSS && CSS.supports("color", "var(--fake-var)")) {
  new ThemeSwitcher();
}
