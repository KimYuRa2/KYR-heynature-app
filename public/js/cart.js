window.onload = function init() { 
  console.log("10181018test");
}


/******************* 1025 상품수량 + 자동계산 test ********************/

// const form4 = document.getElementsByName('formb'),
// sell_price2 = document.formb.sell_price2,
// amount2 = document.formb.amount2,
// add2 = document.formb.add2,
// minus2 = document.formb.minus2,
// totalsum2 = document.formb.totalsum2;

// if(form4){
//   document.formb.totalsum2.value = document.formb.sell_price2.value;

//   let amountval2 = amount2.value; //수량
//   let totalsumval2 = totalsum2.value;
//   let priceval2 = sell_price2.value; 
//   console.log(totalsum2.value);

//   if(add2){
//     add2.addEventListener('click',function(){
     
//       alert("safjsadifj");
//       // amountval2++; //수량추가
//       // totalsumval2=amountval2 * priceval2;
//       // amount2.value = amountval2;
//       // totalsum2.value = totalsumval2;
//       // console.log(amountval2,totalsumval2,priceval2);
//     })
//   }

//   if(minus2){
//     minus2.addEventListener('click',function(){
//       if(amountval2 > 1){
//         amountval2--; //수량삭제
//         totalsumval2 = amountval2 * priceval2;
//         amount2.value = amountval2;
//         totalsum2.value = totalsumval2;
//         console.log(amountval2, totalsumval2, priceval2);
//       }else{
//         amountval2=1;
//       }
//     })
//   }
// }




///////////////////////////////////////////////
// 장바구니 페이지 : 상품갯수 +/- 
$(document).ready(function(){

    $('.like-btn').on('click', function() {
        $(this).toggleClass('is-active');
        
    });

    $('.minus-btn').on('click', function(e) {
        e.preventDefault();
        var $this = $(this);
        var $input = $this.closest('div').find('input');
        var value = parseInt($input.val());
    
        if (value > 1) {
            value = value - 1;
        } else {
            value = 0;
        }
    
    $input.val(value);
    
    });
 
    $('.plus-btn').on('click', function(e) {
        e.preventDefault();
        var $this = $(this);
        var $input = $this.closest('div').find('input');
        var value = parseInt($input.val());
    
        if (value < 100) {
            value = value + 1;
        } else {
            value =100;
        }
    
        $input.val(value);
    });
});



//test1027
// 바로 구매하기 버튼 클릭 시
function orderTotalProduct() {
  $('.formb').submit(); // "바로 구매하기" 버튼을 클릭함으로써  post('/order')로 상품번호, 상품 수를 보냄
}