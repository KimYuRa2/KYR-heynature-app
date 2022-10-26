$(document).ready(function() {
    $('.or-form-component input.text, .or-form-component textarea.text').on('focusout', function(e) {
        if( this.value != '' ) $(this).parent().addClass('has-value');
        else $(this).parent().removeClass('has-value');
    });

    $('.or-form-component .label-text').on('click', function(e) {
        $(this).closest('label').find('.text').focus();
    });

    $('.or-form-component input.text, .or-form-component textarea.text').focusin(function(){
        $(this).next().css({    
            fontSize : '0.6em',
            height : '25px',
            lineHeight : '50px',
            top : '10px',
            transition : 'all 0.4s'
        })
    })

    $('#member_post').focusin(function(){
        $(this).parent().parent().next().children().children().css({
            fontSize : '0.6em',
            height : '25px',
            lineHeight : '50px',
            top : '10px',
            transition : 'all 0.4s'
        })
    })
    $('#member_addr').focusin(function(){
        $(this).parent().parent().prev().children().children().css({
            fontSize : '0.6em',
            height : '25px',
            lineHeight : '50px',
            top : '10px',
            transition : 'all 0.4s'
        })
    })

});

setTimeout(function() {
    $('.or-form-component input.text').each(function(e) {
        if( this.value != '' ) $(this).parent().addClass('has-value');
        else $(this).parent().removeClass('has-value');
    });
}, 150);





function findAddr(){
	new daum.Postcode({
        oncomplete: function(data) {
        	
        	console.log(data);
        	
            // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.
            // 도로명 주소의 노출 규칙에 따라 주소를 표시한다.
            // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
            var roadAddr = data.roadAddress; // 도로명 주소 변수
            var jibunAddr = data.jibunAddress; // 지번 주소 변수
            // 우편번호와 주소 정보를 해당 필드에 넣는다.
            document.getElementById('member_post').value = data.zonecode;
            if(roadAddr !== ''){
                document.getElementById("member_addr").value = roadAddr;
            } 
            else if(jibunAddr !== ''){
                document.getElementById("member_addr").value = jibunAddr;
            }
        }
    }).open();
}


// 1024 order > 결제하기 버튼 클릭 시
function orderBuy() {
    var userName = $("input[name='userName']").val();
    var userPhoneNum = $("input[name='userPhoneNum']").val();
    var userEmail = $("input[name='userEmail']").val();

    var receiverName = $("input[name='receiverName']").val();
    var receiverZonecode = $("input[name='receiverZonecode']").val();
    var receiverAddress = $("input[name='receiverAddress']").val();
    var receiverAddressSub = $("input[name='receiverAddressSub']").val();
    var receiverCellPhone = $("input[name='receiverCellPhone']").val();
    var orderMemo = $("input[name='orderMemo']").val();

    var prodnum = $("input[name='prodnum']").val();
    var quantity = $("input[name='quantity']").val();
    var totalSettlePrice = $("input[name='totalSettlePrice']").val();

    var data = {
        'userName': userName,
        'userPhoneNum': userPhoneNum,
        'userEmail': userEmail,
        'receiverName': receiverName,
        'receiverZonecode': receiverZonecode,
        'receiverAddress': receiverAddress,
        'receiverAddressSub': receiverAddressSub,
        'receiverCellPhone': receiverCellPhone,
        'orderMemo': orderMemo,
        'prodnum': prodnum, 
        'quantity': quantity,
        'totalSettlePrice': totalSettlePrice
    };
    
    $.ajax({
      type: 'POST',
      url: '/order/complete',
      data: data, // {'userName': userName}처럼 json형태의 데이터를 서버로 전달.
      success: function(response){ // 데이터 통신이 정상적으로 이루어졌을 때 호출하기.
        if(response) {
          if(confirm('결제가 완료되었습니다.')) {
            // location.href="/";
            // $('#post_output').html(response.result);
            // console.log("response!!!!!: ",response);
            // alert(response.ornum);
            alert(response.ordernum);
            $('#post_output').text("asmdfasdofmasopfm");
            location.href="/ordernum";
          }
        }
      },
      error: function(error){
        alert('오류가 발생하였습니다. 잠시 후 다시 시도해주세요.');
      }
    });
}