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
  menus: [...document.querySelectorAll(".menu")],
  pages: [...document.querySelectorAll(".page")],
  time: document.getElementById("time"),
  date: document.getElementById("date"),
  timeSmall: document.getElementById("timeSmall"),
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
  screensaverSummary: document.getElementById("screensaverSummary"),
  clockCard: document.getElementById("clockCard"),
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
    button.addEventListener("click", fetchWeather);
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

  elements.time.textContent = timeText;
  elements.date.textContent = dateText;
  elements.timeSmall.textContent = compactTime;
  elements.sidebarDateLabel.textContent = shortDate;
  elements.lockTime.textContent = timeText;
  elements.lockDate.textContent = dateText;
  elements.screenTime.textContent = timeText;
  elements.screenDate.textContent = dateText;
  elements.dailyGreeting.textContent = `${getGreeting(now)}, ${userName}`;
  elements.dayProgressValue.textContent = `${getDayProgress(now)}%`;
  elements.clockSubline.textContent = `${getDayName(now)} • ${getDayProgress(now)}% through the day`;
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
  document.body.dataset.theme = resolvedTheme;
  elements.themeStatus.textContent = themeMode === "auto"
    ? `Auto: ${capitalize(resolvedTheme)}`
    : capitalize(resolvedTheme);
}

function renderQuoteOfTheDay() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const day = Math.floor(diff / 86400000);
  const quote = quotes[day % quotes.length];

  elements.quoteText.textContent = quote.text;
  elements.quoteAuthor.textContent = quote.author;
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

  elements.weatherStatus.textContent = "Requesting your location permission.";
  elements.weatherMeta.textContent = "Fetching the latest conditions.";

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
  elements.weatherPreview.textContent = primary;
  elements.weatherText.textContent = primary;
  elements.weatherMeta.textContent = secondary;
  elements.weatherStatus.textContent = status;
}

function bindReminderInput() {
  elements.reminderInput.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") {
      return;
    }

    const value = elements.reminderInput.value.trim();

    if (!value) {
      return;
    }

    reminders.unshift({
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      text: value,
      done: false
    });
    persistReminders();
    elements.reminderInput.value = "";
    renderReminders();
  });
}

function renderReminders() {
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
  elements.reminderPreview.textContent = remaining[0]?.text || "Nothing urgent right now";
  elements.reminderCount.textContent = reminders.length
    ? `${remaining.length} active of ${reminders.length} total`
    : "Add one below to get started.";
  elements.heroReminderCount.textContent = String(reminders.length);
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
  elements.notesArea.addEventListener("input", () => {
    localStorage.setItem(storageKeys.notes, elements.notesArea.value);
    renderNotesPreview();
  });

  elements.clearNotes.addEventListener("click", () => {
    elements.notesArea.value = "";
    localStorage.removeItem(storageKeys.notes);
    renderNotesPreview();
  });
}

function restoreNotes() {
  elements.notesArea.value = localStorage.getItem(storageKeys.notes) || "";
}

function renderNotesPreview() {
  const note = elements.notesArea.value.trim();
  elements.notesPreview.textContent = note
    ? `${note.slice(0, 180)}${note.length > 180 ? "..." : ""}`
    : "Your latest notes will appear here.";
  elements.notesLength.textContent = `${note.length} chars`;
}

function bindFocus() {
  elements.focusInput.addEventListener("input", () => {
    localStorage.setItem(storageKeys.focus, elements.focusInput.value.trim());
    renderFocus();
  });
}

function restoreFocus() {
  elements.focusInput.value = localStorage.getItem(storageKeys.focus) || "";
}

function renderFocus() {
  const focus = elements.focusInput.value.trim();
  const focusText = focus || "Set a short intention for the day.";
  elements.focusPreview.textContent = focusText;
  elements.lockFocus.textContent = focus ? `Focus: ${focus}` : "Tap anywhere to return to your board.";
  elements.screenFocus.textContent = focus ? `Today's focus: ${focus}` : "A softer view for quiet moments.";
}

