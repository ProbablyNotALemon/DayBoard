// CLOCK
function updateClock() {
  const now = new Date();
  document.getElementById('time').textContent =
    now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  document.getElementById('date').textContent =
    now.toLocaleDateString(undefined, {weekday:'long', month:'long', day:'numeric'});
}
setInterval(updateClock, 1000);
updateClock();

// WEATHER (Open-Meteo, no key)
navigator.geolocation.getCurrentPosition(async pos => {
  const { latitude, longitude } = pos.coords;
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
  );
  const data = await res.json();
  const w = data.current_weather;
  document.getElementById('weather').textContent =
    `${w.temperature}°C, wind ${w.windspeed} km/h`;
});

// REMINDERS
const input = document.getElementById('reminderInput');
const list = document.getElementById('reminderList');

function loadReminders() {
  list.innerHTML = '';
  const reminders = JSON.parse(localStorage.getItem('reminders') || '[]');
  reminders.forEach(r => {
    const li = document.createElement('li');
    li.textContent = r;
    list.appendChild(li);
  });
}

input.addEventListener('keypress', e => {
  if (e.key === 'Enter') {
    const reminders = JSON.parse(localStorage.getItem('reminders') || '[]');
    reminders.push(input.value);
    localStorage.setItem('reminders', JSON.stringify(reminders));
    input.value = '';
    loadReminders();
  }
});
loadReminders();

// BATTERY
navigator.getBattery().then(battery => {
  function updateBattery() {
    document.getElementById('battery').textContent =
      Math.round(battery.level * 100) + '%';
  }
  updateBattery();
  battery.addEventListener('levelchange', updateBattery);
});

// SERVICE WORKER
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}