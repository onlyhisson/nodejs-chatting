import passport from "passport";
import GithubStrategy from "passport-github";
import FacebookStrategy from "passport-facebook";
import User from "./models/User"; // requires the model with Passport-Local Mongoose plugged in
import {
  githubLoginCallback,
  facebookLoginCallback
} from "./controllers/userController";
import routes from "./routes";

const PORT = process.env.PORT || 3002;

// use static authenticate method of model in LocalStrategy
// CHANGE: USE "createStrategy" INSTEAD OF "authenticate"
// username과 password를 사용해서 쿠키-세션으로 인증하는 strategy를 사용
// 아래 코드는 passport-local-mongoose를 사용함으로 기존 passport-local 코드를 줄인 형태
passport.use(User.createStrategy());  

/*
passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GH_ID,
      clientSecret: process.env.GH_SECRET,
      callbackURL: process.env.PRODUCTION
        ? `https://polar-sea-27980.herokuapp.com${routes.githubCallback}`
        : `http://localhost:${PORT}${routes.githubCallback}`
    },
    githubLoginCallback
  )
);
*/

/*
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FB_ID,
      clientSecret: process.env.FB_SECRET,
      callbackURL: `https://polar-sea-27980.herokuapp.com${
        routes.facebookCallback
      }`,
      profileFields: ["id", "displayName", "photos", "email"],
      scope: ["public_profile", "email"]
    },
    facebookLoginCallback
  )
);
*/

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
