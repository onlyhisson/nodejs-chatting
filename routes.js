/*
import { writeChat } from './controllers/chatController';
    1 URL Naming을 하나의 파일에서 관리하므로 URL 중복 이슈를 사전에 방지.
    2 URL 을 정확히 알 필요가 없다. /home 이 아니라 routes.home 이렇게 사용
    3 server만이 아니라 view 단에서도 routes path 값을 같이 공유할 수 있다.
*/

// Global
const HOME = "/";
const DASHBOARD = "/dashboard"
const JOIN = "/join";
const LOGIN = "/login";
const LOGOUT = "/logout";
const SEARCH = "/search";

// Users
const USERS = "/users";
const USER_DETAIL = "/:id";
const EDIT_PROFILE = "/profile/edit-profile";
const CHANGE_PASSWORD = "/profile/change-password";
const PROFILE = "/profile";

// Chatting
const CHATTING = "/chatting";
const ROOM = "/room";
const ROOMS = "/rooms";
const JOIN_ROOM = "/room/:id";
const WRITE_CHAT = "/room/:id/chat";
const WRITE_GIF = "/room/:id/gif";
const TYPING = "/room/:id/typing";

// Posts
const POSTS = "/posts";
const POST_DETAIL = "/:id";
const WRITE_POST = "/writePost";
const EDIT_POST = "/edit-post";

// Videos
const VIDEO = "/video";
const VIDEOS = "/videos";
const UPLOAD = "/upload";
const VIDEO_DETAIL = "/:id";
const EDIT_VIDEO = "/:id/edit";
const DELETE_VIDEO = "/:id/delete";

// Github
const GITHUB = "/auth/github";
const GITHUB_CALLBACK = "/auth/github/callback";

// Facebook
const FB = "/auth/facebook";
const FB_CALLBACK = "/auth/facebook/callback";

// API
const API = "/api";
const REGISTER_VIEW = "/:id/view";
const ADD_COMMENT = "/:id/comment";

const routes = {
  home: HOME,
  dashboard: DASHBOARD,
  join: JOIN,
  login: LOGIN,
  logout: LOGOUT,
  search: SEARCH,
  users: USERS,
  userDetail: id => {
    if (id) {
      return `/users/${id}`;
    } else {
      return USER_DETAIL;
    }
  },
  editProfile: EDIT_PROFILE,
  changePassword: CHANGE_PASSWORD,
  chatting: CHATTING,
  room: ROOM,
  mngRoom: id => {
    if (id) {
      return `/chatting/room/${id}`;
    } else {
      return JOIN_ROOM;
    }
  },
  writeChat: id => {
    if (id) {
      return `/chatting/room/${id}/chat`;
    } else {
      return WRITE_CHAT;
    }
  },
  writeGif: id => {
    if (id) {
      return `/chatting/room/${id}/gif`;
    } else {
      return WRITE_GIF;
    }
  },
  typingChat: id => {
    if (id) {
      return `/chatting/room/${id}/typing`;
    } else {
      return TYPING;
    }
  },
  posts: POSTS,
  postDetail: id => {
    if (id) {
      return `/posts/${id}`;
    } else {
      return POST_DETAIL;
    }
  },
  writePost: WRITE_POST,
  editPost: EDIT_POST,
  deletePost: id => {
    if (id) {
      return `/posts/${id}/delete`;
    } else {
      return DELETE_VIDEO;
    }
  },
  video: VIDEO,
  videos: VIDEOS,
  upload: UPLOAD,
  videoDetail: id => {
    if (id) {
      return `/videos/${id}`;
    } else {
      return VIDEO_DETAIL;
    }
  },
  editVideo: id => {
    if (id) {
      return `/videos/${id}/edit`;
    } else {
      return EDIT_VIDEO;
    }
  },
  deleteVideo: id => {
    if (id) {
      return `/videos/${id}/delete`;
    } else {
      return DELETE_VIDEO;
    }
  },
  gitHub: GITHUB,
  githubCallback: GITHUB_CALLBACK,
  profile: PROFILE,
  facebook: FB,
  facebookCallback: FB_CALLBACK,
  api: API,
  rooms: ROOMS,
  registerView: REGISTER_VIEW,
  addComment: ADD_COMMENT
};


export default routes;
