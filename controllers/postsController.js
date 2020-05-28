import routes from "../routes";
import Posts from "../models/Posts";
import moment from "moment";
import { errorHandler } from "../public/js/common";
import { saveImageLocal, deleteFileLocal } from './../public/js/common';

const IMG_INFO = { path: '/images/post', elName: 'postImage' };

export const posts = async (req, res) => {
    try {
      const posts = await Posts.find({}).where('writerId').equals(req.user.id).sort({createdAt: -1});
      //const posts = await Posts.find({}).sort({ _id: -1 }); // 모든 게시물 조회

      res.render("posts/index", { 
        pageTitle: "Posts", 
        subTitle: "sub title",
        posts,
        moment
      });
    } catch (error) {
      errorHandler(req, res, error);
    }
};

/* 게시글 쓰기 페이지 이동 */
export const getWritePost = async (req, res) => {
  try {
    res.render("posts/writePost", { pageTitle: "Posts", subTitle: "write post" });
  } catch (error) {
    res.redirect(routes.posts);
  }
};

/* 게시글 쓰기 */
export const postWritePost = async (req, res) => {
  
  // const { body: { name, email }, file } = req;
  let imgUrl = '';

  try {
   
    const result = await saveImageLocal(req, res, IMG_INFO);
    const { body: { title, subTitle, postContent }, file } = req;

    if(result.status == 'ERROR') throw {data: result.data}  // 에러 처리

    if(result.data.fileName)
      imgUrl = result.data.savePath+'/'+result.data.fileName

    await Posts.create({
      writerId: req.user.id,
      title,
      subTitle,
      postContent,
      fileUrl: imgUrl
    });

    req.flash("success", "Added Post");    // session에서 데이터 삽입
    res.redirect(routes.posts);
  } catch (error) {
    console.log(error);
    req.flash("error", "Can't add Post"); // session에서 데이터 삽입
    res.redirect(routes.posts + routes.writePost);
  }
};

/* 게시글 상세 보기 */
export const postDetail = async (req, res) => {
  const { params: { id } } = req;
  try {
    const postOne = await Posts.findById(id);
    res.render("posts/postDetail", { 
      pageTitle: "Posts", 
      subTitle: "Post Detail", 
      postOne,
      moment
    });
  } catch (error) {
    req.flash("error", "Post not found"); // session에서 데이터 삽입
    res.redirect(routes.posts);
  }
};

/* 게시글 수정 */
export const editPost = async (req, res) => {

  try {
    const result = await saveImageLocal(req, res, IMG_INFO);
    const { body: { postId, title, subTitle, postContent }, file } = req;
    const postOne = await Posts.findById(postId); // 게시글 수정 전 파일 경로, 생성일자 get
    let imgUrl = postOne.fileUrl || '';

    if(result.status == 'ERROR') throw {data: result.data}  // 에러 처리

    if(imgUrl && file) {
      const oldFile = imgUrl.replace(result.data.savePath, '');
      await deleteFileLocal(file.destination + oldFile)    // 이전 파일 삭제
      imgUrl = `${result.data.savePath}/${result.data.fileName}`;
    } else if(!imgUrl && file) {  // 게시글 사진 변경시
      imgUrl = `${result.data.savePath}/${result.data.fileName}`;
    }
    await Posts.findByIdAndUpdate(postId, {
      title,
      subTitle,
      postContent,
      //createdAt: postOne.createdAt,
      modifiedAt: new Date(),
      fileUrl: imgUrl
    });

    req.flash("success", "Post updated");    // session에서 데이터 삽입
    res.redirect(`${routes.posts}`);
  } catch (error) {
    req.flash("error", "Can't update Post"); // session에서 데이터 삽입
    res.redirect(routes.posts);
  };

};

/* 게시글 삭제 */
export const deletePost = async (req, res) => {
  const {
    params: { id }
  } = req;
  try {
    const postOne = await Posts.findById(id);
    if (String(postOne.writerId) !== req.user.id) {
      throw {};
    } else {
      await Posts.findOneAndRemove({ _id: id });
    }

    if(postOne.fileUrl) {
      console.log(`${__dirname}/../public${postOne.fileUrl}`);
      await deleteFileLocal(`${__dirname}/../public${postOne.fileUrl}`);  // 해당 게시글 삭제
    }
  } catch (error) {
    console.log(error);
    req.flash("error", "Have No Authority"); 
  }
  res.redirect(routes.posts);
};

