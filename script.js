// NAVIGATION (click + swipe)
let currentPage=0;
const pages=document.querySelector('.pages');
const totalPages=document.querySelectorAll('.page').length;

function goToPage(i){
  currentPage=i;
  pages.style.transform=`translateX(-${i*100}%)`;
}

// sidebar click
document.querySelectorAll('.menu').forEach((btn,i)=>{
  btn.onclick=()=>{
    document.querySelectorAll('.menu').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    goToPage(i);
  }
});

// swipe
let startX=0;
document.addEventListener('touchstart',e=>startX=e.touches[0].clientX);
document.addEventListener('touchend',e=>{
  let dx=e.changedTouches[0].clientX-startX;
  if(dx>50 && currentPage>0) goToPage(currentPage-1);
  if(dx<-50 && currentPage<totalPages-1) goToPage(currentPage+1);
});

// CLOCK
function updateClock(){
  let n=new Date();
  let t=n.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
  let d=n.toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric'});

  time.textContent=t;
  date.textContent=d;
  timeSmall.textContent=t;
  lockTime.textContent=t;
  lockDate.textContent=d;
  screenTime.textContent=t;
}
setInterval(updateClock,1000);
updateClock();

// WEATHER + ANIMATION
navigator.geolocation.getCurrentPosition(pos=>{
  fetch(`https://api.open-meteo.com/v1/forecast?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&current_weather=true`)
  .then(r=>r.json())
  .then(data=>{
    let w=data.current_weather;
    weatherBig.textContent=`${w.temperature}°C`;

    // animated background
    if(w.temperature>20){
      weatherBg.style.background="linear-gradient(#87ceeb,#fff)";
    } else {
      weatherBg.style.background="linear-gradient(#4a6fa5,#222)";
    }
  });
});

// REMINDERS (fixed delete)
let reminders=JSON.parse(localStorage.getItem('r')||'[]');

function render(){
  reminderList.innerHTML='';
  reminders.forEach((r,i)=>{
    let li=document.createElement('li');
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

// LOCK SCREEN
clockCard.onclick=()=>lockScreen.classList.remove('hidden');
lockScreen.onclick=()=>lockScreen.classList.add('hidden');

// SCREENSAVER
let idleTimer;
let delay=2;

function resetIdle(){
  clearTimeout(idleTimer);
  screensaver.classList.add('hidden');

  idleTimer=setTimeout(()=>{
    screensaver.classList.remove('hidden');
  }, delay*60000);
}

['click','touchstart','mousemove'].forEach(e=>{
  document.addEventListener(e,resetIdle);
});

ssTime.oninput=()=>{
  delay=parseInt(ssTime.value)||2;
  resetIdle();
};

resetIdle();
