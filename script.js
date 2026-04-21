// TAB NAVIGATION
document.querySelectorAll('.menu').forEach(btn=>{
  btn.onclick=()=>{
    document.querySelectorAll('.menu').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.page).classList.add('active');
  };
});

// CLOCK
function updateClock(){
  const now=new Date();
  const t=now.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
  const d=now.toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric'});
  time.textContent=t;
  date.textContent=d;
  timeSmall.textContent=t;
}
setInterval(updateClock,1000);
updateClock();

// WEATHER
navigator.geolocation.getCurrentPosition(pos=>{
  const {latitude,longitude}=pos.coords;
  fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`)
  .then(r=>r.json()).then(data=>{
    const w=data.current_weather;
    const text=`${w.temperature}°C • Wind ${w.windspeed} km/h`;
    weatherPreview.textContent=text;
    weatherBig.textContent=text;
  });
});

// REMINDERS
const input=reminderInput;
const list=reminderList;
let reminders=JSON.parse(localStorage.getItem('reminders')||'[]');

function renderReminders(){
  list.innerHTML='';
  reminders.forEach(r=>{
    const li=document.createElement('li');
    li.textContent=r;
    list.appendChild(li);
  });
  reminderPreview.textContent=reminders[0]||'No reminders';
}
renderReminders();

input.onkeypress=e=>{
 if(e.key==='Enter'){
   reminders.push(input.value);
   localStorage.setItem('reminders',JSON.stringify(reminders));
   input.value='';
   renderReminders();
 }
};

// NOTES SAVE
notesArea.value=localStorage.getItem('notes')||'';
notesArea.oninput=()=>localStorage.setItem('notes',notesArea.value);

// LOCK SCREEN
clockCard.onclick=()=>lockScreen.classList.remove('hidden');
lockScreen.onclick=()=>lockScreen.classList.add('hidden');

function updateLock(){
 const now=new Date();
 lockTime.textContent=now.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
 lockDate.textContent=now.toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric'});
}
setInterval(updateLock,1000);
updateLock();
