// ---------- NAVIGATION ----------
document.querySelectorAll('.menu').forEach(btn=>{
  btn.onclick=()=>{
    document.querySelectorAll('.menu').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));

    btn.classList.add('active');
    document.getElementById(btn.dataset.page).classList.add('active');
  };
});

// ---------- CLOCK ----------
function updateClock(){
  const now=new Date();

  const timeStr=now.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
  const dateStr=now.toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric'});

  time.textContent=timeStr;
  date.textContent=dateStr;
  timeSmall.textContent=timeStr;

  lockTime.textContent=timeStr;
  lockDate.textContent=dateStr;

  screenTime.textContent=timeStr;
}
setInterval(updateClock,1000);
updateClock();

// ---------- WEATHER ----------
if(navigator.geolocation){
  navigator.geolocation.getCurrentPosition(async pos=>{
    try{
      const {latitude,longitude}=pos.coords;
      const res=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
      const data=await res.json();

      const w=data.current_weather;
      weatherText.textContent=`${w.temperature}°C • Wind ${w.windspeed} km/h`;
    }catch{
      weatherText.textContent="Weather unavailable";
    }
  },()=>{
    weatherText.textContent="Location blocked";
  });
}

// ---------- REMINDERS ----------
let reminders=JSON.parse(localStorage.getItem('reminders')||'[]');

function renderReminders(){
  reminderList.innerHTML='';

  reminders.forEach((r,i)=>{
    const li=document.createElement('li');

    const span=document.createElement('span');
    span.textContent=r;

    const btn=document.createElement('button');
    btn.textContent='✖';
    btn.onclick=()=>{
      reminders.splice(i,1);
      localStorage.setItem('reminders',JSON.stringify(reminders));
      renderReminders();
    };

    li.appendChild(span);
    li.appendChild(btn);
    reminderList.appendChild(li);
  });
}
renderReminders();

reminderInput.onkeypress=e=>{
  if(e.key==='Enter'){
    if(!reminderInput.value.trim()) return;

    reminders.push(reminderInput.value);
    localStorage.setItem('reminders',JSON.stringify(reminders));
    reminderInput.value='';
    renderReminders();
  }
};

// ---------- NOTES ----------
notesArea.value=localStorage.getItem('notes')||'';
notesArea.oninput=()=>localStorage.setItem('notes',notesArea.value);

clearNotes.onclick=()=>{
  notesArea.value='';
  localStorage.removeItem('notes');
};

// ---------- LOCK SCREEN ----------
clockCard.onclick=()=>lockScreen.classList.remove('hidden');
lockScreen.onclick=()=>lockScreen.classList.add('hidden');

// ---------- SCREENSAVER ----------
let idleTimer;
let delay=parseInt(localStorage.getItem('ssTime')||2);

ssTime.value=delay;

function startIdleTimer(){
  clearTimeout(idleTimer);
  idleTimer=setTimeout(()=>{
    screensaver.classList.remove('hidden');
  }, delay*60000);
}

function exitScreensaver(){
  screensaver.classList.add('hidden');
  startIdleTimer();
}

// EXIT on ANY interaction
['mousemove','click','touchstart','keydown'].forEach(evt=>{
  document.addEventListener(evt, exitScreensaver);
});

ssTime.oninput=()=>{
  delay=Math.max(1,parseInt(ssTime.value)||2);
  localStorage.setItem('ssTime',delay);
  startIdleTimer();
};

// start
startIdleTimer();
