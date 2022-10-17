//# 환경변수 관리 ( "dotenv"사용 : 어떤 os에서 개발하더라도 , 동일하게 환경변수를 등록하고 가져올 수 있게됨.)
const dotenv = require("dotenv");
// # 환경변수 관리
dotenv.config(); //config(현재디렉토리의 .env파일을 자동으로 인식하여 환경변수 세팅)라는 메서드를 실행하면, dotenv라는 모듈이 자동적으로 .env에 등록돼있는 변수들을 node.js에서 접근할 수 있도록  "process.env.환경변수"에 등록을 시켜줌!!


const express = require('express');
const router = express.Router(); 
// 20220513 express-ejs-layouts
var expressLayouts = require('express-ejs-layouts');
const {check, validationResult} = require('express-validator');

/* db.js 파일 연결 */
const db = require('../db');


/* test */
// console.log("accessKeyId:", process.env.accessKeyId);



/* 1006 session test*/
var cookieParser = require('cookie-parser');
/* 1005 session test */
const fs = require('fs');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const crypto = require('crypto');
const FileStore = require('session-file-store')(session); // 세션을 파일에 저장
var bcrypt = require('bcrypt-nodejs'); // 비밀번호 암호화    

/* 1013 - aws s3 */
const aws = require('aws-sdk');
const multerS3 = require("multer-s3");
const multer = require('multer');
// const path = require('path'); //설치X
// const fs = require('fs'); // 설치 x

//sdk 로딩 방법 : aws.config.loadFromPath() 메서드를 호출할 때 매개변수로 AWS SDK 환경 설정 파일 경로를 전달하기
//1013 s3 설정 - https://myunji.tistory.com/403 
let s3 = new aws.S3({ //s3 객체 만들기
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey,
    region: process.env.region
});

let upload = multer({
  storage: multerS3({ // multer-s3 모듈 : 업로드된 파일을 S3에 바로 업로드할 수 있도록 도와줌
    s3: s3,
    bucket: "heynature", //파일을 업로드 할 S3 버킷 이름
    contentType: multerS3.AUTO_CONTENT_TYPE, // 자동을 콘텐츠 타입 세팅 (url 클릭 시 이미지 다운로드 안되게!)
    key: function (req, file, cb) { //Key : S3에 저장될 파일의 이름
      let extension = path.extname(file.originalname);
      cb(null, Date.now().toString() + extension)
    },
    acl: 'public-read-write', // 파일에 대한 접근 권한
  })
})


// /* s3 list test */


router.use(expressLayouts);

// upload : 상품 이미지 업로드하는 페이지
router.post('/upload', upload.single("imgFile"), function(req, res, next){
    let imgFile = req.file;
    console.log("s3 이미지 경로 : " , imgFile.location);
    res.json(imgFile);
})
  
router.get('/upload', function(req, res, next) {
    let imgFile = req.file;
    res.render('upload');
});

/* 이미지 보이는 페이지 테스트!! testtsetsetes */









//route, routing 
router.get('/',(req, res) =>{
   res.render('main');
});

/* notice */
router.get('/cscenter',(req, res,next) =>{
    db.getAllNotice((rows) => {
        res.render('cscenter',{ rows : rows , userId : req.session.userId });
    })
});

router.get('/newnotice', (req,res,next) => {
    res.render('newnotice');
})

router.post('/store',
 //[check('content').isLength({min:1, max:3000})],
 function(req,res,next){
    //let errs = validationResult(req);
    
    // if(errs['errors'].length > 0){ //에러가 있다면, 화면에 에러 출력하기
    //     res.render('newNotice',{errs : errs['errors']});
    // }else{ //에러 없으면 실행
        let param = JSON.parse(JSON.stringify(req.body));
        let content = param['content'];
        let title = param['title'];
        
        db.insertNotice(title,content, () => { //
            console.log("submit");
            res.redirect('/cscenter');
        })
    // }
});

// router.get('/layout', (req,res,next) => {
//     db.getAllNotice((rows) => {
//         res.render('layout',{ rows : rows }); 
//     })
// })

router.get('/updatenotice',(req,res)=>{
    let id = req.query.id;

    db.getNoticeById(id, (row)=>{
        if(typeof id === 'undefined' || row.length <= 0){
            res.status(404).json({error : 'undefined notice'});
        }else{
           res.render('updatenotice', {row: row[0]}); 
        }
    })
});

router.post('/updatenotice' , 
    [check('content').isLength({min:1, max:1000})],
    (req,res)=>{
        let errs = validationResult(req);
        let param = JSON.parse(JSON.stringify(req.body));
        let id = param['id'];
        let title = param['title'];
        let content = param['content'];

        if( errs['errors'].length > 0 ){ //에러가 있다면
            db.getNoticeById(id, (row)=>{
                res.render('updatenotice', {row: row[0], errs: errs['errors']} )
            });
        } else{ //에러가 없다면 notice 수정하기
            db.updateNoticeById(id, title, content, ()=> {
                res.redirect('/cscenter');
            });
        }
});

router.get('/deleteNotice',(req,res)=>{
    let id = req.query.id;
    db.deleteNoticeById(id, ()=>{
        res.redirect('/cscenter');
    });
});



/* review_write */
router.get('/detail',(req, res,next) =>{
    db.getAlldetail((rows) => {
        res.render('detail',{ rows : rows }); 
    })
});

router.get('/detail', (req,res,next) => {
    res.render('detail');
})

router.get('/review_write', (req,res,next) => {
    res.render('review_write');
})

