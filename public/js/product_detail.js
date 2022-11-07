window.onload = function init() { 
  // console.log("10181018test");
}

/***************** 상품수량 + 자동계산 ********************/

const amountform = document.getElementsByName("forma"),
sell_price=document.forma.sell_price,
amount=document.forma.amount,
add=document.forma.add,
minus=document.forma.minus,
totalsum=document.forma.totalsum;

if(amountform){
  totalsum.value = sell_price.value;
  let amountval = amount.value;
  let totalsumval=totalsum.value;
  let priceval=sell_price.value;
  console.log(totalsum.value);

  if(add){
    add.addEventListener('click',function(){
      // alert("수량추가버튼");
      amountval++; //수량추가
      totalsumval=amountval*priceval;
      amount.value=amountval;
      totalsum.value=totalsumval;
      console.log(amountval,totalsumval,priceval);
    })
  }

  if(minus){
    minus.addEventListener('click',function(){
      if(amountval>1){
        amountval--; //수량삭제
        totalsumval=amountval*priceval;
        amount.value=amountval;
        totalsum.value=totalsumval;
        console.log(amountval,totalsumval,priceval);
      }else{
        amountval=1;
      }
    })
  }else{
    amountval=1;
  }
}


/*** 인스타 섹션 팝업창 가운데 정렬 ***/

// function openPopup(){
// var _width = '900';
// var _height = '700';

// var _left = Math.ceil((window.screen.width-_width)/2);
// var _top = Math.ceil((window.screen.height-_height)/2);
// window.open('/url','popup-test','width='+_width+',height='+_height+',left='+_left+',top='+_top);
// }


/*** 탭 버튼 구현 ***/

$(document).ready(function(){

  // 포토리뷰 모달창
  $(".product_review_comment_wrap").click(function(){
    $(".review_wrap").fadeIn();
  });

  $(".close").click(function(){
    $(".review_wrap").fadeOut();
  });

//

var tabAnchor = $('.product_nav li a'),
    tabPanel = $('.product_nav_wrap');

//링크를 클릭하면 할 일
tabPanel.hide();
$('.product_nav_wrap:eq(0)').show();
$('.product_nav li:eq(0)').addClass('first_active');
$('.product_nav li:eq(1)').addClass('second_active');
$('.product_nav li:eq(2)').addClass('second_active');

  tabAnchor.click(function(e){
    e.preventDefault();
    $('.product_nav li:eq(0)').removeClass('first_active');
    $('.product_nav li:eq(1)').removeClass('second_active');
    $('.product_nav li:eq(2)').removeClass('second_active');

    tabAnchor.parent('li').removeClass('tab_active active');
    tabAnchor.parent('li').addClass('tab_underbar')// 모두 빼고
    $(this).parent('li').addClass('tab_active active'); //그 요소에만 추가
    $(this).parent('li').removeClass('tab_underbar');

    if($('.product_nav li:eq(0)').hasClass('active')){
      $('.product_nav li:eq(0)').addClass('first_active');
    } 
    else {
      $('.product_nav li:eq(0)').removeClass('first_active');
    }



    tabPanel.hide();

    var target = $(this).attr('href');
    $(target).show();
    console.log(target)
  });
});


/*** Photo Review 모달창 ***/
var modals = document.getElementsByClassName("ev_box_wrap");
var btns = document.getElementsByClassName("event_on");
var spanes = document.getElementsByClassName("close");
var funcs = [];

// Modal을 띄우고 닫는 클릭 이벤트를 정의한 함수
function detail_Modal(num) {
  return function() {
    // 해당 클래스의 내용을 클릭하면 Modal을 띄웁니다.
    btns[num].onclick =  function() {
        modals[num].style.display = "block";
        console.log(num,"번째 포토모달!!!");
        body.style.overflow = "hidden"
        body.style.height = "100%";
    };
    
    // <span> 태그(X 버튼)를 클릭하면 Modal이 닫습니다.
    spanes[num].onclick = function() {
        modals[num].style.display = "none";
        body.style.overflow = "auto"
        body.style.height = "100%";
    };
    
  };
}

