import fs from 'fs';
import multer from 'multer';

/* 이미지 업로드 */
export const saveImageLocal = (req, res, imgInfo) => {

    const ROOT_PATH = __dirname.split('/js')[0];
    const EXTS = ['jpg', 'gif', 'png', 'jpeg', 'pdf'];    // 이미지 확장자 검증
    const FILE_SIZE = 3145728;  // 3M
	const MULTAR_ERROR = {      // multar 에러 코드 
		'LIMIT_PART_COUNT': 'Too many parts',
		'LIMIT_FILE_SIZE': '해당 파일의 크기가 큽니다(3Mb 이하)',
		'LIMIT_FILE_COUNT': '파일의 개수가 많습니다.',
		'LIMIT_FIELD_KEY': '필드명이 너무 깁니다.',
		'LIMIT_FIELD_VALUE': '필드값이 너무 깁니다.',
		'LIMIT_FIELD_COUNT': '필드가 너무 많습니다.',
		'LIMIT_UNEXPECTED_FILE': '예기치 않은 필드입니다.'
    };
    //const IMG_INFO = { path: '/images/post', elName: 'postImage' };
    const savePath = imgInfo.path || '/images';
    const sigleValue = imgInfo.elName || 'uploadImage';

    let fileName = '';
    let file_ext = '';
    let errorInfo = {}

    return new Promise(function(resolve, reject){

        let storage = multer.diskStorage({
            destination: function (req, file, callback) {   // cb 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
                callback(null, ROOT_PATH + savePath);
            },
            filename: function (req, file, callback) {      // cb 콜백함수를 통해 전송된 파일 이름 설정

                file_ext = getFileExtName(file.originalname);
                fileName = new Date().valueOf() + file_ext;

                // 이미지 파일 외에는 파일저장하기 전에 return
                if(!EXTS.includes(file_ext.substring(1).toLowerCase())){
                    errorInfo.name =    'LocalError';
                    errorInfo.msg =     '업로드 파일 형식 에러';
                    errorInfo.code =    'INVALID_FILE_EXT';
                    reject({
                        status: 'ERROR',
                        data: errorInfo
                    });
                }else{
                    callback(null, fileName);
                }
            }
        });

        let upload = multer({ 
            storage: storage,
            limits: {
                fileSize: Number(FILE_SIZE)	// 3M
            } 
        }).single(sigleValue);

        upload(req, res, function (err) {
            if(err) {
                console.log(err);
                errorInfo.name = err.name				// MulterError
                errorInfo.msg = MULTAR_ERROR[err.code]	// File too large
                errorInfo.code = err.message			// LIMIT_FILE_SIZE
                resolve({
                    status: 'ERROR',
                    data: errorInfo
                });
            } else {
                if(fileName)
                    console.log(`${fileName} is uploaded`)
                resolve({
                    status: 'SUCCESS',
                    data: {
                        fileName,
                        savePath
                    }
                    //fileName: req.file.originalname
                });
            }
        });
    });
};

/* 파일 삭제 (for LOCAL) */
export const deleteFileLocal = (fileFullName) => {
	return new Promise(function(resolve, reject){
		fs.unlink(fileFullName, function(err){
			if(err) {   // 삭제할 파일이 존재하지 않아도 resolve 처리
				console.log(err)
				resolve({status: 'ERROR'})
			} else {
				console.log('the file deleted in local server')
				resolve({status: 'SUCCESS'})
			}
		});
	})
};

/* 에러 핸들러 */
export const errorHandler = (req, res, err) => {
    errMsgLogForm(req, res, err);
    res.render("error", { 
        pageTitle: "Error", 
        code: res.statusCode,
        layout: 'layouts/main-public' 
    });
}

/* 에러 로그 FORM */
const errMsgLogForm = (req, res, err) => {
    console.log("======================= [ ERROR start ] =======================")
    console.log(` * URL   : ${req.url}`)
    console.log(` * CODE  : ${res.statusCode}`)
    console.log(` * ERROR : ${err}`)
    if(err.msg)
        console.log(` * MSG   : ${err.msg}`)
    console.log("======================= [ ERROR end   ] =======================")
};

/* 파일 확장자 추출 */
export const getFileExtName = (fileName) => {
    const fileLen = fileName.length;
    const lastDot = fileName.lastIndexOf('.');
    const fileExt = fileName.substring(lastDot, fileLen).toLowerCase();
    return fileExt;
}