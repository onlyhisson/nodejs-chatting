import passport from "passport";
import routes from "../routes";
import User from "../models/User";
import { saveImageLocal, deleteFileLocal } from './../public/js/common';

/* 상세 보기 페이지 이동 */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("videos");
    res.render("user/profile", { pageTitle: "User", subTitle: "Profile", user });
  } catch (error) {
    res.redirect(routes.home);
  }
};

/* 특정 사용자 상세 보기 X */
export const userDetail = async (req, res) => {
  const { params: { id } } = req;
  try {
    const user = await User.findById(id).populate("videos");
    res.render("user/userDetail", { pageTitle: "User Detail", user });
  } catch (error) {
    req.flash("error", "User not found"); // session에서 데이터 삽입
    res.redirect(routes.home);
  }
};

/* 프로필 페이지 이동 */
export const getEditProfile = (req, res) => {
  res.render("user/editProfile", { pageTitle: "User", subTitle:"Edit Profile" });
}

/* 사용자 프로필 정보 수정 */
export const postEditProfile = async (req, res) => {
  // const { body: { name, email }, file } = req;
  try {
    const imgInfo = {
      path: '/images/profile',
      elName: 'avatar'
    };
    const result = await saveImageLocal(req, res, imgInfo);
    const { body: { name, email }, file } = req;
    let imgUrl = req.user.avatarUrl;

    if(result.status == 'ERROR') throw {data: result.data}  // 에러 처리
    if(file) {  // 프로필 사진 변경시
      if(req.user.avatarUrl) {
        const oldFile = (req.user.avatarUrl).replace(result.data.savePath, '');
        await deleteFileLocal(file.destination + oldFile)    // 이전 파일 삭제
      }
      imgUrl = `${result.data.savePath}/${result.data.fileName}`;
    }
    await User.findByIdAndUpdate(req.user.id, {
      name,
      email,
      avatarUrl: imgUrl
      //avatarUrl: result.status == "SUCCESS" ? imgUrl : req.user.avatarUrl
    });
    req.flash("success", "Profile updated");    // session에서 데이터 삽입
    res.redirect(`${routes.users}${routes.profile}`);
  } catch (error) {
    console.log(error);
    req.flash("error", "Can't update profile"); // session에서 데이터 삽입
    res.redirect(routes.users + routes.editProfile);
  }
};

/* 비밀번호 변경 페이지 이동 */
export const getChangePassword = (req, res) => {
  res.render("user/changePassword", { pageTitle: "User", subTitle: "Change Password" });
}

/* 비밀번호 변경 */
export const postChangePassword = async (req, res) => {
  const {
    body: { oldPassword, newPassword, newPassword1 }
  } = req;
  try {
    if (newPassword !== newPassword1) {
      req.flash("error", "Passwords don't match");  // session에서 데이터 삽입
      res.status(400);
      res.redirect(`/users/${routes.profile}`);
      return;
    }
    await req.user.changePassword(oldPassword, newPassword);
    res.redirect(`${routes.users}${routes.profile}`);
  } catch (error) {
    req.flash("error", "Can't change password");  // session에서 데이터 삽입
    res.status(400);
    res.redirect(`/users/${routes.changePassword}`);
  }
};

/* 구현 X */
export const githubLogin = passport.authenticate("github", {
  successFlash: "Welcome",
  failureFlash: "Can't log in at this time"
});

/* 구현 X */
export const githubLoginCallback = async (_, __, profile, cb) => {
  const {
    _json: { id, avatar_url: avatarUrl, name, email }
  } = profile;
  try {
    const user = await User.findOne({ email });
    if (user) {
      user.githubId = id;
      user.save();
      return cb(null, user);
    }
    const newUser = await User.create({
      email,
      name,
      githubId: id,
      avatarUrl
    });
    return cb(null, newUser);
  } catch (error) {
    return cb(error);
  }
};

/* 구현 X */
export const postGithubLogIn = (req, res) => {
  res.redirect(routes.home);
};

/* 구현 X */
export const facebookLogin = passport.authenticate("facebook", {
  successFlash: "Welcome",
  failureFlash: "Can't log in at this time"
});

/* 구현 X */
export const facebookLoginCallback = async (_, __, profile, cb) => {
  const {
    _json: { id, name, email }
  } = profile;
  try {
    const user = await User.findOne({ email });
    if (user) {
      user.facebookId = id;
      user.avatarUrl = `https://graph.facebook.com/${id}/picture?type=large`;
      user.save();
      return cb(null, user);
    }
    const newUser = await User.create({
      email,
      name,
      facebookId: id,
      avatarUrl: `https://graph.facebook.com/${id}/picture?type=large`
    });
    return cb(null, newUser);
  } catch (error) {
    return cb(error);
  }
};

/* 구현 X */
export const postFacebookLogin = (req, res) => {
  res.redirect(routes.home);
};