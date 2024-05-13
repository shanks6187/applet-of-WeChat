const app = getApp();

//请求方式封装
function _request(method = 'GET', url = '', data = {}, success, fail, complete) {
  if (url.indexOf('/') == 0) {
    url = app.globalData.api_url + url;
  }
  wx.request({
    url: url,
    data: data,
    method: method,
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'TOKEN': getCache('token') || '',
    },
    success: function (res) {
      (typeof success === 'function') && success(res.data);

    },
    fail: function (res) {
      toast('请求失败');
      (typeof fail === 'function') && fail(res.data);

    },
    complete: function (res) {
      if(res.statusCode == 401){
        //未登录 清楚可能存在的token信息
        delCache('token');
      }
      if(res.statusCode == 403){
        //账号拉黑
        modal(res.data.msg,false);
      }
      (typeof complete === 'function') && complete(res.data);
    }
  });
}

//数据请求
function httpRequest(method = 'GET', url = '', data = {}, success, fail, complete) {
  wx.showNavigationBarLoading();
  _request(method, url, data, function (res) {
    (typeof success === 'function') && success(res);
  }, function (res) {
    (typeof fail === 'function') && fail(res);
  }, function (res) {
    wx.hideNavigationBarLoading();
    (typeof complete === 'function') && complete(res);
  });
}

//数据提交
function submitRequest(that, method = 'GET', url = '', data = {}, success, fail, complete) {
  if(that.data.btnStatus){
    return false;
  }
  that.setData({
    btnStatus:true
  });
  wx.showNavigationBarLoading();
  _request(method, url, data, function (res) {
    (typeof success === 'function') && success(res);
  }, function (res) {
    (typeof fail === 'function') && fail(res);
  }, function (res) {
    that.setData({
      btnStatus:false
    });
    wx.hideNavigationBarLoading();
    (typeof complete === 'function') && complete(res);
  });
}

//文件上传 fileType 取值 image/video/audio

function fileUpload(filePath, url, success, fileType = 'image') {
  if (url.indexOf('/') == 0) {
    url = app.globalData.api_url + url;
  }
  wx.showLoading({
    title: '上传中...'
  })
  wx.uploadFile({
    url: url, //仅为示例，非真实的接口地址
    filePath: filePath,
    name: 'file',
    fileType: fileType,
    formData: {
      'user': 'test'
    },
    success: (res) => {
      typeof success === 'function' && success(JSON.parse(res.data));
    },
    fail: function (res) {
      toast('上传失败');
    },
    complete: function (res) {
      wx.hideLoading();
    }
  });
}

//选择文件
function chooseFile(count, success) {
  wx.chooseMedia({
    count: count > 9 ? 9 : count,
    mediaType: ['image', 'video'],
    sourceType: ['album', 'camera'],
    maxDuration: 30,
    camera: 'back',
    success(res) {
      let files = res.tempFiles;
      typeof success === 'function' && success(files);
    }
  })
}

//气泡提醒
function toast(msg) {
  wx.showToast({
    title: msg,
    icon: 'none',
  })
}

//弹窗提醒
function modal(content, showCancel = true,success, confirmText = '确定',  cancelText = '取消') {
  wx.showModal({
    title: '温馨提示',
    content: content || '确定此操作么？',
    showCancel: showCancel,
    cancelText: cancelText,
    confirmText: confirmText,
    success: function (res) {
      typeof success === 'function' && success(res);
    }
  })
}

//设置缓存
function setCache(key, value, expireTime = 0) {
  let field = app.globalData.cache_key + '_' + key;
  let timeStamp = (expireTime == 0) ? 0 : parseInt((new Date().getTime()) / 1000) + parseInt(86400 * expireTime);
  let data = {
    value: value,
    expireTime: timeStamp
  };
  return wx.setStorageSync(field, data);
}

//读取缓存
function getCache(key) {
  let field = app.globalData.cache_key + '_' + key;
  let value = wx.getStorageSync(field);
  if (value.expireTime == 0) {
    return value.value;
  } else {
    let timeStamp = parseInt((new Date().getTime()) / 1000);
    if (parseInt(timeStamp) > parseInt(value.expireTime)) {
      delCache(key);
      return null;
    }
    return value.value;
  }

}

//删除缓存
function delCache(key = '') {
  let field = app.globalData.cache_key + '_' + key;
  return wx.removeStorageSync(field);
}

//清楚缓存
function clearCache() {
  return wx.clearStorageSync();
}

//调用扫一扫
function scanCode(success, fail) {
  wx.scanCode({
    success: function (res) {
      typeof success === 'function' && success(res);
    },
    fail: function (res) {
      typeof fail === 'function' && fail(res);
    }
  })
}
// 处理图片
function showImage(image_path = '') {
  var image_url = "https://xilu-images.oss-cn-shanghai.aliyuncs.com";
  if (!image_path) {
      return '/static/images/avatar.png';
  } else if (image_path.indexOf("data:image") != -1) {
      return image_path;
  } else if (image_path.indexOf("http") == -1) {
      return image_url + image_path;
  } else {
      return image_path;
  }
}


module.exports = {
  httpRequest: httpRequest,
  submitRequest: submitRequest,
  fileUpload: fileUpload,
  chooseFile: chooseFile,
  toast: toast,
  modal: modal,
  setCache: setCache,
  getCache: getCache,
  delCache: delCache,
  clearCache: clearCache,
  showImage: showImage,
  scanCode: scanCode
}