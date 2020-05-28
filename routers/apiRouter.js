import express from "express";
import routes from "../routes";
import { getRooms } from "../controllers/chatController";
import {
  postRegisterView,
  postAddComment
} from "../controllers/videoController";
import { onlyPublic, onlyPrivate } from "../middlewares";

const apiRouter = express.Router();

apiRouter.get(routes.rooms, onlyPrivate, getRooms);
apiRouter.post(routes.registerView, postRegisterView);
apiRouter.post(routes.addComment, postAddComment);

export default apiRouter;
