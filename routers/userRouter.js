import express from "express";
import routes from "../routes";
import {
  getProfile,
  userDetail,
  getEditProfile,
  getChangePassword,
  postEditProfile,
  postChangePassword
} from "../controllers/userController";
import { onlyPrivate, uploadAvatar, saveImageLocal } from "../middlewares";
//import { saveImageLocal } from './../public/js/common';

const userRouter = express.Router();

userRouter.get(routes.profile, onlyPrivate, getProfile);
userRouter.get(routes.editProfile, onlyPrivate, getEditProfile);
userRouter.post(routes.editProfile, onlyPrivate, postEditProfile);
//userRouter.post(routes.editProfile, onlyPrivate, uploadAvatar, postEditProfile);

userRouter.get(routes.changePassword, onlyPrivate, getChangePassword);
userRouter.post(routes.changePassword, onlyPrivate, postChangePassword);
userRouter.get(routes.userDetail(), userDetail);

export default userRouter;
