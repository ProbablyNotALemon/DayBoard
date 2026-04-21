const storageKeys = {
  reminders: "dayboard.reminders",
  notes: "dayboard.notes",
  screensaverDelay: "dayboard.screensaverDelay"
};

const elements = {
  menus: [...document.querySelectorAll(".menu")],
  pages: [...document.querySelectorAll(".page")],
  time: document.getElementById("time"),
  date: document.getElementById("date"),
  timeSmall: document.getElementById("timeSmall"),
  lockTime: document.getElementById("lockTime"),
  lockDate: document.getElementById("lockDate"),
  screenTime: document.getElementById("screenTime"),
  weatherText: document.getElementById("weatherText"),
  weatherPreview: document.getElementById("weatherPreview"),
  weatherMeta: document.getElementById("weatherMeta"),
  weatherStatus: document.getElementById("weatherStatus"),
  reminderList: document.getElementById("reminderList"),
  reminderInput: document.getElementById("reminderInput"),
  reminderPreview: document.getElementById("reminderPreview"),
  reminderCount: document.getElementById("reminderCount"),
  notesArea: document.getElementById("notesArea"),
  notesPreview: document.getElementById("notesPreview"),
  clearNotes: document.getElementById("clearNotes"),
  clockCard: document.getElementById("clockCard"),
  lockScreen: document.getElementById("lockScreen"),
  screensaver: document.getElementById("screensaver"),
  ssTime: document.getElementById("ssTime"),
  ssValue: document.getElementById("ssValue")
};

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

let reminders = loadStoredArray(storageKeys.reminders);
let screensaverDelay = loadStoredNumber(storageKeys.screensaverDelay, 2, 1, 30);
let screensaverTimer;

init();

function init() {
  bindNavigation();
  bindReminderInput();
  bindNotes();
  bindOverlayControls();
  bindScreensaverControls();
  restoreNotes();
  renderReminders();
  renderNotesPreview();
  updateClock();
  updateScreensaverUI();
  fetchWeather();
  resetScreensaverTimer();
  setInterval(updateClock, 1000);
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

function updateClock() {
  const now = new Date();
  const timeText = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
  const dateText = now.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric"
  });

  elements.time.textContent = timeText;
  elements.date.textContent = dateText;
  elements.timeSmall.textContent = timeText;
  elements.lockTime.textContent = timeText;
  elements.lockDate.textContent = dateText;
  elements.screenTime.textContent = timeText;
}

async function fetchWeather() {
  if (!navigator.geolocation) {
    setWeatherState("Weather unavailable", "Geolocation is not supported on this device.", "Location is not available in this browser.");
    return;
  }

  elements.weatherStatus.textContent = "Requesting your location permission.";

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

    reminders.unshift(value);
    persistArray(storageKeys.reminders, reminders);
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
    reminders.forEach((reminder, index) => {
      const item = document.createElement("li");
      item.className = "reminder-item";

      const text = document.createElement("span");
      text.className = "reminder-text";
      text.textContent = reminder;

      const removeButton = document.createElement("button");
      removeButton.className = "reminder-remove";
      removeButton.type = "button";
      removeButton.textContent = "Remove";
      removeButton.setAttribute("aria-label", `Remove reminder: ${reminder}`);
      removeButton.addEventListener("click", () => removeReminder(index));

      item.append(text, removeButton);
      elements.reminderList.appendChild(item);
    });
  }

  elements.reminderPreview.textContent = reminders[0] || "No reminders yet";
  elements.reminderCount.textContent = reminders.length
    ? `${reminders.length} reminder${reminders.length === 1 ? "" : "s"} saved`
    : "Add one below to get started.";
}

function removeReminder(index) {
  reminders.splice(index, 1);
  persistArray(storageKeys.reminders, reminders);
  renderReminders();
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
    ? `${note.slice(0, 140)}${note.length > 140 ? "..." : ""}`
    : "Your latest notes will appear here.";
}

function bindOverlayControls() {
  elements.clockCard.addEventListener("click", () => {
    elements.lockScreen.classList.remove("hidden");
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

function updateScreensaverUI() {
  elements.ssValue.textContent = `${screensaverDelay} min`;
}

function resetScreensaverTimer() {
  window.clearTimeout(screensaverTimer);
  elements.screensaver.classList.add("hidden");

  screensaverTimer = window.setTimeout(() => {
    elements.screensaver.classList.remove("hidden");
  }, screensaverDelay * 60 * 1000);
}

function loadStoredArray(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function persistArray(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function loadStoredNumber(key, fallback, min, max) {
  return loadNumber(localStorage.getItem(key), fallback, min, max);
}

function loadNumber(value, fallback, min, max) {
  const parsed = Number.parseInt(value, 10);

  if (Number.isNaN(parsed)) {
    return fallback;
  }

  return Math.min(Math.max(parsed, min), max);
}
