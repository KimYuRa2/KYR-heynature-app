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
const { title } = require("process");
const { isReadable } = require("stream");
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


router.use(expressLayouts);


/********************** route, routing ***********************/


/************** 메인 *****************/

/* 메인 */
router.get('/',(req, res) =>{
    res.render('main',{userId : req.session.userId});
 });





/***************** 상품 *****************/
// (관리자용)상품전체목록
router.get('/admin_prod', (req,res) => {
    db.connection.query('select * from product',(err,rows) =>{
        if (err) {
            console.error("err : " + err);
        } else {
            res.render('admin_prod',{title : "관리자용 상품전체목록", rows:rows, userId : req.session.userId })
        }
    })
});

// (관리자용) 상품수정
router.get('/prod_update', (req, res) => {
    let prodnum = req.query.prodnum;
    db.connection.query(`select * from product where prodnum=?`,[prodnum], (err,row) => {
        console.log(row);
        if(err) {
            console.error("err : ", err);
        }else{
            res.render('prod_update', {row:row[0]} );
        }
    })
});

// (관리자용) 상품 수정 post
router.post('/prod_update', upload.single("imgFile"), function(req, res, next){
    console.log("s3 이미지 경로 : " , req.file.location);
    const name = req.body.name;
    const engname = req.body.engname;
    const kind = req.body.kind;
    const price1 = req.body.price1;
    const price2 = req.body.price2;
    const content = req.body.content;
    const image = req.file.location; // image 경로 만들기
    const stock = req.body.stock;
    const useyn = req.body.useyn;
    const prodnum = req.body.prodnum;
    const datas = [name, engname, kind, price1, price2, content, image,stock, useyn];

    
    db.connection.query(`update product set name=?,engname=?,kind=?,price1=?,price2=?,content=?,image=?,stock=?,useyn=? where prodnum=${prodnum}`,datas,(err,rows)=>{
        if (err) {
            console.error("err : " + err);
          } else {
            console.log("rows: " + JSON.stringify(rows));
            res.redirect("/admin_prod");
          }
    })

})


/* 장바구니 삭제 */
router.get('/delete_cart', (req, res) => {
    let cartnum = req.query.cartnum;


    /* db에서 상품 정보 완전히삭제 */
    db.connection.query(`delete from cart where cartnum=${cartnum}`,
    (err, result) => {
        if(err) throw err;
        res.redirect('/cart');
    })
})









// 상품페이지 (/product)
router.get('/product',(req, res, next) =>{
    
    //1017 상품 업로드 후 상품 뿌리기 테스트!!
 
    db.connection.query('select * from product',(err,rows) =>{
        if (err) {
            console.error("err : " + err);
        } else {
            res.render('product',{title : "상품 뿌리기 테스트", rows:rows, userId : req.session.userId })
        }
    })
});

// upload : 상품 이미지 업로드
router.post('/upload', upload.single("imgFile"), function(req, res, next){
    console.log("s3 이미지 경로 : " , req.file.location);
    const name = req.body.name;
    const engname = req.body.engname;
    const kind = req.body.kind;
    const price1 = req.body.price1;
    const price2 = req.body.price2;
    const content = req.body.content;
    const image = req.file.location; // image 경로 만들기
    const stock = req.body.stock;
    const useyn = req.body.useyn;
    const datas = [name, engname, kind, price1, price2, content, image,stock, useyn];

    db.connection.query('insert into product(name,engname, kind, price1, price2, content, image, stock, useyn) values(?,?,?,?,?,?,?,?,?)',datas,(err,rows)=>{
        if (err) {
            console.error("err : " + err);
          } else {
            console.log("rows: " + JSON.stringify(rows));
            res.redirect("/product");
          }
    })

})
  
/* 상품 업로드 페이지 */
router.get('/upload', function(req, res, next) {
    let imgFile = req.file;
    res.render('upload');
});


