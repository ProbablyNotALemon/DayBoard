// NAV
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
  const n=new Date();

  const t=n.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
  const d=n.toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric'});

  time.textContent=t;
  date.textContent=d;
  timeSmall.textContent=t;

  lockTime.textContent=t;
  lockDate.textContent=d;

  screenTime.textContent=t;
}
setInterval(updateClock,1000);
updateClock();

// WEATHER
if(navigator.geolocation){
  navigator.geolocation.getCurrentPosition(async pos=>{
    try{
      const res=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&current_weather=true`);
      const data=await res.json();

      const w=data.current_weather;
      const txt=`${w.temperature}°C • Wind ${w.windspeed} km/h`;

      weatherText.textContent=txt;
      weatherPreview.textContent=txt;

    }catch{
      weatherText.textContent="Unavailable";
    }
  });
}

// REMINDERS
let reminders=JSON.parse(localStorage.getItem('r')||'[]');

function render(){
  reminderList.innerHTML='';

  reminders.forEach((r,i)=>{
    const li=document.createElement('li');
    li.innerHTML=`${r} <button data-i="${i}">✖</button>`;
    reminderList.appendChild(li);
  });

  document.querySelectorAll('button[data-i]').forEach(btn=>{
    btn.onclick=()=>{
      reminders.splice(btn.dataset.i,1);
      localStorage.setItem('r',JSON.stringify(reminders));
      render();
    };
  });

  reminderPreview.textContent=reminders[0]||"No reminders";
}
render();

reminderInput.onkeypress=e=>{
  if(e.key==='Enter'){
    reminders.push(reminderInput.value);
    localStorage.setItem('r',JSON.stringify(reminders));
    reminderInput.value='';
    render();
  }
};

// NOTES
notesArea.value=localStorage.getItem('n')||'';
notesArea.oninput=()=>localStorage.setItem('n',notesArea.value);

clearNotes.onclick=()=>{
  notesArea.value='';
  localStorage.removeItem('n');
};

// LOCK
clockCard.onclick=()=>lockScreen.classList.remove('hidden');
lockScreen.onclick=()=>lockScreen.classList.add('hidden');

// SCREENSAVER
let delay=2;
let timer;

function reset(){
  clearTimeout(timer);
  screensaver.classList.add('hidden');

  timer=setTimeout(()=>{
    screensaver.classList.remove('hidden');
  }, delay*60000);
}

['mousemove','click','touchstart','keydown'].forEach(e=>{
  document.addEventListener(e,reset);
});

ssTime.oninput=()=>{
  delay=parseInt(ssTime.value)||2;
  reset();
};

reset();
