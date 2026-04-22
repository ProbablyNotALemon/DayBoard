const storageKeys = {
  reminders: "dayboard.reminders",
  notes: "dayboard.notes",
  screensaverDelay: "dayboard.screensaverDelay",
  focus: "dayboard.focus",
  showSeconds: "dayboard.showSeconds",
  use24Hour: "dayboard.use24Hour",
  themeMode: "dayboard.themeMode",
  userName: "dayboard.userName",
  hasCompletedSetup: "dayboard.hasCompletedSetup"
};

const elements = {
  menus: Array.from(document.querySelectorAll(".menu")),
  pages: Array.from(document.querySelectorAll(".page")),
  time: document.getElementById("time") || document.getElementById("lockTime"),
  date: document.getElementById("date") || document.getElementById("screenDate"),
  timeSmall: document.getElementById("timeSmall") || document.getElementById("timeTop"),
  sidebarDateLabel: document.getElementById("sidebarDateLabel"),
  dailyGreeting: document.getElementById("dailyGreeting"),
  dayProgressValue: document.getElementById("dayProgressValue"),
  heroReminderCount: document.getElementById("heroReminderCount"),
  notesLength: document.getElementById("notesLength"),
  themeStatus: document.getElementById("themeStatus"),
  clockSubline: document.getElementById("clockSubline"),
  quoteText: document.getElementById("quoteText"),
  quoteAuthor: document.getElementById("quoteAuthor"),
  homeTitle: document.getElementById("homeTitle"),
  heroUserName: document.getElementById("heroUserName"),
  weatherTop: document.getElementById("weatherTop"),
  timeTop: document.getElementById("timeTop"),
  weatherText: document.getElementById("weatherText"),
  weatherPreview: document.getElementById("weatherPreview"),
  weatherMeta: document.getElementById("weatherMeta"),
  weatherStatus: document.getElementById("weatherStatus"),
  refreshWeather: document.getElementById("refreshWeather"),
  refreshWeatherPage: document.getElementById("refreshWeatherPage"),
  reminderList: document.getElementById("reminderList"),
  reminderInput: document.getElementById("reminderInput"),
  reminderPreview: document.getElementById("reminderPreview"),
  reminderCount: document.getElementById("reminderCount"),
  notesArea: document.getElementById("notesArea"),
  notesPreview: document.getElementById("notesPreview"),
  clearNotes: document.getElementById("clearNotes"),
  focusInput: document.getElementById("focusInput"),
  focusPreview: document.getElementById("focusPreview"),
  focusCardText: document.getElementById("focusCardText"),
  screensaverSummary: document.getElementById("screensaverSummary"),
  clockCard: document.getElementById("clockCard") || document.getElementById("timeTop"),
  lockScreen: document.getElementById("lockScreen"),
  lockTime: document.getElementById("lockTime"),
  lockDate: document.getElementById("lockDate"),
  lockFocus: document.getElementById("lockFocus"),
  screensaver: document.getElementById("screensaver"),
  screenTime: document.getElementById("screenTime"),
  screenDate: document.getElementById("screenDate"),
  screenFocus: document.getElementById("screenFocus"),
  ssTime: document.getElementById("ssTime"),
  ssValue: document.getElementById("ssValue"),
  clockSecondsToggle: document.getElementById("clockSecondsToggle"),
  twentyFourToggle: document.getElementById("twentyFourToggle"),
  themeMode: document.getElementById("themeMode"),
  userNameInput: document.getElementById("userNameInput"),
  resetApp: document.getElementById("resetApp"),
  setupScreen: document.getElementById("setupScreen"),
  setupNameInput: document.getElementById("setupNameInput"),
  setupThemeMode: document.getElementById("setupThemeMode"),
  completeSetup: document.getElementById("completeSetup")
};

const quotes = [
  { text: "Small steps still count as forward motion.", author: "DayBoard" },
  { text: "Make the next good choice, then another.", author: "DayBoard" },
  { text: "A calm plan beats a rushed reaction.", author: "DayBoard" },
  { text: "Protect your attention and the day improves with it.", author: "DayBoard" },
  { text: "Leave space in the day for what matters most.", author: "DayBoard" },
  { text: "Clarity grows when the noise gets quieter.", author: "DayBoard" },
  { text: "Finish one meaningful thing before chasing five more.", author: "DayBoard" }
];

