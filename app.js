 const express = require('express')
 const app = express()
// const port = process.env.PORT || 3000; 


var expressLayouts = require('express-ejs-layouts');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

/* 1005 session test */
const fs = require('fs');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const crypto = require('crypto');
const FileStore = require('session-file-store')(session); // 세션을 파일에 저장


//# 환경변수 관리 ( "dotenv"사용 : 어떤 os에서 개발하더라도 , 동일하게 환경변수를 등록하고 가져올 수 있게됨.)
const dotenv = require("dotenv");


const routers = require('./routes/route.js');
const { builtinModules } = require('module');

// # 환경변수 관리
dotenv.config(); //config(현재디렉토리의 .env파일을 자동으로 인식하여 환경변수 세팅)라는 메서드를 실행하면, dotenv라는 모듈이 자동적으로 .env에 등록돼있는 변수들을 node.js에서 접근할 수 있도록  "process.env.환경변수"에 등록을 시켜줌!!
// console.log("DB_HOST:", process.env.DB_HOST);
// console.log("DB_USER:", process.env.DB_USER);
// console.log("DB_PSWORD:", process.env.DB_PSWORD);
// console.log("SESSION_SECRET:", process.env.SESSION_SECRET);





/*1006 session test */
app.use(bodyParser.urlencoded({extended:false}));
// 세션 (미들웨어) 6
app.use(session({
    // secret: 'login1006', // 데이터를 암호화 하기 위해 필요한 옵션
    secret: process.env.SESSION_SECRET,
    resave: false, // 요청이 왔을때 세션을 수정하지 않더라도 다시 저장소에 저장되도록
    saveUninitialized: true, // 세션이 필요하면 세션을 실행시칸다(서버에 부담을 줄이기 위해)
    store : new FileStore(), // 세션이 데이터를 저장하는 곳
    proxy: true,
    // 이거 지워야 세션 잘 작동..
    // cookie: { 
    //   httpOnly: true,
    //   secure: true,
    //   maxAge: 1000 * 60 * 10,
    //   sameSite: "none",
    // }
}));

app.use(expressLayouts);//express-ejs-layout 사용
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(logger('dev'));
app.use('/', routers);//use : 미들웨어 등록





//app.use(cors()) // test를 하기위해서 세팅 "실제 서버에 배포할 땐 아이피를 설정해야 함"

//view(html파일들) 경로 설정"/views");

//화면 엔진을 ejs로 설정한다.
app.set('view engine', 'ejs');
//app.engine('html', require('ejs').renderFile); //html문서로 되어있는 ejs엔진

//express-ejs-layouts 설정
app.set('layout','layout'); //layout 이름으로 ejs파일 만듦.
app.set('layout extractScripts', true);

const mySub1=``

//css + img + js 경로(/public/css+img+js) 설정 
app.use(express.static(__dirname + '/public'));


//css + img 경로 설정
//app.use(express.static(path.join(__dirname,'public')));


module.exports = app;





