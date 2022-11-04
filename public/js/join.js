var autoHypenPhone = function(str){ // 휴대폰번호 유효성검사
  str = str.replace(/[^0-9]/g, '');
  var tmp = '';
  if( str.length < 4){
      return str;
  }else if(str.length < 7){
      tmp += str.substr(0, 3);
      tmp += '-';
      tmp += str.substr(3);
      return tmp;
  }else if(str.length < 11){
      tmp += str.substr(0, 3);
      tmp += '-';
      tmp += str.substr(3, 3);
      tmp += '-';
      tmp += str.substr(6);
      return tmp;
  }else{              
      tmp += str.substr(0, 3);
      tmp += '-';
      tmp += str.substr(3, 4);
      tmp += '-';
      tmp += str.substr(7);
      return tmp;
  }

  return str;
}


var phoneNum = document.getElementById('phoneNum');
var receiverCellPhone = document.getElementById('receiverCellPhone');

phoneNum.onkeyup = function(){
    console.log(this.value);
    this.value = autoHypenPhone( this.value ) ;  
}

// 주문서 페이지
receiverCellPhone.onkeyup = function(){
    console.log(this.value);
    this.value = autoHypenPhone( this.value ) ;  
}
