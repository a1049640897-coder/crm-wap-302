// 公用校验方法VerifyFunc
let VerifyFunc = {}
VerifyFunc.name = function (rule, val, callback) { // 校验名字
  let regs = /^[\u4E00-\u9FA5]+$/
  let num = [2, 3, 4, 5, 6, 7, 8]
  if (!regs.test(val)) {
    callback(new Error(`姓名只能为汉字`))
  } else if (val.length === 1) {
    callback(new Error(`姓名需大于1个汉字`))
  } else if (!num.includes(val.length)) {
    callback(new Error(`名字太长那，请修改`))
  } else {
    callback()
  }
}

VerifyFunc.price = function (rule, val, callback) { // 校验单价
  if (val === 0.00) {
    callback(new Error('请输入正确格式的单价'))
  } else if (!val) {
    callback(new Error('单价不能为空'))
  } else {
    callback()
  }
}
VerifyFunc.places = function (rule, val, callback) { // 校验单价
  if (val === 0.00) {
    callback(new Error('请输入正确格式的收款'))
  } else if (!val) {
    callback(new Error('住宿收款不能为空'))
  } else {
    callback()
  }
}

VerifyFunc.phone = function (rule, val, callback) { // 校验手机
  if (!val) return
  return /^1[3456789]\d{9}$/.test(val)
}

VerifyFunc.card = function (rule, val, callback) {
  // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
  let reg = /(^\d{15}$)|(^\d{17}(\d|X)$)/
  // (^\d{15}$)|(^\d{17}([0-9]|X)$)
  if (val && !reg.test(val)) {
    callback(new Error(`身份证格式不对`))
  } else {
    callback()
  }
}
var checkCode = function (val) {
  var p = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
  var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
  var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2]
  var code = val.substring(17)
  if (p.test(val)) {
    var sum = 0;
    for (var i = 0; i < 17; i++) {
      sum += val[i] * factor[i]
    }
    if (parity[sum % 11] == code.toUpperCase()) {
      return true
    }
  }
  return false
}
var checkDate = function (val) {
  var pattern = /^(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)$/
  if (pattern.test(val)) {
    var year = val.substring(0, 4);
    var month = val.substring(4, 6);
    var date = val.substring(6, 8);
    var date2 = new Date(year + "-" + month + "-" + date);
    if (date2 && date2.getMonth() == (parseInt(month) - 1)) {
      return true
    }
  }
  return false
}
var checkProv = function (val) {
  var pattern = /^[1-9][0-9]/;
  var provs = {
    11: "北京",
    12: "天津",
    13: "河北",
    14: "山西",
    15: "内蒙古",
    21: "辽宁",
    22: "吉林",
    23: "黑龙江 ",
    31: "上海",
    32: "江苏",
    33: "浙江",
    34: "安徽",
    35: "福建",
    36: "江西",
    37: "山东",
    41: "河南",
    42: "湖北 ",
    43: "湖南",
    44: "广东",
    45: "广西",
    46: "海南",
    50: "重庆",
    51: "四川",
    52: "贵州",
    53: "云南",
    54: "西藏 ",
    61: "陕西",
    62: "甘肃",
    63: "青海",
    64: "宁夏",
    65: "新疆",
    71: "台湾",
    81: "香港",
    82: "澳门"
  };
  if (pattern.test(val)) {
    if (provs[val]) {
      return true
    }
  }
  return false
}
var checkID = function (val) {
  if (checkCode(val)) {
    var date = val.substring(6, 14)
    if (checkDate(date)) {
      if (checkProv(val.substring(0, 2))) {
        return true
      }
    }
  }
  return false
}
VerifyFunc.newCard = function (val) {
  if (!val) return
  return !checkID(val)
}

