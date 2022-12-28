import lrz from 'lrz'
import store from '@/store'

export function setAccessToken(AccessToken) {
  return new Promise(resolve => {
    window.localStorage.setItem("accessToken", AccessToken);
    resolve();
  });
}

export function removeAccessToken() {
  return new Promise(resolve => {
    window.localStorage.removeItem("userInfo");
    // 这个点我修改过记得删除
    window.localStorage.removeItem("accessToken");
    window.localStorage.removeItem("currentSystem");
    resolve();
  });
}

export function setLocalStorage(name, value) {
  return new Promise(resolve => {
    window.localStorage.setItem(name, value);
    resolve();
  });
}

export function getLocalStorage(value) {
  return new Promise(resolve => {
    resolve(window.localStorage.getItem(value));
  });
}

export function getScrollTop() {
  // 获取滚动高度
  return new Promise(resolve => {
    let scrollTop = 0;
    let bodyScrollTop = 0;
    let documentScrollTop = 0;
    if (document.body) {
      bodyScrollTop = document.body.scrollTop;
    }
    if (document.documentElement) {
      documentScrollTop = document.documentElement.scrollTop;
    }
    scrollTop =
      bodyScrollTop - documentScrollTop > 0 ? bodyScrollTop : documentScrollTop;
    resolve(scrollTop);
  });
}

export function debounceFun(func, wait = 500, immediate = true) {
  let timer = null
  return function (...args) {
    const ctx = this
    if (timer) clearTimeout(timer)
    if (immediate) {
      const isTimer = !timer
      timer = setTimeout(() => {
        timer = null
      }, wait)
      if (isTimer) func.apply(ctx, args)
    } else {
      timer = setTimeout(() => {
        func.apply(ctx, args)
      }, wait)
    }
  }
}
export function throttle(func, wait = 1000, ctx) { // 节流
  let timer = null
  let startTime
  return function (...args) {
    const now = +new Date()
    if (startTime && now < startTime + wait) {
      clearTimeout(timer)
      timer = setTimeout(function () {
        startTime = now
        func.apply(ctx, args)
      }, wait)
    } else {
      startTime = now
      func.apply(ctx, args)
    }
  }
}

// 院校库数据编辑处理函数
export function commonSchoolInfohandle(data, dataName) {
  // dataName = schoolListNot 为不需要拼接属性
  let obj = data || {}
  if (!data) {
    if (['schoolList', 'schoolListNot', 'facultyIdAndMajorList'].includes(dataName)) {
      return []
    } else {
      return {}
    }
  }
  if (dataName === 'education') return obj.entity || {}
  else if (dataName === 'school') return obj.extend[2] || {}
  else if (dataName === 'faculty') return obj.extend[3] || {}
  else if (dataName === 'major') return obj.extend[4] || {}
  else if (dataName === 'facultyIdAndMajor') {
    if (data.extend[4]) return data.extend[4]
    else if (data.extend[3]) return data.extend[3]
    else if (data.extend[2]) return {
      text: '未知',
      value: -1
    }
    return obj
  } else if (dataName === 'schoolList') {
    if (obj.extend[2]) return [{
      text: data.extend[2].text,
      value: data.extend[2].value
    }]
    else return []
  } else if (dataName === 'activitySchoolListNot') {
    if (obj.extend[2]) return [{
      text: data.extend[2].text,
      value: data.extend[2].value
    }]
    else return []
  } else if (dataName === 'schoolListNot') {
    if (obj.extend[2]) return [{
      text: data.extend[2].text.replace(/\(.*?\)/g, ''),
      value: data.extend[2].value
    }]
    else return []
  } else if (dataName === 'facultyIdAndMajorList') {
    if (obj.extend[4]) return [{
      text: data.extend[3].text + '/' + data.extend[4].text,
      value: data.extend[4].value
    }]
    else if (obj.extend[3]) return [{
      text: data.extend[3].text,
      value: data.extend[3].value
    }]
    else if (obj.extend[2]) return [{
      text: '未知',
      value: -1
    }]
    else return []
  }
}


export function SplicingDatahandel(data, dataName = 'schoolName') {
  if (!data) return null
  let splicingData = ''
  let obj = {}
  let arrData = Object.keys(data)
  for (let index = 0; index < arrData.length; index++) {
    const element = arrData[index]
    if (data[element] !== '-') {
      splicingData += '/' + data[element].text
    }
  }
  return obj[dataName] = arrData.length === 1 ? splicingData.slice(1) + '/未知' : splicingData.slice(1)
}

export function transform(data) {
  return new Promise(async resolve => {
    let fr = new FileReader()
    fr.onload = () => {
      resolve(JSON.parse(fr.result))
    }
    fr.readAsText(data, ['utf-8'])
  })
}


export function dayTextFormatter(day) {
  if (day.type === 'start') {
    day.bottomInfo = '起'
  } else if (day.type === 'end') {
    day.bottomInfo = '止'
  } else if (day.type === 'start-end') {
    day.bottomInfo = '起/止'
  }
  return day
}

export function dataURLtoFile(dataurl, filename) { // 将base64转换为文件
  let arr = dataurl.split(',')
  let mime = arr[0].match(/:(.*?);/)[1]
  let bstr = atob(arr[1])
  let n = bstr.length
  let u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, {
    type: mime
  })
}

export function compressFile(file) { // 上传文件压缩
  return new Promise((resolve, reject) => {
    if (file.size / 1024 / 1024 > 10) {
      this.$fm(`图片[${file.name}] 超过10M，请压缩后上传`)
      return reject(false)
    }
    if (file.size / 1024 / 1024 <= 1) {
      resolve(file)
    } else {
      lrz(file, {
        width: 1000,
        quality: 0.8,
        fieldName: file.name
      }).then((rst) => {
        resolve(dataURLtoFile(rst.base64, file.name)) // 将base64转换为文件
      }).catch(err => {
        this.$fm('上传失败')
        reject(err)
      })
    }
  })
}

function menuDeep(list, code, info) {
  for (let index = 0; index < list.length; index++) {
    const element = list[index];
    if (element.attributes && element.attributes.perms === code) {
      info.element = {
        ...element
      }
      return element
    } else if (element.children && element.children.length) {
      menuDeep(element.children, code, info)
    }
  }
}

export function menuPermissionUtil(permissionCode) {
  let info = {
    element: null
  }
  menuDeep(store.state.common.setting.allMenu, permissionCode, info)
  return !!info.element
}

// 数字精度处理（保留几位小数）
export function _toFixed(num, precision = 2, symbol = '') {
  if (typeof num !== 'number') return
  if (num === 0) return `0${symbol}`
  const dividend = Math.pow(10, precision)
  const result = (Math.round(num * dividend) / dividend).toFixed(precision)
  return `${result}${symbol}`
}