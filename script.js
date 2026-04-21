function updateClock(){
  const now=new Date();
  const time=now.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
  const date=now.toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric'});
  document.getElementById('time').textContent=time;
  document.getElementById('date').textContent=date;
  document.getElementById('timeSmall').textContent=time;
}
setInterval(updateClock,1000);
updateClock();

// reminders
const input=document.getElementById('reminderInput');
const list=document.getElementById('reminderList');
input.addEventListener('keypress',e=>{
 if(e.key==='Enter'){
   const li=document.createElement('li');
   li.textContent=input.value;
   list.appendChild(li);
   input.value='';
 }
});

// lock screen
const lock=document.getElementById('lockScreen');
const card=document.getElementById('clockCard');

function updateLock(){
 const now=new Date();
 document.getElementById('lockTime').textContent=
  now.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
 document.getElementById('lockDate').textContent=
  now.toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric'});
}
setInterval(updateLock,1000);
updateLock();

card.onclick=()=>lock.classList.remove('hidden');
lock.onclick=()=>lock.classList.add('hidden');