/* 상품 삭제 */
router.get('/deleteProduct', (req, res) => {
    let prodnum = req.query.prodnum;

    /** 1) s3에 등록된 이미지 먼저 삭제 */
    db.connection.query(`select image from product where prodnum=${prodnum}`,
    (err, result) => {
        const deletetest=result[0].image.slice(-17);// 이미지 key 추출!!!
        console.log("slice 테스트 : ", deletetest); 
        if(err) throw err;
        s3.deleteObject({
            Bucket: 'heynature',
            Key: deletetest, // 버켓 내 경로
          }, (err, data) => {
            if (err) { throw err; }
            console.log('s3 deleteObject ', data)
        })
    })  

    /* 2) db에서 상품 정보 완전히삭제 */
    db.connection.query(`delete from product where prodnum=${prodnum}`,
    (err, result) => {
        if(err) throw err;
        res.redirect('/product');
    })
})


/* 상품 검색 1023 */
router.get('/search',(req, res) => {
    try {
        let result_value = req.query.result;
    
        let sql = "SELECT * FROM product where name like ? or engname like ?";
        db.connection.query(sql, ["%" + result_value +"%", "%" + result_value +"%"], (err, result) => {
          if (err) {
            console.log(err);
          }else {
            console.log("ttttttttt",result);
            searchtitle=result_value; // 검색타이틀(뭐라고 검색했는지)
            // result = result_value;
            console.log("result테스트 : ",result);
            res.render("search", { searchtitle:searchtitle , result_value: result });
          }
        });
      } catch (err) {
        console.log(err);
      }

})

// detail 페이지 (상품디테일. + 리뷰페이지)
router.get('/detail',(req, res,next) =>{

    let prodnum = req.query.prodnum; //상품 index번호
    console.log("prodnum : ", prodnum);

    var sql1 = `select * from product where prodnum=${prodnum};`; // 해당 상품번호의 상품정보 가져옴
    sql1= mysql.format(sql1,prodnum);

    var sql2 = 'select * from review_detail ORDER BY id DESC;'; // 상품 리뷰 가져옴 (최근 작성한게 가장 위에 오도록)
    
    db.connection.query(sql1 + sql2,(err,rows,field)=>{
        
        var sql1_result = rows[0];	//sql1 의 결과값
        var sql2_result = rows[1];	//sql2 의 결과값
        // console.log("1)) sql1_result : ",sql1_result);
        // console.log("2)) sql2_result : ",sql2_result);

        if (err) {
            console.error("err : " + err);
        } else {
            res.render('detail', { sql1_result : sql1_result[0], sql2_result : sql2_result, userId : req.session.userId });
        }
    })
});





/******************* 공지사항 ****************************/

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





/******************* 리뷰 ***************************/

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
            res.write("<script>alert('success')</script>");
            // res.write("<script>window.location=\"/detail?prodnum=<%=row.prodnum%>\"</script>");
            // res.redirect('/detail');
            res.write("<script>window.location=\"/product\"</script>");
        })
    // }
});

router.get('/deletedetail',(req,res)=>{
    let id = req.query.id;
    db.deletedetailById(id, ()=>{
        // res.redirect('/detail');
        res.write("<script>alert('delete success')</script>");
        res.write("<script>window.location=\"/product\"</script>");
    });
});





/************************** 회원가입 / 로그인 / 로그아웃 **********************************/

