<h1 align="center">Welcome to KYR-heynature-app 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-2.0-blue.svg?cacheSeconds=2592000" />
  <a href="https://github.com/KimYuRa2/KYR-heynature-app/" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
</p>

> 개인프로젝트로 진행한 헤이네이처 쇼핑몰 프로젝트입니다.
이 프로젝트는 앞서 팀프로젝트로 진행했던 헤이네이처 프로젝트(https://github.com/KimYuRa2/heynature-teamproject) 에서 개인적으로 부족하다고 생각했던 부분들을 보완하고, 기능들을 추가하여 쇼핑몰 사이트로 구현했습니다. 
상업 목적이 아닌 공부 목적의 프로젝트이며, 아래 기능이 추가되었습니다!


*회원가입, 로그인, 상품/재고/주문/공지사항 관리, 상품구매, 장바구니, 구매정보 확인, 검색, 텍스트+포토 리뷰, 베스트상품, 페이징, 문의하기(nodemailer모듈) + 추가적으로 필요한 페이지 생성 (ex. 회원가입 페이지, 회원개인/장바구니 페이지, 주문페이지, ... )*

### 추가된 주요 기능
* **메인 페이지 (https://heynature.fly.dev/)** 
  
  : 페이지 상단 돋보기아이콘 클릭하여 상품 검색 가능.
* **회원가입 페이지 (https://heynature.fly.dev/join)** 
  
  : 회원가입
* **로그인 페이지 (https://heynature.fly.dev/login)**
  * 로그인 전 : 로그인 , 비회원 구매자 주문정보 확인(주문자명/주문번호로 검색)
  * 로그인 후
      1) 관리자 : 문의리스트 / 주문리스트 / 상품 관리 + 로그아웃
      2) 일반회원 :  구매상품 리스트(주문상품 배송확인 : 배송완료 시 리뷰작성 가능) + 로그아웃
* **상품 페이지 (https://heynature.fly.dev/product)**
  * BEST 상품 : 구매량 많은 순서대로 상품나열됨
  * 유형별 상품 : 카테고리별로 상품나열
* **상품 상세페이지 (https://heynature.fly.dev/detail?prodnum=244)**

   상품 클릭 시 해당상품 상세페이지로 이동
  * 상품 구매하기 : 상품 수량 선택 후, 재고 남아있을 시 상품 구매페이지로 이동
  * 장바구니 담기 : 상품 수량 선택 후, 장바구니 담기
  * 리뷰 탭 : 상품 구매자들의 텍스트/포토 리뷰 확인. (리뷰 삭제는 구매자 본인만 가능합니다.)
* **CS 페이지 (https://heynature.fly.dev/cscenter)**
  * 공지사항 탭 : 관리자 권한으로 공지사항 게시물 CRUD 가능
  * Q&A 탭 : 상품문의 (추후에 관리자가 email로 답장)
* **장바구니 페이지 (https://heynature.fly.dev/cart)**
  * 일반회원(로그인O) / 비회원사용자(로그인X) : 장바구니 확인 및 삭제


### 사용 기술 스택
> (Frontend) html, css, javascript, jquery
> 
> (Backend) node.js 
>   
> (DB) mysql + (Image server) AWS S3 
>     
> (Deploy) heroku -≫ fly.io 배포


### 🏠 [Homepage](https://heynature.fly.dev)

## Install

```sh
npm install
```

## Usage

```sh
npm run start
```

## Author

👤 **KimYuRa**

* Github: [@KimYuRa2](https://github.com/KimYuRa2)

## Show your support

Give a ⭐️ if this project helped you!

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
