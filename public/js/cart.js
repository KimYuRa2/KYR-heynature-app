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


//1021 cart test

/******************* 1025 상품수량 + 자동계산 test ********************/
const amountform2 = document.getElementsByName("formb"),
sell_price2=document.formb.sell_price2,
amount2=document.formb.amount2,
add2=document.formb.add2,
minus2=document.formb.minus2,
totalsum2=document.formb.totalsum2;

if(amountform2){
  totalsum2.value = sell_price2.value;
  let amountval = amount2.value;
  let totalsumval=totalsum2.value;
  let priceval=sell_price2.value;
  console.log("totalsum2.value:",totalsum2.value);

  if(add2){
    add2.addEventListener('click',function(){
      alert("수량추가버튼");
      console.log('눌림');
      amountval++; //수량추가
      totalsumval=amountval*priceval;
      amount2.value=amountval;
      totalsum2.value=totalsumval;
      console.log(amountval,totalsumval,priceval);
    })
  }

  if(minus2){
    minus2.addEventListener('click',function(){
      if(amountval>1){
        amountval--; //수량삭제
        totalsumval=amountval*priceval;
        amount2.value=amountval;
        totalsum2.value=totalsumval;
        console.log(amountval,totalsumval,priceval);
      }else{
        amountval=1;
      }
    })
  }else{
    amountval=1;
  }
}