// 원하는 Modal 수만큼 Modal 함수를 호출해서 funcs 함수에 정의합니다.
for(var i = 0; i < btns.length; i++) {
  funcs[i] = detail_Modal(i);
}
 
// 원하는 Modal 수만큼 funcs 함수를 호출합니다.
for(var j = 0; j < btns.length; j++) {
funcs[j]();
}




/************jquery start*************/
$(document).ready(function(){

  /*** tab active ***/
  $(".tab1 li").click(function(){
    var num = $(".tab1 li").index(this);
    
    $(".tab1 li").removeClass('active');
    $(this).addClass('active');
  

    if ( $('.view2').hasClass('active') == true ) {
      $('.event_end').hide();
    } else {
      $('.event_end').show();

    }
    if ( $('.view3').hasClass('active') == true ) {
      $('.event_on').hide();
    } else {
      $('.event_on').show();
    }

  });

  $('.event_on').click(function(){
    $('.rol').addClass('rol_stop');
  })
  $('.close').click(function(){
    $('.rol').removeClass('rol_stop');
  })


});


/*** 리뷰 페이지 넘버 작성 ***/

// var reviewTab = $('.product_review_paging>li>a'),
//   reviewTabPanel = $('.review_page_section');

//링크를 클릭하면 할 일
// reviewTabPanel.hide();
// $('.review_page_section:eq(0)').show();
// $('.product_review_paging li:eq(0)').addClass('review_first_tab_active');
// $('.product_review_paging li:eq(1)').addClass('review_first_tab_active_a');
// $('.product_review_paging li:eq(2)').addClass('review_first_tab_active_a');
// $('.product_review_paging li:eq(3)').addClass('review_first_tab_active_a');
// $('.product_review_paging li:eq(4)').addClass('review_first_tab_active_a');
// $('.product_review_paging li:eq(5)').addClass('review_first_tab_active_a');


// reviewTab.click(function (e) {

// $('.product_review_paging li:eq(0)').removeClass('review_first_tab_active');
// $('.product_review_paging li:eq(1)').removeClass('review_first_tab_active_a');
// $('.product_review_paging li:eq(2)').removeClass('review_first_tab_active_a');
// $('.product_review_paging li:eq(3)').removeClass('review_first_tab_active_a');
// $('.product_review_paging li:eq(4)').removeClass('review_first_tab_active_a');
// $('.product_review_paging li:eq(5)').removeClass('review_first_tab_active_a');


// e.preventDefault();



// reviewTab.parent('li').removeClass('review_tab_active');
// reviewTab.parent('li').addClass('review_tab_unactive')// 모두 빼고
// $(this).parent('li').addClass('review_tab_active'); //그 요소에만 추가
// $(this).parent('li').removeClass('review_tab_unactive');

// reviewTab.removeClass('review_tab_a_active');
// reviewTab.addClass('review_tab_a_unactive');
// $(this).addClass('review_tab_a_active');
// $(this).removeClass('review_tab_a_unactive');
// reviewTabPanel.hide();

// var review = $(this).attr('href');
// $(review).show();

// });

/////////////리뷰 작성하기///////////////

// Get the modal : 리뷰작성 폼
var modal = document.getElementById("myModal");

// Get the button that opens the modal : 리뷰작성버튼
var btn2 = document.getElementById("review_write_btn");

// Get the <span> element that closes the modal : 리뷰작성 취소버튼
var span = document.getElementsByClassName("cancel_btn")[0];

var body = document.body


// When the user clicks the button, open the modal 
btn2.onclick = function() {
// modal.style.display = "block";
body.style.overflow = "hidden";
body.style.height = "100%";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
modal.style.display = "none";
body.style.overflow = "auto";
body.style.height = "100%";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
if (event.target == modal) {
  modal.style.display = "none";
}
}

/***  첫번째 시작 화면시 li에만 기본 값 주기 ***/
function myfunction(){
var tabAnchor_first = $('.product_nav li')
$('tabAnchor_first').addClass('tab_firstcss');
}


/////////별 클릭 시 색깔 바뀌기 + 별 누적/////

// var Mystar = $('.mystar');

