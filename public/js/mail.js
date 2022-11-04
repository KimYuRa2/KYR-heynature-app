// const nodemailer = require('nodemailer');

// //# 환경변수 관리 ( "dotenv"사용 : 어떤 os에서 개발하더라도 , 동일하게 환경변수를 등록하고 가져올 수 있게됨.)
// const dotenv = require("dotenv");
// // # 환경변수 관리
// dotenv.config(); //config(현재디렉토리의 .env파일을 자동으로 인식하여 환경변수 세팅)라는 메서드를 실행하면, dotenv라는 모듈이 자동적으로 .env에 등록돼있는 변수들을 node.js에서 접근할 수 있도록  "process.env.환경변수"에 등록을 시켜줌!!

// // 메일발송 객체
// const mailSender = {
//     // 메일발송 함수
//     sendGmail: function (param) {
//       var transporter = nodemailer.createTransport({
//         service: process.env.SERVICE,   // 메일 보내는 곳
//         host: process.env.MAILHOST,
//         port: process.env.MAILPORT,
//         secure: false,  
//         requireTLS: true ,
//         auth: {
//           user: process.env.MAILID, // 보내는 메일의 주소
//           pass: process.env.MAILPASSWORD,   // 보내는 메일의 비밀번호
//         }
//       });

//       // 메일 옵션
//       var mailOptions = {
//         from: process.env.MAILID, // 보내는 메일의 주소
//         to: param.toEmail, // 수신할 이메일
//         subject: param.subject, // 메일 제목
//         text: param.text // 메일 내용
//       };
      
//       // 메일 발송    
//       transporter.sendMail(mailOptions, function (error, info) {
//         if (error) {
//           console.log(error);
//         } else {
//           console.log('Email sent: ' + info.response);
//         }
//       });
  
//     }
//   }
  
//   module.exports = mailSender;