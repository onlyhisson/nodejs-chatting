import mongoose from "mongoose";
import dotenv from "dotenv";    // OS 마다 환경 변수를 설정하는 방법이 다르기 때문에 사용

dotenv.config();

if(process.env.NODE_ENV == 'development') {
  // 몽구수 쿼리 내용 로그 확인
  process.env.MONGO_DEBUG_YN == 'Y' ? 
    mongoose.set('debug', true) : mongoose.set('debug', false);  
}

// Error: DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes insted
mongoose.set('useCreateIndex', true);

// 몽고디비 몽구스 연결
mongoose.connect(
  process.env.PRODUCTION ? process.env.MONGO_URL_PROD : process.env.MONGO_URL,
  {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  }
);

const db = mongoose.connection;

const handleOpen = () => console.log("✅  Connected to DB");
const handleError = error => console.log(`❌ Error on DB Connection:${error}`);
const handleDisconnected = () => {
  console.log(`disconnected DB Connection, try a DB Connection`);
  connect();
}

// 몽구스 커넥션 이벤트 리스너
db.once("open", handleOpen);
db.on("error", handleError);
db.on("disconnected", handleDisconnected);
