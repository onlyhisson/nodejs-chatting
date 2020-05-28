import mongoose from "mongoose";
import Room from "../models/Room";
import Chat from "../models/Chat";
import moment from "moment";
import { errorHandler } from "../public/js/common";
import { saveImageLocal, deleteFileLocal } from './../public/js/common';

const IMG_INFO = { path: '/images/gif', elName: 'gif' };
const LAYOUT = 'layouts/chat';

export const chatting = async (req, res) => {
  try {
    const rooms = await Room.find({});
    res.render("chat/index", {
      pageTitle: "Chatting",
      subTitle: "sub title",
      rooms,
      moment,
      layout: LAYOUT,
    });
  } catch (error) {
    errorHandler(req, res, error);
  }
};

export const getRoom = async (req, res) => {
  res.render('chat/room', { 
    pageTitle: "Chatting",
    subTitle: "sub title",
  });
};

export const addRoom = async (req, res) => {
  try {
    const room = new Room({
      title: req.body.title,
      max: req.body.max,
      name: req.user.name,
      color: req.session.color,
      password: req.body.password,
    });

    const newRoom = await room.save();  // 입력된 채팅방 DB 저장
    const io = req.app.get('io');       

    // /room 네임스페이스의 모든 클라이언트에게 데이터 전송
    io.of('/room').emit('newRoom', newRoom);  

    res.redirect(`/chatting/room/${newRoom._id}?password=${req.body.password}`);
  } catch (error) {
    console.error(error);
    errorHandler(req, res, error);
  }
};

export const joinRoom = async (req, res) => {
  try {
    if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw {msg: 'Invalid id param'};
    }
    const room = await Room.findOne({ _id: req.params.id });

    const io = req.app.get('io');
    if (!room) {
      req.flash('error', '존재하지 않는 방입니다.');
      return res.redirect('/chatting');
    }
    if (room.password && room.password !== req.query.password) {
      req.flash('error', '비밀번호가 틀렸습니다.');
      return res.redirect('/chatting');
    }
    
    const { rooms } = io.of('/chat').adapter;

    if (rooms && rooms[req.params.id] && room.max <= rooms[req.params.id].length) {
      req.flash('error', '허용 인원이 초과하였습니다.');
      return res.redirect('/chatting');
    }
    const chats = await Chat.find({ room: room._id }).sort('createdAt');
    return res.render('chat/chat', {
      room,
      chats,
      subTitle: "Chatting",
      pageTitle: room.title,
      color: req.session.color,
      name: req.user.name,
      email: req.user.email,
      layout: 'layouts/chat-chat',
    });
  } catch (error) {
    errorHandler(req, res, error);
  }
};

export const writeChat = async (req, res) => {
  try {
    const chat = new Chat({
      room: req.params.id,
      name: req.user.name,
      email: req.user.email,
      color: req.session.color,
      chat: req.body.chat,
    });
    await chat.save();
    req.app.get('io').of('/chat').to(req.params.id).emit('chat', chat);
    res.send('ok');
  } catch (error) {
    errorHandler(req, res, error);
  }
};

export const deleteRoom = async (roomId) => {
  try {
    await Room.deleteOne({ _id: roomId });
    await Chat.deleteMany({ room: roomId });
    return true;
    
  } catch (error) {
    console.log(error);
    throw(error);
  }
};

/*
export const deleteRoom = async (req, res) => {
  try {
    await Room.deleteOne({ _id: req.params.id });
    await Chat.deleteOne({ room: req.params.id });
    res.send('ok');
    setTimeout(() => {
      req.app.get('io').of('/room').emit('removeRoom', req.params.id);
    }, 500);
  } catch (error) {
    errorHandler(req, res, error);
  }
};
*/

export const writeGif = async (req, res) => {
//router.post('/room/:id/gif', upload.single('gif'), async (req, res, next) => {
  try {
    const result = await saveImageLocal(req, res, IMG_INFO);
    const chat = new Chat({
      room: req.params.id,
      name: req.user.name,
      color: req.session.color,
      email: req.user.email,
      gif: req.file.filename,
    });
    await chat.save();
    req.app.get('io').of('/chat').to(req.params.id).emit('chat', chat);
    res.send('ok');
  } catch (error) {
    errorHandler(req, res, error);
  }
};

//#################################################################################
// API
//#################################################################################

export const getRooms = async (req, res) => {

  try {
    const rooms = await Room.find({});
    res.json({
      status:'success',
      rooms,
      moment,
    });
  } catch (error) {
    console.log(error);
    res.json({
      status:'failed',
    });
  }
};

export const typingChat = async (req, res) => {
  try {
    const chat = req.body.chat;
    const data = {
      email: req.user.email,
      name: req.user.name,
      color: req.session.color,
    };
    if(chat == 'typing') {
      req.app.get('io').of('/chat').to(req.params.id).emit('typing', data);
    } else {
      req.app.get('io').of('/chat').to(req.params.id).emit('stop typing', data);
    }
    res.json({
      status:'success',
    });
  } catch (error) {
    console.log(error);
    res.json({
      status:'failed',
    });
  }
};