VerifyFunc.number = function (rule, val, callback) { // 校验数字
  let regs = /^[0-9]*$/
  if (val && !regs.test(val)) {
    callback(new Error(`只能填写数字`))
  } else {
    if (val == 0) {
      callback(new Error(`仅限输入正数`))
    } else {
      callback()
    }
  }
}
VerifyFunc.qq = function (val) { // 校验QQ
  if (!val) return
  return  /^[1-9][0-9]{4,50}$/.test(val)
}
VerifyFunc.wx = function (val) { // 校验微信
  if (!val) return
  return /^([-_a-zA-Z0-9]{2,50})+$/.test(val)
}
VerifyFunc.chinese = function (rule, val, callback) { // 中文汉字
  let regs = /^[\u4E00-\u9FA5]+$/
  if (val && !regs.test(val)) {
    callback(new Error(`只能为中文`))
  } else {
    callback()
  }
}
VerifyFunc.email = function (rule, val, callback) { // 校验邮箱
  // eslint-disable-next-line
  var regs = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
  if (val && !regs.test(val)) {
    callback(new Error(`邮箱格式不对`))
  } else {
    callback()
  }
}
VerifyFunc.textNum = function (rule, val, callback) { // 校验文本字数
  if (val && val.length > 100) {
    callback(new Error(`文本不能超过100字`))
  } else {
    callback()
  }
}
VerifyFunc.money = function (rule, val, callback) { // 校验文本字数
  var reg = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/
  if (val && !reg.test(val)) {
    callback(new Error(`只能填写数字且最多保留小数点后2位数`))
  } else {
    if (!val) {
      callback(new Error(`请输入`))
    } else if (val == 0) {
      callback(new Error(`仅限输入正数，最多保留2位小数`))
    } else {
      callback()
    }
  }
}


VerifyFunc.newNumber = function (rule, val, callback) { // 校验数字
  let regs = /^[0-9]*$/
  if (val && !regs.test(val)) {
    callback(new Error(`只能正整数`))
  } else {
    if (val == 0) {
      callback(new Error(`仅限输入正数`))
    } else {
      callback()
    }
  }
}
VerifyFunc.validatorMoney = function (val, rule) { // 校验金额
  var reg = /^(([0-9]+)|([0-9]+\.[0-9]{0,2}))$/ 
  const { required } = rule
  return new Promise((resolve)=>{
      if(required){
        if(reg.test(val)){
          resolve(true)
        }else {
          resolve(false)
        }
      }else {
        resolve(true)
      }
  })
}


VerifyFunc.validatorNumber = function (val, rule) { // 校验数量
  const { required } = rule
  return new Promise(resolve => {
    if(required){
      if (val && /^[+]{0,1}(\d+)$/.test(val)) {
        resolve(true)
      } else {
        return resolve(false)
      }
    }else {
      resolve(true)
    }

  })
}


VerifyFunc.checkOrderAmount = function (rule, val, callback) { // 校验文本字数
  var reg = /^[0-9]+.?[0-9]*$/
  if (reg.test(val) && parseFloat(val) > 0) {
    callback()
  } else {
    callback(new Error(`请输入大于0的数字`))
  }
}
VerifyFunc.poPhone = function (val) { // 校验手机
  if (!val) return
  return /^1[3456789]\d{9}$/.test(val)
}

VerifyFunc.poQq = function (rule, val, callback) { // 校验QQ
  let regs = /^[1-9][0-9]{4,14}$/
  if (val && !regs.test(val)) {
    callback(new Error(`QQ号格式不对`))
  } else {
    callback()
  }
}

VerifyFunc.poWx = function (rule, val, callback) { // 校验微信
  let regs = /^([-_a-zA-Z0-9]{2,19})+$/
  if (val && !regs.test(val)) {
    callback(new Error(`微信格式不对`))
  } else {
    callback()
  }
}

VerifyFunc.rePhone = function (rule, val, callback) { // 校验手机
  let regs = /^1[3456789]\d{9}$/
  if (val && !regs.test(val)) {
    callback(new Error(`手机号格式不对`))
  } else {
    if (!val) {
      callback(new Error(`请输入手机号码`))
    } else {
      callback()
    }
  }
}

export default VerifyFunc