const weatherDescriptions = {
  0: "Clear sky",
  1: "Mostly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Foggy",
  48: "Icy fog",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Dense drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  71: "Light snow",
  73: "Snow",
  75: "Heavy snow",
  80: "Rain showers",
  81: "Strong showers",
  82: "Heavy showers",
  95: "Thunderstorm"
};

let reminders = loadStoredReminders();
let screensaverDelay = loadStoredNumber(storageKeys.screensaverDelay, 2, 1, 30);
let showSeconds = loadStoredBoolean(storageKeys.showSeconds, false);
let use24Hour = loadStoredBoolean(storageKeys.use24Hour, false);
let themeMode = localStorage.getItem(storageKeys.themeMode) || "auto";
let userName = localStorage.getItem(storageKeys.userName) || "John";
let hasCompletedSetup = loadStoredBoolean(storageKeys.hasCompletedSetup, false);
let screensaverTimer;
const themeClassNames = ["theme-dawn", "theme-day", "theme-sunset", "theme-night"];

init();

function init() {
  bindNavigation();
  bindWeatherControls();
  bindReminderInput();
  bindNotes();
  bindFocus();
  bindOverlayControls();
  bindScreensaverControls();
  bindPreferenceToggles();
  bindNameSettings();
  bindSetupFlow();
  bindResetAction();
  restoreNotes();
  restoreFocus();
  restoreName();
  renderReminders();
  renderNotesPreview();
  renderFocus();
  renderQuoteOfTheDay();
  updatePreferenceToggles();
  updateScreensaverUI();
  updateClock();
  fetchWeather();
  resetScreensaverTimer();
  updateSetupVisibility();
  window.setInterval(updateClock, 1000);
}

function setText(element, value) {
  if (element) {
    element.textContent = value;
  }
}

function setValue(element, value) {
  if (element) {
    element.value = value;
  }
}

function on(element, eventName, handler, options) {
  if (element) {
    element.addEventListener(eventName, handler, options);
  }
}

function bindNavigation() {
  elements.menus.forEach((button) => {
    button.addEventListener("click", () => setActivePage(button.dataset.page));
  });
}

function setActivePage(pageId) {
  elements.menus.forEach((button) => {
    button.classList.toggle("active", button.dataset.page === pageId);
  });

  elements.pages.forEach((page) => {
    page.classList.toggle("active", page.id === pageId);
  });
}

function bindWeatherControls() {
  [elements.refreshWeather, elements.refreshWeatherPage].forEach((button) => {
    on(button, "click", fetchWeather);
  });
}

function updateClock() {
  const now = new Date();
  const timeText = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: showSeconds ? "2-digit" : undefined,
    hour12: !use24Hour
  });
  const compactTime = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: !use24Hour
  });
  const dateText = now.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric"
  });
  const shortDate = now.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric"
  });

  setText(elements.time, timeText);
  setText(elements.date, dateText);
  setText(elements.timeSmall, compactTime);
  setText(elements.timeTop, compactTime);
  setText(elements.sidebarDateLabel, shortDate);
  setText(elements.lockTime, timeText);
  setText(elements.lockDate, dateText);
  setText(elements.screenTime, timeText);
  setText(elements.screenDate, dateText);
  setText(elements.dailyGreeting, `${getGreeting(now)}. Everything looks good today.`);
  setText(elements.dayProgressValue, `${getDayProgress(now)}%`);
  setText(elements.clockSubline, `${getDayName(now)} • ${getDayProgress(now)}% through the day`);
  applyTheme(now);
}

function getGreeting(now) {
  const hour = now.getHours();

  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 18) {
    return "Good afternoon";
  }

  return "Good evening";
}

function getAutoTheme(now) {
  const hour = now.getHours();

  if (hour >= 5 && hour < 10) {
    return "dawn";
  }

  if (hour >= 10 && hour < 17) {
    return "day";
  }

  if (hour >= 17 && hour < 21) {
    return "sunset";
  }

  return "night";
}

