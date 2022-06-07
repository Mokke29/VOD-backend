import 'dotenv/config';
import { randomBytes } from 'crypto';
import { rooms } from './socket';

export function chat(io: any, socket: any) {
  socket.on('sendMessage', (arg: any) => {
    if (arg.message !== '') {
      let index = 10;
      rooms.filter((room, i) => {
        if (room.id === arg.id) {
          index = i;
        }
      });
      console.log('ROOM MESSAGE: ', rooms[index]);
      rooms[index].messages.push({
        message: arg.message,
        user: arg.user,
        id: randomBytes(4).toString('hex'),
        date: new Date(),
      });
      console.log('MESSAGE SEND: ', rooms[index].messages);
      io.to(arg.id).emit('newMessage', rooms[index].messages);
    }
  });
  socket.on('fetchMessage', (arg: any) => {
    let index = 10;
    let id = '';
    rooms.filter((room, i) => {
      if (room.id === arg.id) {
        index = i;
        id = room.id;
      }
    });
    console.log('MESSAGE FETCH: ', rooms[index].messages);
    io.to(id).emit('newMessage', rooms[index].messages);
  });
}