// Mystar.click(function(e){
//   e.preventDefault();
//   Mystar.addClass('.star_unactive');
//   Mystar.removeClass('.star_active');
//   $(this).addClass('.star_active');
//   $(this).removeClass('.star_unactive');
// })

//////////////////////////////
// $('.starRev span').click(function(){
// $(this).parent().children('span').removeClass('on');
// $(this).addClass('on').prevAll('span').addClass('on');
// return false;
// });




///////파일 첨부 버튼 ///////////

// window.addEventListener('load', function fileUp(){
// target = document.getElementById('myFile');
// target.addEventListener('change', function(){
//     fileList = "";
//     for(i = 0; i < target.files.length; i++){
//         fileList += target.files[i].name + '<br>';
//     }
//     target2 = document.getElementById('showFiles');
//     target2.innerHTML = fileList;
// });
// })


/********************* 별점 ******************** */
$(document).ready(function(){
  $('#star12 a').click(function(){ 
  $(this).parent().children("a").removeClass("on");    
  $(this).addClass("on").prevAll("a").addClass("on");
  console.log($(this).attr("value"));
});})


function star1(){
$('input[name=starcount]').attr('value',1);
}
function star2(){
$('input[name=starcount]').attr('value',2);
}
function star3(){
$('input[name=starcount]').attr('value',3);
}
function star4(){
$('input[name=starcount]').attr('value',4);
}
function star5(){
$('input[name=starcount]').attr('value',5);
}


///////별 클릭 시 색깔 바뀌기 + 별 누적/////
function starcount(){
  var star1 = document.querySelector("#star11")
  var star2 = document.querySelector("#star22")
  var star3 = document.querySelector("#star33")
  var star4 = document.querySelector("#star44")
  var star5 = document.querySelector("#star55")


  if(star1.click){
    $('input[name=starcount]').attr('value',1);
  } else if(star2.click){
    $('input[name=starcount]').attr('value',2);
  } else if(star3.click){
    $('input[name=starcount]').attr('value',3);
  } else if(star4.click){
    $('input[name=starcount]').attr('value',4);
  } else {
    $('input[name=starcount]').attr('value',5);
  }

  console.log()
}

$.fn.generateStars = function() {
return this.each(function(i,e){
  $(e).html($('<span/>').width($(e).text()*16)); // 16이 별1개 width
});
};

// 숫자 평점을 별로 변환하도록 호출하는 함수
$('.star-prototype').generateStars();




/********************* 별점 *********************/


$(function() {
  $('div#star').raty({
    score: 3
    ,path : "img/star1.png"
    ,width : 200
    ,click: function(score, evt) {
      $("#starRating").val(score);
      $("#displayStarRating").html(score);
    }
  });
});


/********************* 장바구니담기 *********************/

// 장바구니 담기 클릭 시
function insertCart() {

var prodnum = $('#prodnum').val();
var quantity = $('#amount').val()
var data = {
  'prodnum': prodnum, 
  'quantity': quantity
};

$.ajax({
  type: 'POST',
  url: '/cart',
  data: data,
  success: function(response){
    if(response) {
      if(confirm('장바구니에 상품이 담겼습니다. 장바구니를 확인하시겠습니까?')) {
        location.href="/cart";
      }
    }
  },
  error: function(error){
    alert('오류가 발생하였습니다. 잠시 후 다시 시도해주세요.');
  }
});
}




// 바로 구매하기 버튼 클릭 시
function orderProduct() {
var prodnum = $('#prodnum').val();
var quantity = $('#amount').val();
var data = {
  'prodnum': prodnum, 
  'quantity': quantity
};

// 재고가 있는지 체크 후 주문 페이지로 이동
$.ajax({
  type: 'POST',
  url: '/product/stock',
  data: data,
  success: function(response){
    if(response) {
      if(response.result_code == 'fail') { // 재고부족으로 구매불가
        alert(response.message);
        return false;
      } else {
        $('.forma').submit(); // "바로 구매하기" 버튼을 클릭함으로써  post('/order')로 상품번호, 상품 수를 보냄
      }
    }
  },
  error: function(error){
    alert('오류가 발생하였습니다. 잠시 후 다시 시도해주세요.');
  }
});

}

//1026
// function guestLogin() {
// $('.guest_login').submit(); 

// }