function applyTheme(now = new Date()) {
  const resolvedTheme = themeMode === "auto" ? getAutoTheme(now) : themeMode;
  document.body.setAttribute("data-theme", resolvedTheme);
  themeClassNames.forEach((className) => document.body.classList.remove(className));
  document.body.classList.add(`theme-${resolvedTheme}`);
  setText(
    elements.themeStatus,
    themeMode === "auto" ? `Auto: ${capitalize(resolvedTheme)}` : capitalize(resolvedTheme)
  );
}

function renderQuoteOfTheDay() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const day = Math.floor(diff / 86400000);
  const quote = quotes[day % quotes.length];

  setText(elements.quoteText, quote.text);
  setText(elements.quoteAuthor, quote.author);
}

function getDayName(now) {
  return now.toLocaleDateString(undefined, { weekday: "long" });
}

function getDayProgress(now) {
  const minutes = now.getHours() * 60 + now.getMinutes();
  return Math.max(0, Math.min(100, Math.round((minutes / 1440) * 100)));
}

async function fetchWeather() {
  if (!navigator.geolocation) {
    setWeatherState("Weather unavailable", "Geolocation is not supported on this device.", "Location is not available in this browser.");
    return;
  }

  setText(elements.weatherStatus, "Requesting your location permission.");
  setText(elements.weatherMeta, "Fetching the latest conditions.");

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m`
        );

        if (!response.ok) {
          throw new Error("Weather request failed");
        }

        const data = await response.json();
        const current = data.current;
        const summary = weatherDescriptions[current.weather_code] || "Current conditions";
        const primaryText = `${Math.round(current.temperature_2m)}°C and ${summary}`;
        const detailText = `Feels like ${Math.round(current.apparent_temperature)}°C with ${Math.round(current.wind_speed_10m)} km/h wind`;

        setWeatherState(primaryText, detailText, "Forecast based on your current location.");
      } catch {
        setWeatherState("Weather unavailable", "We couldn't load the latest forecast.", "Please try again in a moment.");
      }
    },
    () => {
      setWeatherState("Weather unavailable", "Location access was denied.", "Enable location services to see local weather.");
    },
    {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 300000
    }
  );
}

function setWeatherState(primary, secondary, status) {
  setText(elements.weatherPreview, primary);
  setText(elements.weatherTop, primary.split(" ")[0]);
  setText(elements.weatherText, primary);
  setText(elements.weatherMeta, secondary);
  setText(elements.weatherStatus, status);
}

function bindReminderInput() {
  on(elements.reminderInput, "keydown", (event) => {
    if (event.key !== "Enter") {
      return;
    }

    const value = elements.reminderInput.value.trim();

    if (!value) {
      return;
    }

    reminders.unshift({
      id: createId(),
      text: value,
      done: false
    });
    persistReminders();
    setValue(elements.reminderInput, "");
    renderReminders();
  });
}

function renderReminders() {
  if (!elements.reminderList) {
    return;
  }

  elements.reminderList.innerHTML = "";

  if (reminders.length === 0) {
    const emptyState = document.createElement("li");
    emptyState.className = "empty-state";
    emptyState.textContent = "No reminders yet. Add one above to get started.";
    elements.reminderList.appendChild(emptyState);
  } else {
    reminders.forEach((reminder) => {
      const item = document.createElement("li");
      item.className = `reminder-item${reminder.done ? " is-done" : ""}`;

      const main = document.createElement("div");
      main.className = "reminder-main";

      const checkButton = document.createElement("button");
      checkButton.className = `reminder-check${reminder.done ? " is-done" : ""}`;
      checkButton.type = "button";
      checkButton.setAttribute("aria-label", `${reminder.done ? "Mark as not done" : "Mark as done"}: ${reminder.text}`);
      checkButton.addEventListener("click", () => toggleReminder(reminder.id));

      const text = document.createElement("span");
      text.className = "reminder-text";
      text.textContent = reminder.text;

      main.append(checkButton, text);

      const removeButton = document.createElement("button");
      removeButton.className = "reminder-remove";
      removeButton.type = "button";
      removeButton.textContent = "Remove";
      removeButton.setAttribute("aria-label", `Remove reminder: ${reminder.text}`);
      removeButton.addEventListener("click", () => removeReminder(reminder.id));

      item.append(main, removeButton);
      elements.reminderList.appendChild(item);
    });
  }

  const remaining = reminders.filter((item) => !item.done);
  setText(elements.reminderPreview, remaining.length > 0 ? remaining[0].text : "Nothing urgent right now");
  setText(
    elements.reminderCount,
    reminders.length ? `${remaining.length} active of ${reminders.length} total` : "Add one below to get started."
  );
  setText(elements.heroReminderCount, String(reminders.length));
}

function toggleReminder(id) {
  reminders = reminders.map((reminder) => (
    reminder.id === id
      ? { ...reminder, done: !reminder.done }
      : reminder
  ));
  persistReminders();
  renderReminders();
}

function removeReminder(id) {
  reminders = reminders.filter((reminder) => reminder.id !== id);
  persistReminders();
  renderReminders();
}

function persistReminders() {
  localStorage.setItem(storageKeys.reminders, JSON.stringify(reminders));
}

function bindNotes() {
  on(elements.notesArea, "input", () => {
    localStorage.setItem(storageKeys.notes, elements.notesArea.value);
    renderNotesPreview();
  });

  on(elements.clearNotes, "click", () => {
    setValue(elements.notesArea, "");
    localStorage.removeItem(storageKeys.notes);
    renderNotesPreview();
  });
}

function restoreNotes() {
  setValue(elements.notesArea, localStorage.getItem(storageKeys.notes) || "");
}

function renderNotesPreview() {
  if (!elements.notesArea) {
    return;
  }
  const note = elements.notesArea.value.trim();
  setText(
    elements.notesPreview,
    note ? `${note.slice(0, 180)}${note.length > 180 ? "..." : ""}` : "Your latest notes will appear here."
  );
  setText(elements.notesLength, `${note.length} chars`);
}

function bindFocus() {
  on(elements.focusInput, "input", () => {
    localStorage.setItem(storageKeys.focus, elements.focusInput.value.trim());
    renderFocus();
  });
}

function restoreFocus() {
  setValue(elements.focusInput, localStorage.getItem(storageKeys.focus) || "");
}

function renderFocus() {
  if (!elements.focusInput) {
    return;
  }
  const focus = elements.focusInput.value.trim();
  const focusText = focus || "Set a short intention for the day.";
  setText(elements.focusPreview, focusText);
  setText(elements.focusCardText, focusText);
  setText(elements.lockFocus, focus ? `Focus: ${focus}` : "Tap anywhere to return to your board.");
  setText(elements.screenFocus, focus ? `Today's focus: ${focus}` : "A softer view for quiet moments.");
}

