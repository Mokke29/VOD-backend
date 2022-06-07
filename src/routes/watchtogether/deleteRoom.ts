import 'dotenv/config';
import { rooms } from './socket';

export function deleteRoom(io: any, socket: any) {
  socket.on('deleteRoom', (arg: any) => {
    let index = 10;
    let id = '';
    rooms.filter((room, ind) => {
      if (room.id === arg) {
        index = ind;
        id = room.id;
      }
    });
    if (index > -1) {
      rooms.splice(index, 1);
    }
    io.to(id).emit('backToLobby');
    io.sockets.emit('fetchRooms', rooms);
  });
}
