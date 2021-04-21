const THEME_STORAGE_KEY = "theme";

class ThemeSwitcher {
  constructor() {
    this.activeTheme = "default";
    this.hasLocalStorage = typeof Storage !== "undefined";
    this.svg = document.getElementById("photo__themes");
    this.toggle = document.getElementById("theme-switcher__display");
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
    // Options for the observer (which mutations to observe)
    const config = { attributes: true, childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    const callback = function (mutationsList, observer) {
      // Use traditional 'for loops' for IE 11
      for (const mutation of mutationsList) {
        if (mutation.type === "attributes") {
          if (mutation.target.ariaExpanded === "true") {
            document.documentElement.setAttribute("data-switcher-open", true);
          } else {
            document.documentElement.setAttribute("data-switcher-open", false);
          }
        }
      }
    };

    // Create an observer instance linked to the callback function
    let observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(this.toggle, config);
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

  toggleOptionDisplay() {
    const currentState =
      this.toggle.getAttribute("aria-expanded") === "false" ? false : true;
    this.toggle.setAttribute("aria-expanded", String(!currentState));
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