function bindOverlayControls() {
  on(elements.clockCard, "click", () => {
    elements.lockScreen.classList.remove("hidden");
    elements.screensaver.classList.add("hidden");
  });

  on(elements.lockScreen, "click", () => {
    elements.lockScreen.classList.add("hidden");
  });
}

function bindScreensaverControls() {
  setValue(elements.ssTime, String(screensaverDelay));

  on(elements.ssTime, "input", () => {
    screensaverDelay = loadNumber(elements.ssTime.value, 2, 1, 30);
    localStorage.setItem(storageKeys.screensaverDelay, String(screensaverDelay));
    updateScreensaverUI();
    resetScreensaverTimer();
  });

  ["mousemove", "mousedown", "click", "touchstart", "keydown"].forEach((eventName) => {
    document.addEventListener(eventName, resetScreensaverTimer, { passive: true });
  });
}

function bindPreferenceToggles() {
  on(elements.clockSecondsToggle, "click", () => {
    showSeconds = !showSeconds;
    localStorage.setItem(storageKeys.showSeconds, String(showSeconds));
    updatePreferenceToggles();
    updateClock();
  });

  on(elements.twentyFourToggle, "click", () => {
    use24Hour = !use24Hour;
    localStorage.setItem(storageKeys.use24Hour, String(use24Hour));
    updatePreferenceToggles();
    updateClock();
  });

  on(elements.themeMode, "change", () => {
    themeMode = elements.themeMode.value;
    localStorage.setItem(storageKeys.themeMode, themeMode);
    applyTheme();
  });
}

