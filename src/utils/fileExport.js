import download from './download.js'

/*
        * 使用download.js 强制浏览器下载图片、视频等文件
        * @param {any} url url链接地址
        * @param {any} strFileName 文件名
        * @param {any} strMimeType 文件类型
        * dzl
        * 2020年5月8日
         */
export function downloadfile(url, strFileName, strMimeType) {
  var xmlHttp = null
  if (window.ActiveXObject) {
    // IE6, IE5 浏览器执行代码
    xmlHttp = new ActiveXObject('Microsoft.XMLHTTP')
  }
  else if (window.XMLHttpRequest) {
    // IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
    xmlHttp = new XMLHttpRequest()
  }
  //2.如果实例化成功，就调用open（）方法：
  if (xmlHttp != null) {
    xmlHttp.open('get', url, true)
    xmlHttp.responseType = 'blob' //关键
    xmlHttp.send()
    xmlHttp.onreadystatechange = doResult //设置回调函数
  }
  function doResult() {
    if (xmlHttp.readyState == 4) {
      //4表示执行完成
      if (xmlHttp.status == 200) {
        //200表示执行成功
        download(xmlHttp.response, strFileName, strMimeType)
      }
    }
  }
}
