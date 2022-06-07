import 'dotenv/config';
import { rooms } from './socket';

export function joinRoom(
  io: any,
  socket: any,
  id: string,
  username: string,
  code: string,
  ifNewRoom: boolean
) {
  io.to(id).emit('joinMessage', { username: username });
  if (ifNewRoom) {
    io.to(socket.id).emit('navigateToRoomCreate', { id: id, code: code });
  } else {
    io.to(socket.id).emit('navigateToRoom', { id: id, code: code });
  }
  socket.join(id);
  addUser(socket, id);
}

export function addUser(socket: any, id: string) {
  let code: string | undefined = undefined;
  rooms.filter((room, i) => {
    if (room.id === id) {
      code = room.code;
      room.usersIn.push(socket.id);
    }
  });
}
