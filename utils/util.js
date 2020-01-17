const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const validate_mobile = phone => {
    var pattern = /^((\+?86)|(\+86\+86))?1\d{10}$/;
    var result;
    if (pattern.test(phone) === true) {
        result = true;
    } else {
        result = false;
    }
    return result;
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

const formatTimeToDate = time => {
    var today = new Date(time);
    var year = today.getFullYear();
    var month = ('0' + (today.getMonth() + 1)).slice(-2).toString();
    var date = ('0' + today.getDate()).slice(-2).toString();
    var date_string = year + "-" + month + "-" + date;
    return date_string;
}

const formatTimeToDateCN = time => {
    var today = new Date(time);
    var year = today.getFullYear();
    var month = ('0' + (today.getMonth() + 1)).slice(-2).toString();
    var date = ('0' + today.getDate()).slice(-2).toString();
    var date_string = year + "年" + month + "月" + date + "日";
    return date_string;
}

function isNumber(val) {
    var regPos = /^\d+(\.\d+)?$/; //非负浮点数
    var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
    if (regPos.test(val) || regNeg.test(val)) {
        return true;
    } else {
        return false;
    }
}

function setSixRandom(){
  var randomNum = ('000000' + Math.floor(Math.random() * 999999)).slice(-6);
  return randomNum;
}

module.exports = {
    formatTime: formatTime,
    validate_mobile: validate_mobile,
    formatTimeToDate: formatTimeToDate,
    formatTimeToDateCN: formatTimeToDateCN,
    isNumber: isNumber,
    setSixRandom: setSixRandom
}
