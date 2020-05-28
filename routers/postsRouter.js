import express from "express";
import routes from "../routes";
import {
  getWritePost,
  postWritePost,
  postDetail,
  editPost,
  deletePost
} from "../controllers/postsController";
import { onlyPrivate, uploadAvatar } from "../middlewares";

const postsRouter = express.Router();

// Write Post
postsRouter.get(routes.writePost, onlyPrivate, getWritePost);
postsRouter.post(routes.writePost, onlyPrivate, postWritePost);

// Detail Post
postsRouter.get(routes.postDetail(), onlyPrivate, postDetail);

// Edit Post
postsRouter.post(routes.editPost, onlyPrivate, editPost);

// Delete Post
postsRouter.get(routes.deletePost(), onlyPrivate, deletePost)

export default postsRouter;

