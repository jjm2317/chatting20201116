//서버 파일(app.js) 생성 후

//require : 모듈 불러오는 함수

//기본 내장 모듈 fs : 파일관련 처리
const fs = require('fs');

const express =require('express');

const socket = require('socket.io');

const http = require('http');

//express(): express 객체 생성
const app = express();

//기본 내장 모듈 http의 createServer메서드 : expree 객체인 app에 서버 생성 
const server = http.createServer(app)

//socket함수(서버객체) : 서버를 socket.io 에 바인딩
const io = socket(server) 


// 서버작업 없이 클라이언트에서 액세스하면 거부됨
// 아래 코드로  해당 폴더의 파일은 외부 클라이언트들이 접근가능
app.use('/css', express.static('./static/css'));
app.use('/js', express.static('./static/js'))




// get 방식으로 접속하면 콜백 호출
// response.send : 클라이언트로 서버가 데이터를 돌려준다
app.get('/', function(request, response) {
    //fs.readFile : 지정된 파일을 읽어서 데이터를 가져온다. 에러시 첫번 째 인수로, 아니면 데이터를 두번째 인수로 받아온다. 
    fs.readFile('./static/index.html', (err,data) => {
        if(err) {
           response.send('에러');
        }else{
            //응답 헤더에 내용 파일 정보 전달
            response.writeHead(200, {'Content-Type' : 'text/html'});
            // 데이터 전송
			response.write(data)
            //전송 완료: end() 필수 작성
 			response.end()
        }
    })
})

//socket.io 
//on() 첫번째 인수로 전달된 이벤트가 발생하면 콜백함수 실행됨
//io.sockets: 접속되는 모든 소켓

// io.sockets.on('connection', socket=>{
//     console.log('유저 접속됨')
//     socket.on('')
//     //send이벤트를 받을 경우 콜백 호출
//     socket.on('send', data => {
//         console.log('전달된 메시지:', data.msg);
//     })
//     // 접속 종료시 자동실행
//     socket.on('disconnect', () => {
//         console.log('접속 종료');
//     })
// })
// //server
server.listen(8000,function(){
    console.log('서버 실행중')
})


// io.sockets 모든 소켓에 해당
// 커넥션 이벤트가 발생하면 newUser(사용자 정의 이벤트)이벤트에 의해 새유저 알림이 뜸
// 그리고 해당 새 소켓의 name 프로퍼티에 name 인수 데이터가 저장
// 모든소켓에 대하여 접속 사실을 알린다.
let memberList = [];

io.sockets.on('connection', socket => {
	socket.on('newUser', (name)=>{
	console.log(name +'이 접속하였습니다.');
	socket.name = name;
  memberList = [...memberList, name];
  io.sockets.emit('memberUpdate', memberList);
	io.sockets.emit('update', {type: 'connect', name: 'SERVER', message: name+'님이 접속하였습니다.'})
	})
  
  // 메시지 이벤트
  // message(사용자 정의) 이벤트가 발생하면 
  socket.on('message', data => {
    data.name = socket.name
    console.log(data)
    io.sockets.emit('update', data);
  })
  
  socket.on('disconnect', () =>{
    console.log(socket.name + '님이 나가셨습니다.');
    memberList = memberList.filter(member => member !==socket.name);
    socket.broadcast.emit('update', {type: 'disconnect', name: 'SERVER', message: socket.name + '님이 나가셨습니다.'})
    socket.broadcast.emit('memberUpdate', memberList);
  })
})