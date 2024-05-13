// pages/mine/index.js
const app = getApp();
const tools = require("../../utils/tools");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pop1: false,
    pop3: false,
    isLogin: false,
    showAuth: false,
    userInfo: null,
  },

  //显示评价次数
  togglePop1() {
    this.setData({
      pop1: !this.data.pop1
    })
  },

  //显示问卷弹窗
  togglePop3() {
    this.setData({
      pop3: !this.data.pop3
    })
  },

  //去写评价
  to_comment() {
    var that = this;
    that.setData({
      pop1: false
    }, function () {
      wx.navigateTo({
        url: '../my_appoint/index?status=4'
      })
    })
  },

  //点击登录
  userLogin() {
    this.setData({
      showAuth: true
    });
  },
  //取消授权
  authClose() {
    tools.toast('拒绝授权会导致部分功能不能用哦～');
    this.setData({
      showAuth: false
    });
  },
  //授权成功
  authConfirm() {
    var isLogin = tools.getCache('token');
    var that = this;
    if (isLogin) {
      this.setData({
        isLogin: true,
      }, function () {
        that.getUserInfo();
      });
    }
  },

  //获取个人信息
  getUserInfo() {
    var that = this;
    tools.httpRequest('GET', '/api/mine/index', {}, function (res) {
      if (res.code == 1) {
        that.setData({
          userInfo: res.data.info
        });
        // if(res.data.info.is_auth == 0){
        //   tools.modal('请先登陆搭翎小程序',false,function(){
        //     wx.navigateTo({
        //       url: '../perfect_info/index',
        //     })
        //   },'去注册');
        // }
      }
    });
  },

  //个人资料
  userSetting() {
    wx.navigateTo({
      url: '../perfect_info/index',
    })
  },

  //跳转小程序
  redirectMi(){
    tools.toast('跳转第三方小程序，待接入');
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    var isLogin = tools.getCache('token');
    var that = this;
    if (isLogin) {
      this.setData({
        isLogin: true
      }, function () {
        that.getUserInfo();
      });
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '找搭子上搭翎，让真实见面成为可能'
    }
  }
})