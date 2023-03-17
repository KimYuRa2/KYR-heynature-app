$(function() {
    // 3) 주문서정보 입력후 벗어날(focusout)때, 해당 input칸이 빈칸이 아니면 해당 주문서정보를 감싸고있는 <label></label>에 has-value클래스 추가
    $('.or-form-component input.text, .or-form-component textarea.text').on('focusout', function(e) {
        if( this.value != '' ) // Order - 주문하시는 분/연락처... 등 "주문서 정보"칸이 빈칸이 아니면
            $(this).parent().addClass('has-value'); // 해당 주문서정보를 감싸고있는 <label></label>에 has-value클래스 추가
        else 
            $(this).parent().removeClass('has-value');
    });

    // 1) 주문하시는분 label을 클릭시, 해당 input에 포커스 주기(포커스를 얻는것 : input태그를 마우스로 클릭하여 "입력상태"로 만든것)
    $('.or-form-component .label-text').on('click', function(e) { // label-text : <label>주문하시는 분</label>을 클릭하면
        $(this).closest('label').find('.text').focus(); // <input type="text" class="text" name="userId"...>에 포커스를 줌 (포커스를 얻는것 : input태그를 마우스로 클릭하여 "입력상태"로 만든것)
    });

    // 2) input에 포커스가 들어갔을 때. 주문하시는분 label css변경(라벨 글씨 작아지며 올라감)
    $('.or-form-component input.text, .or-form-component textarea.text').focusin(function(){ // focusin() : .focus가 들어갔을때 이벤트 발생
        $(this).next().css({    
            fontSize : '0.6em',
            height : '25px',
            lineHeight : '50px',
            top : '10px',
            transition : 'all 0.4s'
        })
    })

    // input창에 입력값 없을 시, label css 다시 제자리로.
    $('.or-form-component input.text, .or-form-component textarea.text').focusout(function(){ // focusin() : .focus가 들어갔을때 이벤트 발생
        if( this.value == '' ){
            $(this).next().css({    
                fontSize : '0.8em',
                height : '40px',
                lineHeight : '40px',
                top:'35px',
                transition : 'all 0.4s'  ,
            })
        }
    })

    // 우편번호 항목에 포커스인됐을때
    $('#member_post').focusin(function(){ 
        $(this).parent().parent().next().children().children().css({
            fontSize : '0.6em',
            height : '25px',
            lineHeight : '50px',
            top : '10px',
            transition : 'all 0.4s'
        })
    })
    
    // 주소 항목에 포커스인 됐을때
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


// 주문서정보 input칸이 빈칸이 아닐때 ,해당 주문서정보를 감싸고있는 <label></label>에 has-value클래스 추가
// setTimeout(function() {
//     $('.or-form-component input.text').each(function(e) {
//         if( this.value != '' )
//             $(this).parent().addClass('has-value');
//         else 
//             $(this).parent().removeClass('has-value');
//     });
// }, 300);


// 다음 주소 API : join-주소 + order-주소
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

// 결제버튼 클릭시 실행
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

    var orderCheck = $("input[name='orderCheck']");

    // 주문서 입력정보 data에 담기
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

    // 주문서 필수입력정보 유효성 검사
    if(receiverName==""){
            alert("성명을 입력하세요.");
            receiverName.focus();
            return false;
    }
    else if(receiverZonecode==""){
        alert("주소를 입력하세요.");
        receiverZonecode.focus();
        return false;
    }
    else if(receiverAddress==""){
        alert("주소를 입력하세요.");
        receiverAddress.focus();
        return false;
    }
    else if(receiverAddressSub==""){
        alert("주소상세를 입력하세요.");
        receiverAddressSub.focus();
        return false;
    }
    else if(receiverCellPhone==""){
        alert("휴대번호를 입력하세요.");
        receiverCellPhone.focus();
        return false;
    }
    else if(orderCheck.is(":checked") == false ){
        alert("구매 진행 동의에 체크해주세요.");
        orderCheck.focus();
        return false;
    }

    var datajson = JSON.stringify(data);
  
    //서버에 ajax 요청
    $.ajax({
      type: 'POST', 
      url: '/order/complete', //서버측에서 가져올 페이지
      data: datajson, // {'userName': userName}처럼 "json형태의 데이터"를 서버로 전달. (요청과 함께 서버로 데이터를 전송 할 "string" 또는 map)
      contentType:  "application/json; charset=utf-8",
      success: function(response){ // 데이터 통신이 정상적으로 이루어졌을 때 호출하기.
        if(response) {
          if(confirm('결제가 완료되었습니다. ')) {
            alert("결제페이지 하단에서 주문번호를 확인해주세요.");
            console.log(response.message);
            alert(response.testorder);
            $('#post_output').html(response.testorder);
          }else{
            alert("전송된 값 없음")
          }
        
        }
      },
      error: function(error){
        alert('오류가 발생하였습니다. 잠시 후 다시 시도해주세요.');
      }
    })
}









