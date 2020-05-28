import "@babel/polyfill";
import dotenv from "dotenv";
import "./db";
import { app, sessionMiddleware } from "./app";
import {webSocket} from "./socket";

dotenv.config();  // .env 파일에서 변수를 load

import "./models/Video";
import "./models/Comment";
import "./models/Posts";
import "./models/User";
import "./models/Room";
import "./models/Chat";

const PORT = process.env.PORT || 3100;

const handleListening = () =>
  console.log(`✅  Listening on: http://localhost:${PORT}`);

const server = app.listen(PORT, handleListening);
webSocket(server, app, sessionMiddleware);