/* 로그인 - 1006 */
router.get('/login',(req, res) =>{
    console.log('로그인 페이지 &&');
    console.log(req.session);

    /////////// 1025 /////////////
    // var prodnum = req.body.prodnum; // 현재 상품번호
    // var quantity = req.body.quantity; //갯수
    var userIdx;

    // 로그인 여부 체크
    if(req.session.is_logined) { //1) 로그인 되어있으면 (order테이블에 있는 주문목록 데이터 띄우기)
        console.log("로그인됨. 마이페이지-주문목록으로 이동!");
        // 로그인 아이디의 idx 조회
        db.connection.query('select * from users where userId=?', [req.session.userId], (err,result)=>{
            if( result.length > 0 ){
                userIdx = result[0].idx; // userIdx : 현재 로그인 된 user의 idx

                var sql_t = `select * from orders 
                    INNER JOIN product
                    ON orders.prodnum=product.prodnum
                    where idx=?;` ; // orders.prodnum=product.prodnum인 테이블끼리 합쳐진 결과를 검색. (+ idx="(값)"이어야함 !!)


                // 주문 테이블 뿌리기
                db.connection.query(sql_t, userIdx, function (error, results) {
                    if(!error) {
                        // console.log("results[0].price2 :",results[0].price2 );
                        // console.log("quantity :",results[0].quantity );
                        //results에서 quantity,price2 가져오기
                        // totalPrice[prodnum] = results[0].price2 * results[0].quantity;
                        return res.render("index",{
                            // prodnum에 해당하는 상품명(name), 가격(price2), 이미지(image)
                            results : results,
                            is_logined : req.session.is_logined,
                            userName : req.session.userName,
                            userId : req.session.userId,
                            userIdx : req.session.idx,
                        })
                    } else {
                        return res.status(500).json({
                            message: "에러"
                        });
                    }
                });   
            }
        });
    }else{ // 2) 로그인 안돼있으면, 로그인 페이지 그대로 띄움
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
            req.session.userName = data[0].userName;
            req.session.userId = data[0].userId ;
            req.session.userPassword = data[0].userPassword;
            //추가!1024
            req.session.userPhoneNum= data[0].userPhoneNum;
            req.session.userEmail= data[0].userEmail;
            req.session.userZonecode= data[0].userZonecode;
            req.session.userAddress= data[0].userAddress;
            req.session.userAddressSub= data[0].userAddressSub;

            req.session.save(function(){ // 세션 스토어에 적용하는 작업
                res.render('main',{ // 로그인 성공 시 main페이지로 + 정보전달
                    userName : data[0].userName,
                    userId : data[0].userId ,
                    userPhoneNum : data[0].userPhoneNum,
                    //추가!1024
                    userPhoneNum: data[0].userPhoneNum,
                    userEmail: data[0].userEmail,
                    userZonecode: data[0].userZonecode,
                    userAddress: data[0].userAddress,
                    userAddressSub: data[0].userAddressSub,

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
    const userEmail = req.body.userEmail;
    const userZonecode = req.body.userZonecode;
    const userAddress = req.body.userAddress;
    const userAddressSub = req.body.userAddressSub;


    db.connection.query('select * from users where userId=?',[userId],(err,data)=>{
        if( data.length == 0 ){ // 중복되는 userId가 없으면
            console.log("회원가입 성공");
            bcrypt.hash(userPassword, null, null, function(err, hash){     //bcrypt hash 명령문.
                var params = [userId, hash, userName, userPhoneNum, userEmail, userZonecode, userAddress, userAddressSub]; // userPassword에 암호화된 값(hash)을 넣기 위함
                db.connection.query('insert into users(userId, userPassword, userName, userPhoneNum, userEmail, userZonecode,userAddress, userAddressSub) values(?, ?, ?, ?, ?, ?, ?, ?)', params, function(err, rows){
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
            // console.log("회원가입 실패");
            // res.redirect('/join'); // 회원가입 실패 시 회원가입 페이지로 다시 이동.
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'}); //한글 설정
            res.write("<script language=\"javascript\">alert('회원가입 실패 : 이미 존재하는 ID입니다.')</script>");
            res.write("<script language=\"javascript\" charset=\'UTF-8\'>window.location=\"/join\"</script>"); // main 페이지로 이동
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



/************************ 장바구니 (cart) ******************************/

/* 장바구니 출력 - 1019 */
router.get('/cart',(req, res) =>{
    console.log("장바구니");

        var prodnum = req.body.prodnum; // 현재 상품번호
        var quantity = req.body.quantity; //갯수
        var userIdx;

        // 로그인 여부 체크
        if(req.session.is_logined) { //1) 로그인 되어있으면 (cart테이블에 있는 데이터 띄우기)

            // 로그인 아이디의 idx 조회
            db.connection.query('select * from users where userId=?',[req.session.userId],(err,result)=>{
                if( result.length > 0 ){
                    userIdx = result[0].idx; // userIdx : 현재 로그인 된 user의 idx

                    // var sql_1 = `select * from cart where idx=?`; // cart테이블에서, 현재 로그인 된 user의 idx로 상품들 찾기
                    var sql_t = `select * from cart 
                    INNER JOIN product
                    ON cart.prodnum=product.prodnum
                    where idx=?;` ; // //조인될 조건(on) : 카트에 담긴 상품번호 = 상품 테이블의 상품번호 => 로그인되어있는 아이디의 상품번호로 상품정보 가져오기.!!!


                    // 장바구니 테이블 뿌리기
                    db.connection.query(sql_t, [userIdx],  function (error, results) { // result => 로그인되어있는 아이디의 상품번호로 상품정보 가져왔음.
                        if(!error) {
                            console.log(results);
                            console.log("results[0].price2 :",results[0].price2 )
                            console.log("results[0].quantity : ", results[0].quantity);

                            console.log(results.length);
                            var totale = [];
                            for (var i = 0; i < results.length; i++) {
                                // console.log(results[i].price2 * results[i].quantity);
                                totale[i] = results[i].price2 * results[i].quantity;
                                results[i].totalPrice =totale[i];
                                // console.log("sdfasdf : ",results[i]);
                            }
                            console.log("resulteeeee: ",results);

                            // console.log(totale);

                            return res.render("cart",{
                                // prodnum에 해당하는 상품명(name), 가격(price2), 이미지(image)
                                results : results,
                                is_logined : req.session.is_logined,
                                userName : req.session.userName,
                                // totale : totale
                                // totalPrice : totalPrice
                            })
                        } else {
                            return res.status(500).json({
                                message: "에러"
                            });
                        }
                    });
                }
            });

            
        } else { // 2) 로그인 X. 비회원 장바구니 (쿠키에 저장)
            console.log('비로그인 상태!');
            ////////////////////////////////////////// 1025 비회원-장바구니-쿠키에서 cart정보 가져와서 출력하기////////////////////////////
            var cart = req.cookies.cart; // cart 쿠키를 가져옴
            if(!cart){ //쿠키 없을 시
                ////res.send("장바구니가 비어있습니다.");
                ////res.render('cart');
            }else{ //쿠키 있을 시
                var output='';
                for(var prodnum in cart) //객체를 읽는 for문
                //output에다가 추가
                //ex) order객체를 이용하여 음료이름과 cart의 주문갯수를 가져옴ee
                output = `<li>총 담은 상품수량,,,,${cart[prodnum]}개 담음</li>`;
            }
            //출력하기
            res.send(`
                <h1>Cart test!!!</h1>
                <ul>${output}</ul>
            `);

        }
        

});

/* 장바구니 저장 */
router.post('/cart',(req, res) =>{
    try {

        var prodnum = JSON.parse(req.body.prodnum); // 현재 상품번호
        var quantity = JSON.parse(req.body.quantity); //갯수
        var userIdx;

        // 로그인 여부 체크
        if(req.session.is_logined) { //1) 로그인 되어있으면 (cart테이블에 저장하기)

            // 로그인 아이디의 idx 조회
            db.connection.query('select * from users where userId=?',[req.session.userId],(err,result)=>{
                if( result.length > 0 ){
                    userIdx = result[0].idx;

                    var sql_1 = `INSERT INTO cart (idx, prodnum, quantity, indate) VALUES (${userIdx}, ${prodnum}, ${quantity}, NOW())`;
                    // 장바구니 테이블에 데이터 추가
                    db.connection.query(sql_1, function (error, result) {
                        if(!error) {
                            return res.status(200).json(result.affectedRows);
                        } else {
                            return res.status(500).json({
                                message: "에러"
                            });
                        }
                    });
                }
            });

            
        } else { // 2) 로그인 X. 비회원 장바구니 (쿠키에 저장)
            console.log('비로그인 상태!');

            if(req.cookies.cart){//이미 쿠키값이 있다면
                var cart = req.cookies.cart;
            } else{ //최초실행시(처음 쿠키 값은 없으므로)
                var cart = {}; // 아무것도 없는 객체를 cart에 넣음!
            }
                

            if(!cart[prodnum]){ //값이 없으면 초기화해줌
                cart[prodnum] = 0;   
            }

            // cart객체 안에 존재하는 prodnum(상품수)를 담은상품수량(req.body.quantity)만큼 증가시킴
            cart[prodnum] = parseInt(cart[prodnum]) + quantity; //상품수를 증가시킴 쿠키는 기본적으로 문자이므로 parseInt해야됨
            
            res.cookie('cart', cart); //res.cookie( name, value, [options] ) : cart객체를 쿠키에 전달

            return res.status(200).json(cart);
        }
        
    } catch (e) {
        console.log("에러 : " + e);
        return res.status(500).json({
            message: "에러"
          });
    }
});


/********************** 상품 주문 (order) ***************************/



// (관리자용)주문전체목록
router.get('/admin_order', (req,res) => {
    db.connection.query('select * from orders',(err,rows) =>{
        if (err) {
            console.error("err : " + err);
        } else {
            res.render('admin_order',{title : "상품 뿌리기 테스트", rows:rows, userId : req.session.userId })
        }
    })
})

/* 1026(비회원)주문 목록 확인 */
router.post('/guest_order', (req, res) => {
    // login페이지의 "guest login(조회)"버튼 클릭으로 => form('guest_login')에서 상품번호, 상품수 받아옴=>주문번호, 주문자명 받아옴
    // 주문번호orderNum, 주문자명userId으로 order테이블에서 상품정보 가져옴
    // 가져온 상품정보의 prodnum으로 product테이블 조회 => 상품의 image, prodname 가져오기

    const receiverName = req.body.receiverName;
    const ordernum = req.body.ordernum;

   // orders테이블에서 receiverName. ordernum으로 주문정보 찾기(1개 나옴)
    db.connection.query('select * from orders where receiverName = ? AND ordernum = ? ', [receiverName, ordernum], (err,data) => {
        if(err) return console.log(err);
        // var prodnum = data[0].prodnum;
        // console.log(" data[0].prodnum : ", data[0].prodnum);

        // 비회원 주문정보 확인
        if(data.length){
            
            var prodnum = data[0].prodnum;
            
            if( receiverName == data[0].receiverName && ordernum == data[0].ordernum ){
                console.log("비회원 주문정보 있음."); 

                var sql_tt=`select * from product where prodnum=?`;
                db.connection.query(sql_tt, [prodnum], (err,result) => {
                    var or_image = result[0].image;
                    var or_prodname = result[0].name;

                    res.render('guest_order',{ data : data[0], or_image : or_image, or_prodname : or_prodname });
                })
            }else{
                res.send(`
                    <h1>비회원 주문정보 없음. 주문 정보 틀림.</h1>
                    <a href="/login">Back</a>
                `);
            }
        }else{
            res.send(`
                <h1>비회원 주문정보 없음.</h1>
                <a href="/login">Back</a>
            `);
        }
   
    })
});




/* 1) 주문 화면 : 주문서 작성 */
router.post('/order', (req, res) => { 
    //detail페이지의 "바로구매하기"버튼 클릭으로 => form('forma')에서 상품번호, 상품수 받아옴
    var prodnum = JSON.parse(req.body.prodnum); //JSON.parse(): (텍스트)를 JavaScript 객체로 변환
    var quantity = JSON.parse(req.body.amount);
    

    var sql1 = `select * from product where prodnum=${prodnum};`;// 현재 상품번호에 해당하는 상품의 모든 정보를 얻어옴

    db.connection.query(sql1, function (error, result) {
        if(!error) {
            totalPrice = result[0].price2 * quantity; // 총금액
            totalPrice2 = result[0].price2 * quantity + 2500; // 총금액 + 배송비
            console.log("result[0] : ", result[0]); // 
            console.log('totalprice : ', totalPrice);
            return res.render("order", { 
                userId : req.session.userId ,
                userName : req.session.userName ,
                userPhoneNum : req.session.userPhoneNum,
                userEmail : req.session.userEmail,
                userAddress : req.session.userAddress,
                result : result[0], 
                totalPrice : totalPrice,
                totalPrice2 : totalPrice2,
                quantity : quantity,
                numberWithCommas : function (x) {
                    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                },
            });
        } else {
            return res.status(500).json({
                message: "에러"
            });
        }
    });
});

router.get('/ordernum',(req,res) => {
    res.render('ordernum');
})



/* 2) 주문내역 저장(결제) : 테이블에 저장(비회원의 경우 회원정보 관련은 제외하고 저장함) */
router.post('/order/complete', (req, res) => {
    try {
        var userName = JSON.stringify(req.body.userName); //req.body.userName 를 문자열로 변환 => 서버로 데이터를 보내기 위함
        var phoneNum = JSON.stringify(req.body.userPhoneNum);
        var userEmail = JSON.stringify(req.body.userEmail);

        var receiverName = JSON.stringify(req.body.receiverName);
        var receiverZonecode = JSON.stringify(req.body.receiverZonecode);
        var receiverAddress = JSON.stringify(req.body.receiverAddress);
        var receiverAddressSub = JSON.stringify(req.body.receiverAddressSub);
        var receiverPhoneNum = JSON.stringify(req.body.receiverCellPhone);
        var orderMemo = JSON.stringify(req.body.orderMemo);

        var prodnum = JSON.parse(req.body.prodnum);
        var quantity = JSON.parse(req.body.quantity);
        var totalprice = JSON.parse(req.body.totalSettlePrice);

        // 로그인 여부 체크
        if(req.session.is_logined) { // 1) 로그인 되어있으면 : order테이블에 주문내역 저장 

            // 로그인 아이디의 idx 조회
            db.connection.query('select * from users where userId=?',[req.session.userId],(err,result)=>{
                if( result.length > 0 ){
                    var idx = result[0].idx;
                    var userId = result[0].userId;

                    var sql_1 = `INSERT INTO orders (idx, userId, userPhoneNum, prodnum, indate, quantity, totalprice, receiverName, receiverZonecode, receiverAddress, receiverAddressSub, receiverPhoneNum, orderMemo) VALUES (${idx}, ${userId}, ${phoneNum}, ${prodnum}, NOW(), ${quantity}, ${totalprice}, ${receiverName}, ${receiverZonecode}, ${receiverAddress}, ${receiverAddressSub}, ${receiverPhoneNum}, ${orderMemo})`;
                    // 주문내역 테이블에 데이터 추가
                    db.connection.query(sql_1, function (error, result) {
                        if(!error) {
                            return res.status(200).json({message:"saf", status:200});
                        } else {
                            console.log(error);
                            return res.status(500).json({
                                message: "에러"
                            });
                        }
                    });
                }
            });

        // 비회원
        } else { // 2) 비회원이면 : order테이블에 (idx/userId(user정보)) 제외하고 주문내역 저장
            var sql_1 = `INSERT INTO orders (userPhoneNum, prodnum, indate, quantity, totalprice, receiverName, receiverZonecode, receiverAddress, receiverAddressSub, receiverPhoneNum, orderMemo) VALUES (${phoneNum}, ${prodnum}, NOW(), ${quantity}, ${totalprice}, ${receiverName}, ${receiverZonecode}, ${receiverAddress}, ${receiverAddressSub}, ${receiverPhoneNum}, ${orderMemo})`;
            
            // 주문내역 테이블에 회원정보를 제외하고 데이터 추가
            db.connection.query(sql_1, function (error, result) {
                if(!error) {
                    // res.render('ordernum',{result:result});
                    

                    //1027test....
                    // var testorder=result[0];
                    console.log("제발바라밥랍ㄹ: ", result.insertId);
                    var testorder=result.insertId;
                    // db.connection.query('select * from orders where ordernum=?',[req.session.userId],(err,result)=>{
                    // if( result.length > 0 ){
                    //     var idx = result[0].idx;
                    //     var userId = result[0].userId;
    
                    //     var sql_1 = `INSERT INTO orders (idx, userId, userPhoneNum, prodnum, indate, quantity, totalprice, receiverName, receiverZonecode, receiverAddress, receiverAddressSub, receiverPhoneNum, orderMemo) VALUES (${idx}, ${userId}, ${phoneNum}, ${prodnum}, NOW(), ${quantity}, ${totalprice}, ${receiverName}, ${receiverZonecode}, ${receiverAddress}, ${receiverAddressSub}, ${receiverPhoneNum}, ${orderMemo})`;
                    //     // 주문내역 테이블에 데이터 추가
                    //     db.connection.query(sql_1, function (error, result) {
                    //         if(!error) {
                    //             return res.status(200).json({message:"saf", status:200});
                    //         } else {
                    //             console.log(error);
                    //             return res.status(500).json({
                    //                 message: "에러"
                    //             });
                    //         }
                    //     });
                    // }







                    /////
                    return res.status(200).json({ message:"아으으으악", status:200 , testorder:testorder}); //생성된 row 수
                } else {
                    console.log(error);
                    return res.status(500).json({
                        message: "에러"
                    });
                }
            });
        }
        
    } catch (e) {
        console.log("에러 : " + e);
        return res.status(500).json({
            message: "에러"
          });
    }
});





/*************** 기타 ****************/

router.get('/event',(req, res) =>{
    res.render('event')
});
router.get('/find',(req, res) =>{
    res.render('find')
});
router.get('/intro',(req, res) =>{
    res.render('intro')
});




module.exports = router
//내보내기