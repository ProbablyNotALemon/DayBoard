// CLOCK
function updateClock() {
  const now = new Date();
  const time = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  const date = now.toLocaleDateString(undefined, {weekday:'long', month:'long', day:'numeric'});

  document.getElementById('time').textContent = time;
  document.getElementById('date').textContent = date;
  document.getElementById('timeSmall').textContent = time;
}
setInterval(updateClock, 1000);
updateClock();

// WEATHER
navigator.geolocation.getCurrentPosition(pos => {
  const {latitude, longitude} = pos.coords;
  fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`)
    .then(res => res.json())
    .then(data => {
      const w = data.current_weather;
      document.getElementById('weather').textContent =
        `${w.temperature}°C • Wind ${w.windspeed} km/h`;
    });
});

// BATTERY
navigator.getBattery().then(battery => {
  function updateBattery() {
    document.getElementById('battery').textContent =
      Math.round(battery.level * 100) + "%";
  }
  updateBattery();
  battery.addEventListener('levelchange', updateBattery);
});

// REMINDERS
const input = document.getElementById('reminderInput');
const list = document.getElementById('reminderList');

input.addEventListener('keypress', e => {
  if (e.key === 'Enter') {
    const li = document.createElement('li');
    li.textContent = input.value;
    list.appendChild(li);
    input.value = '';
  }
});

// LOCK SCREEN
const lockScreen = document.getElementById('lockScreen');
const clockCard = document.getElementById('clockCard');

function updateLockClock() {
  const now = new Date();
  document.getElementById('lockTime').textContent =
    now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  document.getElementById('lockDate').textContent =
    now.toLocaleDateString(undefined, {weekday:'long', month:'long', day:'numeric'});
}
setInterval(updateLockClock, 1000);
updateLockClock();

clockCard.addEventListener('click', () => {
  lockScreen.classList.remove('hidden');
});

lockScreen.addEventListener('click', () => {
  lockScreen.classList.add('hidden');
});
