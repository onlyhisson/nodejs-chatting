Start Node JS
=============


Version Info
-------------
*CentOS Linux release 7.7.1908 (Core)*

*Node JS  v12.12.0*

*Mongo    v4.0.16*

*Pm2      v3.5.1*


### 소스복사
$ cd 상위경로

직접 복사

or 

cd 상위경로

$ git clone https://github.com/onlyhisson/start-nodejs-mongo.git


### 환경 설정 파일 
$ cd 상위경로/start-nodejs-mongo

$ vi .env

아래의 내용으로 편집 

```
# Global
NODE_ENV="development"
COOKIE_SECRET="CookieSecret"
PORT="3100"

# MongoDB Config Setting
MONGO_URL="mongodb://호스트명:포트번호/DB명"
```

### Node Module install
$ npm install

### 프로그램 실행
$ npm run-script start

or

$ pm2 start --interpreter babel-node init.js --name startNode


### 브라우저 
http://아이피:3100


## 소스 설명
![Alt text](/public/images/project/src_tree.png)

