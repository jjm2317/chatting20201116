let chatLog = [];
let memberList = [];
let socket = io() ;
const $chatLog = document.querySelector('.chat-log');
const $memberList = document.querySelector('.member-list');
console.log($chatLog);
const render = () => {
  $chatLog.innerHTML = chatLog.map(log =>
     `<li class="chat-log-item">${log.name} : ${log.message}</li>`
     ).join('');
}
const addLog = data => {
  chatLog = [...chatLog, data]
}
const memberRender = data =>{
  $memberList.innerHTML = data.map(member => ` <li class="member-item">${member}</li>`
  ).join('');
}

socket.on ('connect', async ()=>{
 const res = await fetch('http://localhost:3000/chatUser/1')
  let name = await res.json();
  name = name.nickname;
  if(!name) name = '익명';

  await socket.emit('newUser', name);
})

socket.on('update', data => {
  addLog(data);
  render();
  // console.log(`${data.name} : ${data.message}`)
})
socket.on('memberUpdate', data => {
  memberRender(data);
})
const send = () => {
  let message = document.getElementById('test').value;

  document.getElementById('test').value = ''

  socket.emit('message', {type: 'message', message: message});
}