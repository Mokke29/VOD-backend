import 'dotenv/config';
import { randomBytes } from 'crypto';
import { rooms } from './socket';

export function createRoom(io: any, socket: any, callback: Function) {
  socket.on(
    'createRoom',
    (arg: { name: string; token: string; isPublic: boolean }) => {
      let { currentRoomId } = findRoom(arg.token);
      if (!currentRoomId) {
        if (arg.isPublic) {
          rooms.push({
            name: arg.name,
            id: randomBytes(3).toString('hex'),
            token: arg.token,
            messages: [],
            isPublic: arg.isPublic,
            usersIn: [],
            code: '',
          });
        } else {
          rooms.push({
            name: arg.name,
            id: randomBytes(3).toString('hex'),
            token: arg.token,
            messages: [],
            isPublic: arg.isPublic,
            usersIn: [],
            code: randomBytes(6).toString('hex'),
          });
        }
      } else {
        console.log('Rooms ->', rooms);
      }
      let newRoom = findRoom(arg.token);
      io.sockets.emit('fetchRooms', rooms);
      callback(newRoom.currentRoomId, 'user', newRoom.code);
    }
  );
}

export function findRoom(token: string): {
  currentRoomId: string | undefined;
  code: string | undefined;
} {
  let id: string | undefined = undefined;
  let code: string | undefined = undefined;
  rooms.filter((room, i) => {
    if (room.token === token) {
      id = room.id;
      code = room.code;
    }
  });
  return { currentRoomId: id, code: code };
}

export function refreshExpDate(date: Date) {
  return new Date(date.getTime() + 2 * 60000);
}
