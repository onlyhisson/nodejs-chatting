import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";
import routes from "./routes";

const s3 = new aws.S3({
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_PRIVATE_KEY,
    region: "ap-northeast-1"
});

const multerVideo = multer({
    storage: multerS3({
        s3,
        acl: "public-read",
        bucket: "wetube/video"
    })
});
const multerAvatar = multer({
    storage: multerS3({
        s3,
        acl: "public-read",
        bucket: "wetube/avatar"
    })
});

export const uploadVideo = multerVideo.single("videoFile");
export const uploadAvatar = multerAvatar.single("avatar");

/* 데이터 전역 관리 */
export const localsMiddleware = (req, res, next) => {
    res.locals.siteName = "Node Chatting";
    res.locals.routes = routes;                 // 서버단과 프론트단에서 routes 정보를 locals에 저장 후 함께 사용한다.
    res.locals.loggedUser = req.user || null;   // 사용자 정보를 locals에 저장 후 프론트 단에서 사용한다.
    next();
}

export const onlyPublic = (req, res, next) => {
    if (req.user) {
        res.redirect(routes.dashboard);
    } else {
        next();
    }
};

export const onlyPrivate = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.redirect(routes.home);
    }
};

/*
export const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'uploads/');
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + new Date().valueOf() + ext);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
});
*/