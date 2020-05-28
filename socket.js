import SocketIO from 'socket.io';
import {deleteRoom} from './controllers/chatController'

const webSocket = (server, app, sessionMiddleware) => {

  // 서버 소켓 설정
  const io = SocketIO(server, { path: '/socket.io' }); // io => socket.io 패키지를 import 한 변수

  // name space set, /namespace 에 메시지 전달 가능
  const room = io.of('/room');
  const chat = io.of('/chat');

  app.set('io', io);  // 라우터, 여기서는 controller 에서 io 객체를 사용하도록 setting, req.app.get('io')로 접근 가능

  // Socket.io & express-session 연동 예시
  // Socket.io는 미들웨어 사용 가능, express-session 미들웨어 공유
  // socket => 커넥션 성공시, 커넥션 정보 변수
  // socket 객체는 req와 res 객체를 다 가지고 있다.
  io.use((socket, next) => {  // 미들웨어 장착, 웹소켓 연결 시마다 실행, 세션을 사용할 수 있다.
    sessionMiddleware(socket.request, socket.request.res, next);  // require('express-session')(option)(socket.request, socket.resquest.res, next);
  });

  room.on('connection', (socket) => {
    console.log('[Socket.IO] : room 네임스페이스에 접속');

    socket.on('disconnect', () => {
      console.log('[Socket.IO] : room 네임스페이스 접속 해제');
    });
  });

  chat.on('connection', (socket) => {
    console.log('[Socket.IO] : chat 네임스페이스에 접속');

    socket.to(roomId).emit('connection', {  // (데이터 보낼 대상).emit('이벤트명', data)
      
    });

    const req = socket.request;
    const { headers: { referer } } = req; // referer = http://domainName:Port/chatting/room/5ecb1cadbb73c13977cddbcd
    const roomId = referer.split('/')[referer.split('/').length - 1].replace(/\?.+/, '');

    socket.join(roomId);
    
    socket.to(roomId).emit('join', {  // (데이터 보낼 대상).emit('이벤트명', data)
      user: 'system',
      chat: `${req.session.color}님이 입장하셨습니다.`,
    });

    socket.on('disconnect', async () => {
      console.log('[Socket.IO] : chat 네임스페이스 접속 해제');

      socket.leave(roomId);

      const currentRoom = socket.adapter.rooms[roomId]; // 참여중인 소켓 정보 get
      const userCount = currentRoom ? currentRoom.length : 0;

      if (userCount === 0) {
        room.emit('removeRoom', roomId);
        const result = await deleteRoom(roomId);

        if(result) {
          console.log('[Socket.IO] : 방 제거 요청 Success');
        } else {
          console.log('[Socket.IO] : 방 제거 요청 Failed');
        }
      } else {
        socket.to(roomId).emit('exit', {
          user: 'system',
          chat: `${req.session.color}님이 퇴장하셨습니다.`,
        });
      }

    });

  });
};

export {webSocket};