function bindOverlayControls() {
  elements.clockCard.addEventListener("click", () => {
    elements.lockScreen.classList.remove("hidden");
    elements.screensaver.classList.add("hidden");
  });

  elements.lockScreen.addEventListener("click", () => {
    elements.lockScreen.classList.add("hidden");
  });
}

function bindScreensaverControls() {
  elements.ssTime.value = String(screensaverDelay);

  elements.ssTime.addEventListener("input", () => {
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
  elements.clockSecondsToggle.addEventListener("click", () => {
    showSeconds = !showSeconds;
    localStorage.setItem(storageKeys.showSeconds, String(showSeconds));
    updatePreferenceToggles();
    updateClock();
  });

  elements.twentyFourToggle.addEventListener("click", () => {
    use24Hour = !use24Hour;
    localStorage.setItem(storageKeys.use24Hour, String(use24Hour));
    updatePreferenceToggles();
    updateClock();
  });

  elements.themeMode.addEventListener("change", () => {
    themeMode = elements.themeMode.value;
    localStorage.setItem(storageKeys.themeMode, themeMode);
    applyTheme();
  });
}

function bindNameSettings() {
  elements.userNameInput.addEventListener("input", () => {
    userName = elements.userNameInput.value.trim() || "John";
    localStorage.setItem(storageKeys.userName, userName);
    renderUserName();
    updateClock();
  });
}

function restoreName() {
  elements.userNameInput.value = userName;
  renderUserName();
}

function bindSetupFlow() {
  elements.setupThemeMode.value = themeMode;
  elements.setupNameInput.value = userName;

  elements.completeSetup.addEventListener("click", () => {
    userName = elements.setupNameInput.value.trim() || "John";
    themeMode = elements.setupThemeMode.value;
    hasCompletedSetup = true;

    localStorage.setItem(storageKeys.userName, userName);
    localStorage.setItem(storageKeys.themeMode, themeMode);
    localStorage.setItem(storageKeys.hasCompletedSetup, "true");

    elements.userNameInput.value = userName;
    elements.themeMode.value = themeMode;
    renderUserName();
    updatePreferenceToggles();
    applyTheme();
    updateClock();
    updateSetupVisibility();
  });
}

function updateSetupVisibility() {
  elements.setupScreen.classList.toggle("hidden", hasCompletedSetup);
}

function bindResetAction() {
  elements.resetApp.addEventListener("click", () => {
    const shouldReset = window.confirm("Reset DayBoard? This clears your name, reminders, notes, settings, and all saved data for this app.");

    if (!shouldReset) {
      return;
    }

    Object.values(storageKeys).forEach((key) => localStorage.removeItem(key));
    window.location.reload();
  });
}

function updatePreferenceToggles() {
  setToggleState(elements.clockSecondsToggle, showSeconds);
  setToggleState(elements.twentyFourToggle, use24Hour);
  elements.themeMode.value = themeMode;
}

function renderUserName() {
  elements.homeTitle.textContent = `Hi, ${userName}. Ready for a calmer day?`;
}

function setToggleState(button, isOn) {
  button.classList.toggle("is-on", isOn);
  button.textContent = isOn ? "On" : "Off";
  button.setAttribute("aria-pressed", String(isOn));
}

function updateScreensaverUI() {
  elements.ssValue.textContent = `${screensaverDelay} min`;
  elements.screensaverSummary.textContent = `Soft light motion after ${screensaverDelay} minute${screensaverDelay === 1 ? "" : "s"} of inactivity.`;
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
            id: crypto.randomUUID ? crypto.randomUUID() : `${item}-${Date.now()}`,
            text: item,
            done: false
          };
        }

        if (item && typeof item.text === "string") {
          return {
            id: item.id || (crypto.randomUUID ? crypto.randomUUID() : `${item.text}-${Date.now()}`),
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
