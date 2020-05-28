import express from "express";
import expressLayouts from 'express-ejs-layouts';
import morgan from "morgan";                // logger
import helmet from "helmet";                // 보안 취약점 방지
import cookiePaser from "cookie-parser";    // cookie 를 다루기 위해 필요 
import bodyParser from "body-parser";       // body 로부터 데이터 접근 가능
import passport from "passport";
import mongoose from "mongoose";
import session from "express-session";
import path from "path";
import flash from "express-flash";
import MongoStore from "connect-mongo";
import ColorHash from 'color-hash';
import cors from 'cors';
import { localsMiddleware } from './middlewares';
import routes from "./routes";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import chatRouter from './routers/chatRouter';
import postsRouter from './routers/postsRouter';
import videoRouter from "./routers/videoRouter";
import apiRouter from "./routers/apiRouter";
import globalVar from "./public/static/globalVar.json";

import "./passport";  // passport 설정 파일(User 모델 생성 -> passport 선언 -> passport-local 기본설정)

global.commonVal = globalVar;   // global 변수 선언

const app = express(); // express를 실행해서 변수 참조
const MongoCookieStore = MongoStore(session);
const sessionMiddleware = session({
  secret: process.env.COOKIE_SECRET,  // 서버에서 session ID 암호화 저장시 사용
  resave: true,                       // 요청하는 동안 세션을 항상 강제 저장 여부
  saveUninitialized: false,           // 초기화하지 않고 스토어에 세션 저장 여부
  store: new MongoCookieStore({       // 데이터 저장 형식
    mongooseConnection: mongoose.connection   // init.js > db.js > mongoose.connect(connectionOptions);
  })
});

app.use(helmet());                                  // application 보안
app.set('view engine', 'ejs');                      // 템플릿 설정
app.set('views', path.join(__dirname, 'views'));    // view 경로

// express-ejs-layouts setting
app.set('layout', 'layouts/main');      // default layout
app.set('layout extractScripts', true);
app.use(expressLayouts);

app.use(cors({
  origin:[`${global.commonVal.LOC_URL}:${global.commonVal.LOC_PORT}`],
  methods:['GET','POST','PUT', 'DELETE'],
  credentials: true 
}));

app.use('/public', express.static(__dirname + '/public', {}));
app.use('/images', express.static(__dirname + '/public/images', {}));
app.use('/assets', express.static(__dirname + '/public/assets', {}));
app.use('/gif', express.static(__dirname + '/public/images/gif', {}));

app.use(cookiePaser());
app.use(bodyParser.json());                         // 데이터 전송시 서버가 json 인 것을 알도록
app.use(bodyParser.urlencoded({ extended: true })); // request 정보에서 form이나 json 형태의 body를 검사
app.use(morgan("dev"));
app.use(sessionMiddleware);
app.use(flash()); // 내부적으로 session을 사용하기 때문에 session 아래에 미들웨어 사용

app.use(passport.initialize()); // passport 초기화
app.use(passport.session());    // 로그인을 지속시키기 위해 세션 사용

app.use((req, res, next) => {
  if (!req.session.color) {
    const colorHash = new ColorHash();
    req.session.color = colorHash.hex(req.sessionID);
  }
  next();
});

app.use(localsMiddleware);
app.use(routes.home, globalRouter);
app.use(routes.chatting, chatRouter);
app.use(routes.users, userRouter);
app.use(routes.posts, postsRouter);
app.use(routes.videos, videoRouter);
app.use(routes.api, apiRouter);

export {app, sessionMiddleware};