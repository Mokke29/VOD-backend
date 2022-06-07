import 'dotenv/config';
import { createRoom } from './createRoom';
import { joinRoom } from './joinRoom';
import { deleteRoom } from './deleteRoom';
import { chat } from './chat';

interface Room {
  name: string;
  id: string;
  messages: Message[];
  token: string;
  isPublic: boolean;
  usersIn: string[];
  code: string;
}
interface Message {
  date: Date;
  id: string;
  message: string;
  user: string;
}
interface Msg {
  user: string;
  message: string;
  id: string;
  roomid: string;
}

export let rooms: Room[] = [];
let canCreate: boolean = true;
let msgs: Msg[] = [];

export function socketFunction(io: any) {
  io.on('connection', (socket: any) => {
    //Create new room and join room
    createRoom(io, socket, (id: string, username: string, code: string) => {
      joinRoom(io, socket, id, username, code, true);
    });
    //JOIN ROOM
    socket.on('joinRoom', (arg: { id: string; username: string }) => {
      joinRoom(io, socket, arg.id, arg.username, '', false);
    });
    //DELETE ROOM
    deleteRoom(io, socket);
    //CLIENT REQUEST TO GET ROOMS
    socket.on('requestRooms', (arg: any) => {
      socket.emit('fetchRooms', rooms);
    });
    socket.on('requestRooms', (arg: any) => {
      socket.emit('fetchRooms', rooms);
    });

    //Messages inside chat room
    chat(io, socket);
    socket.on('disconnect', () => {
      rooms.filter((room, index) => {
        room.usersIn.filter((user, i) => {
          if (user === socket.id) {
            room.usersIn.splice(i, 1);
            if (room.usersIn.length <= 0) {
              rooms.splice(index, 1);
              io.sockets.emit('fetchRooms', rooms);
            }
          }
        });
      });
    });
  });
}
