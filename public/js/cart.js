window.onload = function init() { 
  console.log("10181018test");
}


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