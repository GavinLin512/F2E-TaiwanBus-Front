function GetAuthorizationHeader() {
    var AppID = '4846c393c288415eaa83db9d452ac86f';
    var AppKey = 'i_K4RReF8yaQo3F_YsI5t7Ma6uo';

    var GMTString = new Date().toGMTString();
    // console.log(GMTString);

    var ShaObj = new jsSHA('SHA-1', 'TEXT');
    console.log(ShaObj);
    ShaObj.setHMACKey(AppKey, 'TEXT');
    ShaObj.update('x-date: ' + GMTString);
    var HMAC = ShaObj.getHMAC('B64');
    var Authorization = 'hmac username=\"' + AppID + '\", algorithm=\"hmac-sha1\", headers=\"x-date\", signature=\"' + HMAC + '\"';

    return { 'Authorization': Authorization, 'X-Date': GMTString /*,'Accept-Encoding': 'gzip'*/ }; //如果要將js運行在伺服器，可額外加入 'Accept-Encoding': 'gzip'，要求壓縮以減少網路傳輸資料量
}