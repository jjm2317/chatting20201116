let socket = io() ;
socket.on ('connect', ()=>{

  let name = prompt('반갑습니다!', '');
  if(!name) name = '익명';

  socket.emit('newUser', name);
})

socket.on('update', data => {
  console.log(`${data.name} : ${data.message}`)
})
const send = () => {
  let message = document.getElementById('test').value;

  document.getElementById('test').value = ''

  socket.emit('message', {type: 'message', message: message});
}