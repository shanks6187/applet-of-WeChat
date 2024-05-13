// components/u-authorize/index.js
const tools = require("../../utils/tools");
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    is_getphone: {
      type: Boolean,
      value: false
    },

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  created() {
    this.checkSession();
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onCancel() {
      this.triggerEvent('close');
    },
    onConfirm(event) {
      this.triggerEvent('confirm', event.detail);
    },
    // 获取用户信息
    bindGetUserInfo(e) {
      var that = this;
      if (e.detail.errMsg == 'getUserInfo:fail auth deny') {
        wx.showModal({
          title: '温馨提示',
          content: '您已拒绝授权，无法获取用户信息！',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              var user = app.globalData.userInfo
              if (user.mobile) {
                that.triggerEvent('close', {});

              } else {
                that.setData({
                  is_getphone: true
                })
              }
            }
          }
        });
        return;
      } else {
        that.triggerEvent('close', {});
      }
    },
    getUserProfile(e) {
      var that = this
      that.setData({
        show: false
      })
      functions.checkLogin(function (res) {
        if (res) {
          that.triggerEvent('confirm', res);
          // console.log('checkLogin',res)
        }
      })
    },
    // 获取手机号
    bindGetPhoneNumber(e) {
      var that = this;
      // console.log(e) 
      if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
        wx.showModal({
          title: '温馨提示',
          content: '您已拒绝授权，无法获取手机号！',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              that.triggerEvent('close');
              // that.triggerEvent('close', {});
            }
          }
        });
        return false;
      } else {
        var wxLoginInfo = tools.getCache('wxLoginInfo');
        that.decodeMobile(e.detail.encryptedData, e.detail.iv, wxLoginInfo.session_key, wxLoginInfo.openid);
      }
    },

    //解析手机号
    decodeMobile(encryptedData, iv, sessionKey, openid) {
      var that = this;
      tools.httpRequest('POST', '/api/login/infoDecode', {
        encryptedData: encryptedData,
        iv: iv,
        sessionKey: sessionKey
      }, function (res) {
        if (res.code == 1) {
          that.loginRegister(res.data.phoneNumber, openid);
        } else {
          tools.modal(res.msg || '授权失败', false)
        }
      }, function () {
        tools.modal('授权失败', false)
      });
    },

    //用户注册并登录
    loginRegister(mobile, openid) {
      var that = this;
      var wxLoginInfo = tools.getCache('wxLoginInfo');
      tools.submitRequest(this, 'POST', '/api/login/loginRegister', {
        mobile: mobile,//'13641827448',//mobile
        openid: openid,
        unionid:wxLoginInfo.unionid || ''
      }, function (res) {
        if (res.code == 1) {
          tools.setCache('token', res.data.token, 365);
          that.triggerEvent('confirm', {});
        } else {
          that.triggerEvent('close');
          tools.modal('登陆注册失败', false)
        }
      }, function () {
        tools.modal('登陆注册失败', false)
      });
    },

    //微信登录
    wxLogin() {
      var that = this;
      wx.login({
        success: function (res) {
          if (res.code) {
            that.getOpenId(res.code);
          }
        },
      })
    },

    //获取微信openid
    getOpenId(code) {
      tools.httpRequest("GET", "/api/login/getOpenid", {
        code: code
      }, function (res) {
        if (res.code == 1) {
          tools.setCache('wxLoginInfo', res.data);
          app.globalData.openid = res.data.openid;
        }
      });
    },

    //检查微信wx.login
    checkSession() {
      var that = this;
      wx.checkSession({
        success: function (res) {
          var wxLoginInfo = tools.getCache('wxLoginInfo');
          if (!wxLoginInfo) {
            that.wxLogin();
          } else {
            app.globalData.openid = wxLoginInfo.openid;
          }
        },
        fail: (res) => {
          that.wxLogin();
        },
      })
    },


  }
})