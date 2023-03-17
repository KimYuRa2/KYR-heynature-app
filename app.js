const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())

//helmet
const helmet = require('helmet');
//
const nocache = require('nocache');

var expressLayouts = require('express-ejs-layouts');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

/* 1005 session test */
const fs = require('fs');
const mysql = require('mysql');
const bodyParser = require('body-parser'); //post방식 전송을 위해서 필요
const path = require('path');
const session = require('express-session'); //세션 사용을 위한 모듈 
const crypto = require('crypto');
const FileStore = require('session-file-store')(session); // 세션을 파일에 저장하기 위함


//# 환경변수 관리 ( "dotenv"사용 : 어떤 os에서 개발하더라도 , 동일하게 환경변수를 등록하고 가져올 수 있게됨.)
const dotenv = require("dotenv");

//X-Powered-By 헤더 제거
app.disable('x-powered-by');

const routers = require('./routes/route.js');
const { builtinModules } = require('module');

// # 환경변수 관리
dotenv.config(); //config(현재디렉토리의 .env파일을 자동으로 인식하여 환경변수 세팅)라는 메서드를 실행하면, dotenv라는 모듈이 자동적으로 .env에 등록돼있는 변수들을 node.js에서 접근할 수 있도록  "process.env.환경변수"에 등록을 시켜줌!!
// console.log("DB_HOST:", process.env.DB_HOST);
// console.log("DB_USER:", process.env.DB_USER);
// console.log("DB_PSWORD:", process.env.DB_PSWORD);
// console.log("SESSION_SECRET:", process.env.SESSION_SECRET);



/** 미들웨어 등록 **/
// application/json
// app.use( express.json() ); //요청(req) 본문을 json 형태로 파싱

// application/x-www-form-urlencoded방식의 Content-Type데이터를 받아줌. (jquery.ajax의 기본타입)
// application/x-www-form-urlencoded : html "form submit"에서 주로 사용하는 타입이며, 기본적인 Content-Type으로 불립니다
// x-www-form-urlencoded :내가 body에 보내는 데이터 타입이 "form" 방식이라는것을 명시하는것이다.
/*
    인코딩이 필요하기 때문에 크기가 큰 데이터는 해당 타입으로 보내기 적합하지 않습니다
    ?name=Binary+Yun&age=25
    따라서 해당 타입으로 요청을 보내면 url 뒤에 위와 같은 형태로 전송됩니다
*/
// x-www-form-urlencoded를 파싱.
app.use(bodyParser.urlencoded({extended:false})); //이렇게 하면 post에서 json 데이터를 받을 수 있다. 받을 때 req.body 형태로 받으면 된다.


/*1006 session test */
// 세션 (미들웨어) 6
app.use(session({
    secret: process.env.SESSION_SECRET, // 데이터를 암호화하기 위해 필요한 옵션
    resave: false, // 요청이 왔을때 세션을 수정하지 않더라도 다시 저장소에 저장되도록
    saveUninitialized: true, // 세션이 필요하면 세션을 실행시칸다(서버에 부담을 줄이기 위해)
    store : new FileStore(), // 세션이 데이터를 저장하는 곳 (파일에 저장)
    proxy: true
}));

app.use(expressLayouts);//express-ejs-layout 사용
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(logger('dev'));
app.use('/', routers);// route.js 가상경로 설정 

/* commenting helmet.noCache as it is deprecated, using `nocache` package instead */
// helmet.noCache()
app.use(nocache());
//

// helmet.contentSecurityPolicy 제외한 기본 10개 미들웨어 사용
app.use(helmet({
    contentSecurityPolicy: false // cross-site 허용
}));


//view(html파일들) 경로 설정"/views");

//화면 엔진을 ejs로 설정한다.
app.set('view engine', 'ejs');


//express-ejs-layouts 설정
app.set('layout','layout'); //layout 이름으로 ejs파일 만듦.
app.set('layout extractScripts', true);

const mySub1=``

// 기본path를 /public으로 설정 - css + img + js 경로(/public/css+img+js) 설정 
app.use(express.static(__dirname + '/public')); 


module.exports = app;





