import express from "express";
import passport from "passport";
import routes from "../routes";
import { 
  home,
  dashboard,
  getJoin,
  getLogin,
  logout,
  postJoin,
  postLogin,
} from "../controllers/commonController";
import { 
  chatting,
} from "../controllers/chatController";
import { 
  posts,
} from "../controllers/postsController";
import { 
    video, 
    search 
} from "../controllers/videoController";
import {
  githubLogin,
  postGithubLogIn,
  facebookLogin,
  postFacebookLogin
} from "../controllers/userController";
import { onlyPublic, onlyPrivate } from "../middlewares";

const globalRouter = express.Router();

globalRouter.get(routes.home, home);
globalRouter.get(routes.dashboard, onlyPrivate, dashboard);
globalRouter.get(routes.chatting, onlyPrivate, chatting);
globalRouter.get(routes.posts, onlyPrivate, posts);

globalRouter.get(routes.join, onlyPublic, getJoin);
globalRouter.post(routes.join, onlyPublic, postJoin, postLogin);
globalRouter.get(routes.login, onlyPublic, getLogin);
globalRouter.post(routes.login, onlyPublic, postLogin);
globalRouter.get(routes.logout, onlyPrivate, logout);

globalRouter.get(routes.gitHub, githubLogin);
globalRouter.get(
  routes.githubCallback,
  passport.authenticate("github", { failureRedirect: "/login" }),
  postGithubLogIn
);

globalRouter.get(routes.facebook, facebookLogin);
globalRouter.get(
  routes.facebookCallback,
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  postFacebookLogin
);

globalRouter.get(routes.video, video);
globalRouter.get(routes.search, search);

export default globalRouter;
