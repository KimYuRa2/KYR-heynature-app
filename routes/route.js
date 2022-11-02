//# 환경변수 관리 ( "dotenv"사용 : 어떤 os에서 개발하더라도 , 동일하게 환경변수를 등록하고 가져올 수 있게됨.)
const dotenv = require("dotenv");
// # 환경변수 관리
dotenv.config(); //config(현재디렉토리의 .env파일을 자동으로 인식하여 환경변수 세팅)라는 메서드를 실행하면, dotenv라는 모듈이 자동적으로 .env에 등록돼있는 변수들을 node.js에서 접근할 수 있도록  "process.env.환경변수"에 등록을 시켜줌!!

const moment = require('moment'); // 날짜 포멧을 위한 모듈
const express = require('express');
const router = express.Router(); 
// 20220513 express-ejs-layouts
var expressLayouts = require('express-ejs-layouts');
const {check, validationResult} = require('express-validator');

/* db.js 파일 연결 */
// const db = require('../db');

/* 1006 session test*/
var cookieParser = require('cookie-parser');
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


// * db 연결
/* ura31 - heroku cleardb */
var connection = mysql.createPool({
    host :  process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PSWORD,
    port : '3306',
    database : process.env.DB_DATABASE,
    dateStrings:'date',
    multipleStatements : true // 다중쿼리 사용 설정 - 여러 쿼리를 ';'를 기준으로 한번에 보낼 수 있게한다.
});



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
    connection.query('select * from product',(err,rows) =>{
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
    connection.query(`select * from product where prodnum=?`,[prodnum], (err,row) => {
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
    // console.log("s3 이미지 경로 : " , req.file.location);

    if(req.file !== undefined){ // 이미지가 있으면 실행!!
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
        
        connection.query(`update product set name=?,engname=?,kind=?,price1=?,price2=?,content=?,image=?,stock=?,useyn=? where prodnum=${prodnum}`,datas,(err,rows)=>{
            if (err) {
                console.error("err : " + err);
            } else {
                console.log("rows: " + JSON.stringify(rows));
                res.redirect("/admin_prod");
            }
        })
    }else{  // 이미지 필요함!!
        console.log('이미지필요!!');
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'}); //한글 설정
        res.write("<script language=\"javascript\">alert('실패 : 상품이미지를 업로드하세요.')</script>");
        res.write("<script language=\"javascript\" charset=\'UTF-8\'>window.location=\"/upload\"</script>"); // main 페이지로 이동
    }
})






// 상품페이지 (/product)
router.get('/product',(req, res, next) =>{
    // * best상품  * //
    // orders db에서 구매 가장 많은 prodnum 순서로 정렬
    // 구매 많은 10개 상품전체정보 불러오기 console

    
    connection.query(' select * from product where useyn="y" ',(err,rows) =>{
        if (err) {
            console.error("err : " + err);
        } else {
            // best 상품 10개 불러오기 !!!! : select *,COUNT(*) from orders inner join product using (prodnum) group by prodnum order by count(*) desc limit 10;
            // + 재고 0인 상품은 빼고 보여주기.
            connection.query('select *,COUNT(*) from orders inner join product using (prodnum) where useyn="y" group by prodnum order by count(*) desc limit 10;',(err,results) => {
                // console.log(results);
                if(err){
                    console.error("err : " + err);
                }else{
                    res.render('product',{title : "상품 뿌리기 테스트", rows:rows, userId : req.session.userId, results:results })
                }
            })
        }
    })
});


// upload : 상품 이미지 업로드
router.post('/upload', upload.single("imgFile"), function(req, res, next){
    // console.log("s3 이미지 경로 : " , req.file.location);
    let imgFile = req.file;

    if(req.file !== undefined){ // 이미지가 있으면 실행!!
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
    
        connection.query('insert into product(name,engname, kind, price1, price2, content, image, stock, useyn) values(?,?,?,?,?,?,?,?,?)',datas,(err,rows)=>{
            if (err) {
                console.error("err : " + err);
            } else {
                console.log("rows: " + JSON.stringify(rows));
                res.redirect("/product");
            }
        })
    }else{  // 이미지 필요함!!
        console.log('이미지필요!!');
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'}); //한글 설정
        res.write("<script language=\"javascript\">alert('실패 : 상품이미지를 업로드하세요.')</script>");
        res.write("<script language=\"javascript\" charset=\'UTF-8\'>window.location=\"/upload\"</script>"); // main 페이지로 이동
    }
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
    connection.query(`select image from product where prodnum=${prodnum}`,
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
    connection.query(`delete from product where prodnum=${prodnum}`,
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
        connection.query(sql, ["%" + result_value +"%", "%" + result_value +"%"], (err, result) => {
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

    let prodnum = req.query.prodnum; //상품 index번호. 상품페이지에서 detail(query)?prodnum=<%=row.prodnum%> => prodnum의 매개변수인, prodnum이라는 값(<%=row.prodnum%>)을 가져온다.
    console.log("prodnum : ", prodnum);

    var sql1 = `select * from product where prodnum=${prodnum};`; // 해당 상품번호의 상품정보 가져옴
    sql1= mysql.format(sql1,prodnum);

    var sql2 = `select * from review_detail where prodnum=${prodnum} ORDER BY id DESC`; // 상품 리뷰 가져옴 (최근 작성한게 가장 위에 오도록)
    sql2 = mysql.format(sql2, prodnum);

    connection.query(sql1 + sql2,(err,rows,field)=>{
        
        var sql1_result = rows[0];	//sql1 의 결과값
        var sql2_result = rows[1];	//sql2 의 결과값
        // console.log("1)) sql1_result : ",sql1_result);
        // console.log("2)) sql2_result : ",sql2_result);

        if (err) {
            console.error("err : " + err);
        } else {
            res.render('detail', { sql1_result : sql1_result[0], sql2_result : sql2_result, userId : req.session.userId, is_logined : req.session.is_logined  });
        }
    })
});





/******************* 공지사항 ****************************/

/* notice */
router.get('/cscenter',(req, res,next) =>{
    getAllNotice((rows) => {
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
        
        insertNotice(title,content, () => { //
            console.log("submit");
            res.redirect('/cscenter');
        })
    // }
});

router.get('/updatenotice',(req,res)=>{
    let id = req.query.id;

    getNoticeById(id, (row)=>{
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
            getNoticeById(id, (row)=>{
                res.render('updatenotice', {row: row[0], errs: errs['errors']} )
            });
        } else{ //에러가 없다면 notice 수정하기
            updateNoticeById(id, title, content, ()=> {
                res.redirect('/cscenter');
            });
        }
});

router.get('/deleteNotice',(req,res)=>{
    let id = req.query.id;
    deleteNoticeById(id, ()=>{
        res.redirect('/cscenter');
    });
});





/******************* 리뷰 ***************************/

router.get('/review_write', (req,res,next) => {
    let r_imgFile = req.file;
    res.render('review_write');
})

//
// detail 페이지 (상품디테일. + 리뷰페이지)
// router.get('/detail',(req, res,next) =>{

//     let prodnum = req.query.prodnum; //상품 index번호
//     console.log("prodnum : ", prodnum);

//     var sql1 = `select * from product where prodnum=${prodnum};`; // 해당 상품번호의 상품정보 가져옴
//     sql1= mysql.format(sql1,prodnum);

//     var sql2 = 'select * from review_detail ORDER BY id DESC;'; // 상품 리뷰 가져옴 (최근 작성한게 가장 위에 오도록)
    
//     connection.query(sql1 + sql2,(err,rows,field)=>{
        
//         var sql1_result = rows[0];	//sql1 의 결과값
//         var sql2_result = rows[1];	//sql2 의 결과값

//         if (err) {
//             console.error("err : " + err);
//         } else {
//             res.render('detail', { sql1_result : sql1_result[0], sql2_result : sql2_result, userId : req.session.userId });
//         }
//     })
// });

// 리뷰 저장
router.post('/store2', upload.single("r_imgFile"), function(req,res,next){

    let param = JSON.parse(JSON.stringify(req.body)); // parse : JSON문자열의 구문을 분석하고, 그 결과에서 js값이나 객체를 생성. / / stringify : js값이나 객체를 JSON문자열로 변환
    let content = param['content'];
    let username = param['username'];
    let starcount = param['starcount'];
    let prodnum = param['prodnum'];

    if(req.file !== undefined){ // 이미지가 있으면 실행!!
        let r_imgFile = JSON.parse(JSON.stringify(req.file.location));
        
        insertdetail(username, content, starcount , r_imgFile, prodnum, () => { //
            console.log("submit");
            res.write("<script>alert('photo review success')</script>");
            res.write("<script>window.location=\"/product\"</script>");
        })
    }else{

        insertdetail_text(username, content, starcount , prodnum, () => { //
            console.log("submit");
            res.write("<script>alert('text review success')</script>");
            res.write("<script>window.location=\"/product\"</script>");
        })
    }
});

router.get('/deletedetail',(req,res)=>{
    let id = req.query.id;
    deletedetailById(id, ()=>{
        // res.redirect('/detail');
        res.write("<script>alert('delete success')</script>");
        res.write("<script>window.location=\"/product\"</script>");
    });
});





/************************** 1. 2. 회원가입 / 로그인 / 로그아웃 **********************************/

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
        connection.query('select * from users where userId=?', [req.session.userId], (err,result)=>{
            if( result.length > 0 ){
                userIdx = result[0].idx; // userIdx : 현재 로그인 된 user의 idx

                var sql_t = `select * from orders 
                    INNER JOIN product
                    ON orders.prodnum=product.prodnum
                    where idx=?;` ; // orders.prodnum=product.prodnum인 테이블끼리 합쳐진 결과를 검색. (+ idx="(값)"이어야함 !!)


                // 주문 테이블 뿌리기
                connection.query(sql_t, userIdx, function (error, results) {
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

    // 오류처리 수정완!!
    connection.query('select * from users where userId = ?', [userId], (err,row) => {
        if(err) console.log(err);
        //로그인 확인
        // console.log(data[0]); // 일치하는 userID로 찾은 DB에 저장된 user 정보
        // console.log(userId); // 입력한 userId
        // console.log(data[0].userId); // DB에 저장된 userID
        // console.log(data[0].userPassword); // DB에 저장된 userPassword
        // console.log(userId == data[0].userId); //userId 입력값 === db에 저장된 값
        // console.log(bcrypt.compareSync( userPassword, data[0].userPassword )); //userPassword 입력값 === db에 저장된 값

        if(row.length > 0){
            console.log(row[0]);
            console.log("얍");
            bcrypt.compare( userPassword, row[0].userPassword, (err, data) => {
                if(data){
                    //성공
                    console.log('로그인 성공');
                    // 세션에 추가
                    req.session.is_logined = true;
                    req.session.userName = row[0].userName;
                    req.session.userId = row[0].userId ;
                    req.session.userPassword = row[0].userPassword;
                    //추가!1024
                    req.session.userPhoneNum= row[0].userPhoneNum;
                    req.session.userEmail= row[0].userEmail;
                    req.session.userZonecode= row[0].userZonecode;
                    req.session.userAddress= row[0].userAddress;
                    req.session.userAddressSub= row[0].userAddressSub;

                    req.session.save(function(){ // 세션 스토어에 적용하는 작업
                        res.render('main',{ // 로그인 성공 시 main페이지로 + 정보전달
                            userName : row[0].userName,
                            userId : row[0].userId ,
                            userPhoneNum : row[0].userPhoneNum,
                            //추가!1024
                            userPhoneNum: row[0].userPhoneNum,
                            userEmail: row[0].userEmail,
                            userZonecode: row[0].userZonecode,
                            userAddress: row[0].userAddress,
                            userAddressSub: row[0].userAddressSub,
        
                            is_logined : true
                        });
                    });
                }else{ // 로그인 실패 시 login페이지로 
                    //실패
                    console.log('로그인 실패');
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'}); //한글 설정
                    res.write("<script language=\"javascript\">alert('로그인에 실패하셨습니다. 다시 시도해 주십시오.')</script>");
                    res.write("<script language=\"javascript\" charset=\'UTF-8\'>window.location=\"/login\"</script>"); // main 페이지로 이동
                }

            })
        }else{
            console.log("ID가 존재하지 않습니다.");
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'}); //한글 설정
            res.write("<script language=\"javascript\">alert('로그인에 실패하셨습니다. 다시 시도해 주십시오.')</script>");
            res.write("<script language=\"javascript\" charset=\'UTF-8\'>window.location=\"/login\"</script>"); // main 페이지로 이동
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


    connection.query('select * from users where userId=?',[userId],(err,data)=>{
        if( data.length == 0 ){ // 중복되는 userId가 없으면
            console.log("회원가입 성공");
            bcrypt.hash(userPassword, null, null, function(err, hash){     //bcrypt hash 명령문.
                var params = [userId, hash, userName, userPhoneNum, userEmail, userZonecode, userAddress, userAddressSub]; // userPassword에 암호화된 값(hash)을 넣기 위함
                connection.query('insert into users(userId, userPassword, userName, userPhoneNum, userEmail, userZonecode,userAddress, userAddressSub) values(?, ?, ?, ?, ?, ?, ?, ?)', params, function(err, rows){
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



/************************ 4. 장바구니 (cart) ******************************/

/* 장바구니 출력 - 1019 */
router.get('/cart',(req, res) =>{
    console.log("장바구니");

        var prodnum = req.body.prodnum; // 현재 상품번호
        var quantity = req.body.quantity; //갯수
        var userIdx;

        // 로그인 여부 체크
        if(req.session.is_logined) { //1) 로그인 되어있으면 (cart테이블에 있는 데이터 띄우기)

            // 로그인 아이디의 idx 조회
            connection.query('select * from users where userId=?',[req.session.userId],(err,result)=>{
                if( result.length > 0 ){
                    userIdx = result[0].idx; // userIdx : 현재 로그인 된 user의 idx

                    // var sql_1 = `select * from cart where idx=?`; // cart테이블에서, 현재 로그인 된 user의 idx로 상품들 찾기
                    var sql_t = `select * from cart 
                    INNER JOIN product
                    ON cart.prodnum=product.prodnum
                    where idx=?;` ; // //조인될 조건(on) : 카트에 담긴 상품번호 = 상품 테이블의 상품번호 => 로그인되어있는 아이디의 상품번호로 상품정보 가져오기.!!!


                    // 장바구니 테이블 뿌리기
                    connection.query(sql_t, [userIdx],  function (error, results) { // result => 로그인되어있는 아이디의 상품번호로 상품정보 가져왔음.
                        if(!error) {
                            console.log(results);
                            // console.log("results[0].price2 :",results[0].price2 )
                            // console.log("results[0].quantity : ", results[0].quantity);

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

            
        } else { // 2) 로그인 X. 비회원 장바구니 출력 (쿠키에 저장)
            console.log('비로그인 상태!');
            ////////////////////////////////////////// 1025 비회원-장바구니-쿠키에서 cart정보 가져와서 출력하기////////////////////////////
            var cart = req.cookies.cart; // cart 쿠키를 가져옴
            if(!cart){ //쿠키 없을 시
                res.render('cart',{
                    results : [],
                    is_logined:false,
                });
            }else{ //쿠키 있을 시
                // console.log("비회원 장바구니 쿠키 존재! : " , req.cookies.cart);

                // console.log("Object.keys(cart) : ",Object.keys(cart)); // 쿠키 키값 배열로 가져오기
                var sql_tt = `select * from product where prodnum in (?)`; // product테이블에서, prodnum(현재 상품번호)과 Object.keys(cart)(=쿠키 키값 배열로 가져온것들) 중 일치하는 row를 가져옴=> 쿠키에 들어있는 상품 전체 정보 가져옴
                connection.query(sql_tt, [Object.keys(cart)], (err,results) => {
                    console.log("select * from product where prodnum in ( Object.keys(cart) ) : ", results);  // 쿠키 key값으로 들어있는 상품 전체 정보 확인
                    var totale = [];
                    var qty;
                    for (var i = 0; i < results.length; i++) {
                        qty = cart[results[i].prodnum]; // 구매수량
                        // console.log("qty: ",qty);
                        // console.log("results[i].prodnum : ", results[i].prodnum);
                        totale[i] = results[i].price2 * qty; // 구매금액
                        results[i].totalPrice = totale[i]; // **구매금액(=상품총금액)** 항목 추가
                        results[i].quantity = qty;   // **구매수량** 항목 추가
                        // console.log("results[i].totalPrice : ", results[i].totalPrice);
                        // console.log("results[i].quantity : ", results[i].quantity);

                        // console.log("results[i] : ", results[i])
                    }
                    
                    return res.render("cart",{
                        results : results,
                        is_logined : false,
                    });
                    
                });
            }
           

        }
        

});

/* 장바구니 저장 */
router.post('/cart',(req, res) =>{
    try {

        var prodnum = JSON.parse(req.body.prodnum); // 현재 상품번호 / json.parse(JSON 문자열을 JavaScript 객체로 변환)
        var quantity = JSON.parse(req.body.quantity); //갯수
        var userIdx;

        // 로그인 여부 체크
        if(req.session.is_logined) { //1) 로그인 되어있으면 (cart테이블에 저장하기)

            // 로그인 아이디의 idx 조회
            connection.query('select * from users where userId=?',[req.session.userId],(err,result)=>{
                if( result.length > 0 ){
                    userIdx = result[0].idx;

                    var sql_1 = `INSERT INTO cart (idx, prodnum, quantity, indate) VALUES (${userIdx}, ${prodnum}, ${quantity}, NOW())`;
                    // 장바구니(cart) 테이블에 데이터 추가
                    connection.query(sql_1, function (error, result) {
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

            
        } else { // 2) 로그인 X. 비회원 장바구니 저장하기 (쿠키에 저장)
            console.log('비로그인 상태!');

            if(req.cookies.cart){//이미 쿠키값이 있다면
                var cart = req.cookies.cart;
            } else{ //최초실행시(처음 쿠키 값은 없으므로)
                var cart = {}; // 아무것도 없는 객체를 cart에 넣음!
            }
                

            if(!cart[prodnum]){ //값이 없으면 초기화해줌
                cart[prodnum] = 0;   
            }

            // cart객체 안에 존재하는 prodnum(상품수)를, 담은상품수량(req.body.quantity)만큼 증가시킴
            cart[prodnum] = parseInt(cart[prodnum]) + quantity; //상품수를 증가시킴 쿠키는 기본적으로 문자이므로 parseInt해야됨
            // console.log( "담은 prodnum(상품번호)(key) : ",prodnum,"이고, 총 ",cart[prodnum],"개가 담겨있음.")
            // 쿠키 생성
            res.cookie('cart', cart); //res.cookie( name, value, [options] ) : cart객체를 쿠키에 전달(option maxage설정X => 브라우저 종료 시 쿠키삭제)
            // console.log("카트에담음: ",cart);
            return res.status(200).json(cart);
        }
        
    } catch (e) {
        console.log("에러 : " + e);
        return res.status(500).json({
            message: "에러"
          });
    }
});


/* 장바구니 삭제 */
router.get('/delete_cart', (req, res) => {
    let cartnum = req.query.cartnum;
    let prodnum = req.query.prodnum; //비회원

    // 로그인 여부 체크
    if(req.session.is_logined) { //1) 로그인 되어있으면 cart테이블에서 지우기
        /* db에서 상품 정보 완전히삭제 */
        console.log("삭제 선택한 cartnum : ",cartnum)
        connection.query(`delete from cart where cartnum=${cartnum}`,
        (err, result) => {
            if(err) throw err;
            res.redirect('/cart');
        })
    }else{ // 2) 로그인 안되어있으면 쿠키에서 삭제
        
        // cart 쿠키를 가져옴
        // cart 쿠키 객체를 복사해서 cart2에 저장
        // cart2에서 상품번호가 prodnum인 상품을 삭제
        // 'cart'쿠키를 지우고 , 삭제된 cart2를 다시 'cart'라는 쿠키로 재생성함.
        // cart페이지로 리다이렉트
        var cart = req.cookies.cart; // cart 쿠키를 가져옴
        console.log("cart에서 상품번호가",prodnum,"인 상품을 삭제하기.");
        // console.log("cart : ", cart);
        var cart2=cart;
        // console.log("cart2!!! ; ", cart2);
        // console.log("cart2.prodnum",cart2.prodnum);
        delete cart2[prodnum];
        res.clearCookie('cart');

        res.cookie('cart', cart2);

        console.log("after delete.....",cart2);
     
        res.redirect('/cart');

    }
});


/********************** 상품 주문 (order) ***************************/


// (관리자용)주문전체목록
router.get('/admin_order', (req,res) => {
    connection.query('select * from orders',(err,rows) =>{
        if (err) {
            console.error("err : " + err);
        } else {
            res.render('admin_order',{title : "상품 뿌리기 테스트", rows:rows, userId : req.session.userId })
        }
    })
})

// (관리자용) 주문 배송상태 수정
router.get('/order_update', (req, res) => {
    let ordernum = req.query.ordernum;
    connection.query('update orders set result=2 where ordernum=?',[ordernum], (err, row) => {
        console.log(row);
        if(err){
            console.log("err : ", err);
        } else{
            res.redirect('admin_order');
        }
    } )

})



/* 1026(비회원)주문 목록 확인 */
router.post('/guest_order', (req, res) => {
    // login페이지의 "guest login(조회)"버튼 클릭으로 => form('guest_login')에서 상품번호, 상품수 받아옴=>주문번호, 주문자명 받아옴
    // 주문번호orderNum, 주문자명userId으로 order테이블에서 상품정보 가져옴
    // 가져온 상품정보의 prodnum으로 product테이블 조회 => 상품의 image, prodname 가져오기

    const receiverName = req.body.receiverName;
    const ordernum = req.body.ordernum;

   // orders테이블에서 receiverName. ordernum으로 주문정보 찾기(1개 나옴)
    connection.query('select * from orders where receiverName = ? AND ordernum = ? ', [receiverName, ordernum], (err,data) => {
        if(err) return console.log(err);
        // var prodnum = data[0].prodnum;
        // console.log(" data[0].prodnum : ", data[0].prodnum);

        // 비회원 주문정보 확인
        if(data.length){
            
            var prodnum = data[0].prodnum;
            
            if( receiverName == data[0].receiverName && ordernum == data[0].ordernum ){
                console.log("비회원 주문정보 있음."); 

                var sql_tt=`select * from product where prodnum=?`;
                connection.query(sql_tt, [prodnum], (err,result) => {
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

/* 물품 재고 확인 */
router.post('/product/stock',(req, res) =>{
    try {

        var prodnum = JSON.parse(req.body.prodnum); // 현재 상품번호
        var quantity = JSON.parse(req.body.quantity); //갯수

        
        var sql1 = `select stock, useyn from product where prodnum=${prodnum};`;// 현재 상품번호에 해당하는 상품의 모든 정보를 얻어옴

        connection.query(sql1, function (error, result) {
            if(!error) {
                if(result[0].stock <= 0 || quantity > result[0].stock || result[0].useyn == 'n') {    // 재고가 없는 경우
                    return res.status(202).json({ // status(202) : 요청은 받아들여졌으나, 아직 동작을 수행하지 않은 상태로, 요청이 적절함을 의미
                        result_code: "fail",
                        message: result[0].stock <=5 ? `재고가 부족합니다.(남은 개수: ${result[0].stock})` : '재고가 부족합니다.'   //재고 수량이 5개 이하면 남은 개수도 같이 표시
                    });
                } else { // 재고 충분함 (성공)
                    return res.status(200).json({result_code: "success"});
                }
            } else {
                return res.status(500).json({
                    message: "에러"
                });
            }
        });
        
    } catch (e) {
        console.log("에러 : " + e);
        return res.status(500).json({
            message: "에러"
          });
    }
});




/* 1) 주문 화면 : 주문서 작성 */
router.post('/order', (req, res) => { 
    //detail페이지의 "바로구매하기"버튼 클릭으로 => form('forma')에서 상품번호, 상품수 받아옴
    var prodnum = JSON.parse(req.body.prodnum); //JSON.parse(): (텍스트)를 JavaScript 객체로 변환
    var quantity = JSON.parse(req.body.amount);
    

    var sql1 = `select * from product where prodnum=${prodnum};`;// 현재 상품번호에 해당하는 상품의 모든 정보를 얻어옴

    connection.query(sql1, function (error, result) {
        if(!error) {
            totalPrice = result[0].price2 * quantity; // 총금액
            totalPrice2 = result[0].price2 * quantity + 2500; // 총금액 + 배송비
            console.log("result[0] : ", result[0]); 
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
                    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); //x(숫자) 1000단위로 쉼표찍기
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
        var userId = JSON.stringify(req.body.userId); //req.body.userId(객체)를  (JSON)문자열로 변환 => 서버로 데이터를 보내기 위함
        var phoneNum = JSON.stringify(req.body.userPhoneNum);
        var userEmail = JSON.stringify(req.body.userEmail);

        var receiverName = JSON.stringify(req.body.receiverName);
        var receiverZonecode = JSON.stringify(req.body.receiverZonecode);
        var receiverAddress = JSON.stringify(req.body.receiverAddress);
        var receiverAddressSub = JSON.stringify(req.body.receiverAddressSub);
        var receiverPhoneNum = JSON.stringify(req.body.receiverCellPhone);
        var orderMemo = JSON.stringify(req.body.orderMemo);

        var prodnum = JSON.parse(req.body.prodnum); // JSON문자열의 구문을 분석하고, 그 결과에서 js값/객체를 생성함.
        var quantity = JSON.parse(req.body.quantity);
        var totalprice = JSON.parse(req.body.totalSettlePrice);

        var currentStock = 0; // 현재 상품재고

        var sql1 = `select * from product where prodnum=${prodnum};`;// 현재 상품번호에 해당하는 상품의 모든 정보를 얻어옴
        connection.getConnection(function (err, pool){
            pool.query(sql1, function (error, result) {
                if(!error){
                    currentStock = result[0].stock;
                    if(currentStock <= 0 || quantity > currentStock || result[0].useyn == 'n') {    // 재고가 없는 경우
                        return res.status(202).json({
                            result_code: "fail",
                            message: currentStock <=5 ? `재고가 부족합니다.(남은 개수: ${currentStock})` : '재고가 부족합니다.'   //재고 수량이 5개 이하면 남은 개수도 같이 표시
                        });

                    }else{ // 재고가 있는 경우
    
                        // 로그인 여부 체크
                        if( req.session.is_logined){ // 1) 로그인 되어있으면 : order테이블에 주문내역 저장 
                            
                            // 로그인 아이디의 idx 조회
                            pool.query('select * from users where userId=?',[req.session.userId],(err,result)=>{
                                if( result.length > 0 ){
                                    var idx = result[0].idx;
                                    var userId = result[0].userId;
                                    // console.log("result[0].userId : ", result[0].userId)
    
                                    // orders 테이블에 insert 및 product 테이블에 stock/useyn update 처리하는 것을 트랜잭션 기능으로 처리
                                    pool.beginTransaction( function(err) {
                                            if(err){
                                                console.log("트랜잭션 시작 에러 : " + err);
                                            }else {
                                                var sql_1 = `INSERT INTO orders (idx, userId, userPhoneNum, prodnum, indate, quantity, totalprice, receiverName, receiverZonecode, receiverAddress, receiverAddressSub, receiverPhoneNum, orderMemo) VALUES (${idx}, "${userId}", ${phoneNum}, ${prodnum}, NOW(), ${quantity}, ${totalprice}, ${receiverName}, ${receiverZonecode}, ${receiverAddress}, ${receiverAddressSub}, ${receiverPhoneNum}, ${orderMemo})`;
                                                
                                                // 주문내역 테이블에 데이터 추가
                                                pool.query(sql_1, function (error, result) {
                                                    if(!error){
                                                        console.log("제발바라밥랍ㄹ: ", result.insertId);
                                                        var testorder=result.insertId;
    
                                                        var sql_2 = `UPDATE product SET stock = stock - ${quantity} WHERE prodnum=${prodnum};` // 구매 완료 이후 구매수량만큼 재고수량 차감
    
                                                        var resultStock = currentStock - quantity; // 구매 이후 재고수량 미리 구하기
                                                        if(resultStock <= 0) { // 구매 이후 재고수량이 0이하인 경우, useyn = 'n'도 같이 처리
                                                            sql_2 = `UPDATE product SET stock = stock - ${quantity}, useyn='n' WHERE prodnum=${prodnum};`
                                                        }
    
                                                        pool.query(sql_2, function (error, result) {
                                                            if (error) {
                                                                pool.rollback();
                                                                console.log("쿼리 에러 : " + error);
                                                                return res.status(500).json({
                                                                    message: "에러"
                                                                });
                                                            } else {
                                                                // console.log(result);
                                                                pool.commit();
                    
                                                                return res.status(200).json({ message:"아으으으악", status:200 , testorder:testorder});
                                                            }
                                                        });
    
                                                    } else {
                                                        console.log(error);
                                                        return res.status(500).json({
                                                            message : "에러"
                                                        });
                                                    }
                                                }); 
                                            }
                                        });
                                }
                            }); 
                            
                        // 비회원
                        } else { // 2) 비회원이면 : order테이블에 (idx/userId(user정보)) 제외하고 주문내역 저장
                
                            pool.beginTransaction(function(err) {
                                if(err) {
                                    console.log("트랜잭션 시작 에러 : "+ err);
                                }else {
                                    var sql_1 = `INSERT INTO orders (userPhoneNum, prodnum, indate, quantity, totalprice, receiverName, receiverZonecode, receiverAddress, receiverAddressSub, receiverPhoneNum, orderMemo) VALUES (${phoneNum}, ${prodnum}, NOW(), ${quantity}, ${totalprice}, ${receiverName}, ${receiverZonecode}, ${receiverAddress}, ${receiverAddressSub}, ${receiverPhoneNum}, ${orderMemo})`;
                
                                    // 주문내역 테이블에 회원정보를 제외하고 데이터 추가
                                    pool.query(sql_1, function (error, result) {
                                        if(!error) {
    
                                            //1027test....
                                            // var testorder=result[0];
                                            console.log("제발바라밥랍ㄹ: ", result.insertId);
                                            var testorder=result.insertId;
    
                                            var sql_2 = `UPDATE product SET stock = stock - ${quantity} WHERE prodnum=${prodnum};` // 구매 완료 이후 구매수량만큼 재고수량 차감
                                
                                            var resultStock = currentStock - quantity; // 구매 이후 재고수량 미리 구하기
                                            if(resultStock <= 0) { // 구매 이후 재고수량이 0이하인 경우, useyn = 'n'도 같이 처리
                                                sql_2 = `UPDATE product SET stock = stock - ${quantity}, useyn='n' WHERE prodnum=${prodnum};`
                                            }
    
                                            pool.query(sql_2, function (error, result) {
                                                if (error) {
                                                    pool.rollback();
                                                    console.log("쿼리 에러 : " + error);
                                                    return res.status(500).json({
                                                        message: "에러"
                                                    });
                                                } else {
                                                    // console.log(result);
                                                    pool.commit();
    
                                                    return res.status(200).json({ message:"아으으으악", status:200 , testorder:testorder});
                                                }
                                            });
    
                                        } else {
                                            console.log(error);
                                            return res.status(500).json({
                                                message: "에러"
                                            });
                                        }
                                    });
                                }
                            });
                        } // 비회원 처리 끝
                    }
                } else{
                    return res.status(500).json({
                        message: "에러"
                    });
                }
            });
        })
        
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





/***************** function start ******************/

/********* 공지사항 *********/

/* 리스트 전체를 불러오는 함수 */
function getAllNotice(callback){
    connection.query('select * from heynature ORDER BY id DESC',
    (err, rows, fields) => {
        for(let i=0; i<rows.length;i++){
            /* YYYY-MM-DD 형식으로 출력할 것 */
            // console.log('rows'+JSON.stringify(rows[i]));
            rows[i].update_time = moment( rows[i].update_time).format('YYYY-MM-DD'); //db에서 date 타입을 Date로 했기에 필요없는 부분은 날리려구 포멧해주어서 다시 넣어준다.
        }
        if(err) throw err;
        callback(rows);
    })
}


/* 리스트에 새로운 내용을 추가하는 함수 */

function insertNotice(title,content,callback){
    connection.query(`insert into heynature (title,create_time, update_time,content) values ("${title}",now(),now(),"${content}")`,(err,result)=>{
        if(err) throw err;
        callback();
    })
}



/* 리스트 중 id값이 일치하는 row만 불러오는 함수 */

function getNoticeById(id, callback){
    connection.query(`select * from heynature where id=${id}`,
    (err, row, fields) => {
        if(err) throw err;
        callback(row);
    })
}


/* 리스트를 수정하고 싶을 때 id값이 일치하는 부분을 수정하는 함수 */

function updateNoticeById(id, title, content, callback){
    connection.query(`update heynature set title='${title}',update_time=now(), content='${content}' where id=${id}`, (err, result)=>{
        if(err) throw err;
        callback();
    })
}

/* 리스트 중 id값이 일치하는 부분을 삭제하는 함수 */

function deleteNoticeById(id,callback){
    connection.query(`delete from heynature where id=${id}`,
    (err, result) => {
        if(err) throw err;
        callback();
    });
}



/**************** 리뷰 ***************/

//리뷰 전체 불러오기
function getAlldetail(callback){
    connection.query('select * from review_detail ORDER BY id DESC',
    (err, rows, fields) => {
        if(err) throw err;
        callback(rows);
    })
}


///리뷰 작성
function insertdetail(username, content, starcount, r_imgFile, prodnum, callback){

    connection.query(`insert into review_detail (username, update_time, content, star, r_imgFile,prodnum) values ("${username}", now(),"${content}","${starcount}","${r_imgFile}","${prodnum}")`,(err,result)=>{
        if(err) throw err;
        callback();
    })
}
///텍스트리뷰 작성
function insertdetail_text(username, content, starcount, prodnum, callback){

    connection.query(`insert into review_detail (username, update_time, content, star, prodnum) values ("${username}", now(),"${content}","${starcount}", "${prodnum}")`,(err,result)=>{
        if(err) throw err;
        callback();
    })
}

//리뷰 삭제
function deletedetailById(id,callback){
    connection.query(`delete from review_detail where id=${id}`,
    (err, result) => {
        if(err) throw err;
        callback();
    });
}


/***************** function end ******************/

//내보내기
module.exports = router
