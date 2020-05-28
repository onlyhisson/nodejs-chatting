import express from "express";
import routes from "../routes";
import { 
    getRoom,
    addRoom,
    joinRoom,
    writeChat,
    //deleteRoom,
    writeGif,
    typingChat,
} from "../controllers/chatController";
import { onlyPublic, onlyPrivate } from "../middlewares";
import { saveImageLocal } from "../public/js/common";

const chatRouter = express.Router();

chatRouter.get(routes.room, onlyPrivate, getRoom);
chatRouter.post(routes.room, onlyPrivate, addRoom);
chatRouter.get(routes.mngRoom(), onlyPrivate, joinRoom);
chatRouter.post(routes.writeChat(), onlyPrivate, writeChat);
//chatRouter.delete(routes.mngRoom(), onlyPrivate1, deleteRoom);
chatRouter.post(routes.writeGif(), onlyPrivate, writeGif);
chatRouter.post(routes.typingChat(), onlyPrivate, typingChat);

export default chatRouter;