router.post('/store2',
 [check('content').isLength({min:1, max:3000})],
 function(req,res,next){
    //let errs = validationResult(req);
    
    // if(errs['errors'].length > 0){ //에러가 있다면, 화면에 에러 출력하기
    //     res.render('newNotice',{errs : errs['errors']});
    // }else{ //에러 없으면 실행
        let param = JSON.parse(JSON.stringify(req.body));
        let content = param['content'];
        let username = param['username'];
        let starcount = param['starcount'];
        
        db.insertdetail(username,content, starcount, () => { //
            console.log("submit");
            res.redirect('/detail');
        })
    // }
});

router.get('/deletedetail',(req,res)=>{
    let id = req.query.id;
    db.deletedetailById(id, ()=>{
        res.redirect('/detail');
    });
});

/* 로그인 - 1006 */
router.get('/login',(req, res) =>{
    console.log('로그인 페이지');
    console.log(req.session);
    if(req.session.is_logined == true){ //로그인 돼있으면, index 페이지로 보냄
        res.render('index',{ 
            is_logined : req.session.is_logined,
            userName : req.session.userName,
            userId : req.session.userId
        });
    }else{ //로그인 안돼있으면, 로그인 페이지 그대로 띄움
        res.render('login',{ 
            is_logined : false
        });
    }
});

router.post('/login', (req, res, next) => {
    const userId = req.body.userId;
    const userPassword = req.body.userPassword;

    db.connection.query('select * from users where userId = ?', [userId], (err,data) => {
        // 로그인 확인
        console.log(data[0]); // 일치하는 userID로 찾은 DB에 저장된 user 정보
        console.log(userId); // 입력한 userId
        console.log(data[0].userId); // DB에 저장된 userID
        console.log(data[0].userPassword); // DB에 저장된 userPassword
        console.log(userId == data[0].userId); //userId 입력값 === db에 저장된 값
        console.log(bcrypt.compareSync( userPassword, data[0].userPassword )); //userPassword 입력값 === db에 저장된 값
        
        if( userId == data[0].userId && bcrypt.compareSync( userPassword, data[0].userPassword ) ){ 
            console.log('로그인 성공');
            // 세션에 추가
            req.session.is_logined = true;
            req.session.userName = data[0].userName; //
            req.session.userId = data[0].userId ;
            req.session.userPassword = data[0].userPassword;

            req.session.save(function(){ // 세션 스토어에 적용하는 작업
                res.render('main',{ // 로그인 성공 시 main페이지로 + 정보전달
                    userName : data[0].userName,
                    userId : data[0].userId ,
                    userPhoneNum : data[0].userPhoneNum,
                    is_logined : true
                });
            });
        }else{ // 로그인 실패 시 login페이지로 
            console.log('로그인 실패');
            res.send(`
                <h1>로그인에 실패하셨습니다.</h1>
                <a href="/login">Back</a>
            `);
        }
    })
})


/* 회원가입 - 1006 */
router.get('/join',(req, res) =>{
    console.log("회원가입 페이지");
    res.render('join');
});

router.post('/join', (req,res,next)=> { //회원가입 form 에서 제출을 누르게 되면 ajax통신(post)을 하게 되는데,  이는 router.post()로받는다. 
    console.log('회원가입 페이지');
    const userId = req.body.userId;
    const userPassword = req.body.userPassword;
    const userName = req.body.userName;
    const userPhoneNum = req.body.userPhoneNum;

    db.connection.query('select * from users where userId=?',[userId],(err,data)=>{
        if( data.length == 0 ){ // 중복되는 userId가 없으면
            console.log("회원가입 성공");
            bcrypt.hash(userPassword, null, null, function(err, hash){     //bcrypt hash 명령문.
                var params = [userId, hash, userName,userPhoneNum]; // userPassword에 암호화된 값(hash)을 넣기 위함
                db.connection.query('insert into users(userId, userPassword, userName, userPhoneNum) values(?, ?, ?, ?)', params, function(err, rows){
                    if(err){
                        console.log(err);
                        res.status(500).send("ERROR!");
                    }
                    console.log('success signup!');
                    console.log('hash');
                    res.redirect('/login'); // 회원가입 성공 시 로그인 페이지로 이동.
                });
            });
        }else{ // 중복되는 userId가 있으면
            console.log("회원가입 실패");
            res.redirect('/join'); // 회원가입 실패 시 회원가입 페이지로 다시 이동.
        }
    })
})

/* 로그아웃 - 1006 */
router.get('/logout',(req,res)=>{
    console.log('로그아웃 성공');
    
    req.session.destroy(function(err){
        // 세션 파괴후 할 것들
        // res.redirect('/');
        res.write("<script language=\"javascript\">alert('logout success!')</script>");
        res.write("<script language=\"javascript\">window.location=\"/\"</script>"); // main 페이지로 이동
    });

});



/*******************************/
router.get('/detail',(req, res) =>{
    res.render('detail')
});
router.get('/event',(req, res) =>{
    res.render('event')
});
router.get('/find',(req, res) =>{
    res.render('find')
});
router.get('/intro',(req, res) =>{
    res.render('intro')
});


router.get('/product',(req, res, next) =>{
    //res.render('product',{userId : req.session.userId});

    //1017 상품 업로드 후 상품 뿌리기 테스트!!
    db.connection.query('select * from product', (err,rows) => {
        if(err){
            console.log("query error!" + err);
            res.send("Internal Server Error!!");
        }else{
            res.render('product',{title : "상품 뿌리기 테스트", rows : rows, userId : req.session.userId});
        }
    });
});

module.exports = router
//내보내기