function bindNameSettings() {
  on(elements.userNameInput, "input", () => {
    userName = elements.userNameInput.value.trim() || "John";
    localStorage.setItem(storageKeys.userName, userName);
    renderUserName();
    updateClock();
  });
}

function restoreName() {
  setValue(elements.userNameInput, userName);
  renderUserName();
}

function bindSetupFlow() {
  syncSetupForm();

  on(elements.completeSetup, "click", () => {
    userName = elements.setupNameInput.value.trim() || "John";
    themeMode = elements.setupThemeMode.value;
    hasCompletedSetup = true;

    localStorage.setItem(storageKeys.userName, userName);
    localStorage.setItem(storageKeys.themeMode, themeMode);
    localStorage.setItem(storageKeys.hasCompletedSetup, "true");

    setValue(elements.userNameInput, userName);
    setValue(elements.themeMode, themeMode);
    renderUserName();
    updatePreferenceToggles();
    applyTheme();
    updateClock();
    updateSetupVisibility();
  });
}

function updateSetupVisibility() {
  if (hasCompletedSetup) {
    if (elements.setupScreen) {
      elements.setupScreen.classList.add("hidden");
    }
    document.body.classList.remove("setup-open");
    return;
  }

  syncSetupForm();
  if (elements.setupScreen) {
    elements.setupScreen.classList.remove("hidden");
  }
  document.body.classList.add("setup-open");
}

function bindResetAction() {
  on(elements.resetApp, "click", () => {
    const shouldReset = window.confirm("Reset DayBoard? This clears your name, reminders, notes, settings, and all saved data for this app.");

    if (!shouldReset) {
      return;
    }

    Object.values(storageKeys).forEach((key) => localStorage.removeItem(key));
    hasCompletedSetup = false;
    window.location.reload();
  });
}

function updatePreferenceToggles() {
  if (elements.clockSecondsToggle) {
    setToggleState(elements.clockSecondsToggle, showSeconds);
  }
  if (elements.twentyFourToggle) {
    setToggleState(elements.twentyFourToggle, use24Hour);
  }
  setValue(elements.themeMode, themeMode);
}

function renderUserName() {
  setText(elements.heroUserName, userName);
}

function syncSetupForm() {
  setValue(elements.setupNameInput, userName);
  setValue(elements.setupThemeMode, themeMode);
}

function setToggleState(button, isOn) {
  button.classList.toggle("is-on", isOn);
  button.textContent = isOn ? "On" : "Off";
  button.setAttribute("aria-pressed", String(isOn));
}

function updateScreensaverUI() {
  setText(elements.ssValue, `${screensaverDelay} min`);
  setText(elements.screensaverSummary, `Soft light motion after ${screensaverDelay} minute${screensaverDelay === 1 ? "" : "s"} of inactivity.`);
}

function resetScreensaverTimer() {
  window.clearTimeout(screensaverTimer);
  elements.screensaver.classList.add("hidden");

  screensaverTimer = window.setTimeout(() => {
    elements.lockScreen.classList.add("hidden");
    elements.screensaver.classList.remove("hidden");
  }, screensaverDelay * 60 * 1000);
}

function loadStoredReminders() {
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKeys.reminders) || "[]");

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((item) => {
        if (typeof item === "string") {
          return {
            id: createId(),
            text: item,
            done: false
          };
        }

        if (item && typeof item.text === "string") {
          return {
            id: item.id || createId(),
            text: item.text,
            done: Boolean(item.done)
          };
        }

        return null;
      })
      .filter(Boolean);
  } catch {
    return [];
  }
}

function loadStoredNumber(key, fallback, min, max) {
  return loadNumber(localStorage.getItem(key), fallback, min, max);
}

function loadStoredBoolean(key, fallback) {
  const value = localStorage.getItem(key);

  if (value === null) {
    return fallback;
  }

  return value === "true";
}

function loadNumber(value, fallback, min, max) {
  const parsed = Number.parseInt(value, 10);

  if (Number.isNaN(parsed)) {
    return fallback;
  }

  return Math.min(Math.max(parsed, min), max);
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function createId() {
  return `id-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}
