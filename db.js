/* DB 연결 - 스키마 이름 :heynotice / 데이터베이스 이름 : notice */
const mysql = require('mysql');
const moment = require('moment'); // 날짜 포멧을 위한 모듈
//# 환경변수 관리 ( "dotenv"사용 : 어떤 os에서 개발하더라도 , 동일하게 환경변수를 등록하고 가져올 수 있게됨.)
const dotenv = require("dotenv");
// # 환경변수 관리
dotenv.config(); //config(현재디렉토리의 .env파일을 자동으로 인식하여 환경변수 세팅)라는 메서드를 실행하면, dotenv라는 모듈이 자동적으로 .env에 등록돼있는 변수들을 node.js에서 접근할 수 있도록  "process.env.환경변수"에 등록을 시켜줌!!
// console.log("DB_HOST:", process.env.DB_HOST);
// console.log("DB_USER:", process.env.DB_USER);
// console.log("DB_PSWORD:", process.env.DB_PSWORD);
// console.log("SESSION_SECRET:", process.env.SESSION_SECRET);

/* ura31 - heroku cleardb */
var connection = mysql.createConnection({
    host :  process.env.DB_HOST || 'localhost',
    user : process.env.DB_USER || 'root',
    password : process.env.DB_PSWORD || '1234',
    port : '3306',
    database : process.env.DB_DATABASE || 'heynature-local',
    dateStrings:'date'
})


/* (local) heynature-local */
// var connection = mysql.createConnection({
//     host: 'localhost',
//     port: '3306',
//     user: 'root',
//     password: '1234',
//     database: 'heynature-local',
//     dateStrings:'date'
// })


/******************** 공지사항 **********************/

/* 리스트 전체를 불러오는 함수 */

function getAllNotice(callback){
    connection.query('select * from heynature ORDER BY id DESC',
    (err, rows, fields) => {
        for(let i=0; i<rows.length;i++){
            /* YYYY-MM-DD 형식으로 출력할 것 */
            console.log('rows'+JSON.stringify(rows[i]));
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
function insertdetail(username,content,starcount,callback){
    connection.query(`insert into review_detail (username, update_time, content, star) values ("${username}", now(),"${content}","${starcount}")`,(err,result)=>{
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




module.exports = {
    connection,
    getAllNotice,
    insertNotice,
    getNoticeById,
    updateNoticeById,
    deleteNoticeById,
    getAlldetail,
    insertdetail,
    deletedetailById
}