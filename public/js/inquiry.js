function q_inquiryform_check() {


    q_clickSubmit();

}

function q_clickSubmit(){
    var q_btn = document.getElementById("q_btn");//이름

    if(confirm('답변하시겠습니까?')){
        // 입력값 전송
        document.q_inquiry_send.submit();
    }else{
        return;
    }
}