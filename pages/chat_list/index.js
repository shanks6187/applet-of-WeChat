// pages/chat_list/index.js
const app = getApp();
const tools = require("../../utils/tools");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false,
    showAuth: false,
    list: [],
    show_time: false,
    appoint_id: 0,
    order_id: 0,
    show_cancel: false,
    is_cancel_return: false,
    timer: null,
    timer2: null,
    timer_count: 0,
    timer_max_count: 10,
    timer_count_down: 4000, // 毫秒
  },

  onTabItemTap(e){
    this.href_qrCode()
  },
  href_qrCode(){
    const that = this
    let count = that.data.timer_count+1
    that.setData({
      timer_count: count,
    })
    if (!that.data.timer ) {
      that.data.timer = setInterval(()=>{
        if (count >= that.data.timer_max_count) {
          clearInterval(that.data.timer)
          clearInterval(that.data.timer2)
          that.setData({
            timer: null,
            timer2: null,
            timer_count: 0,
          })
          wx.navigateTo({
            url: '../scan_qrcode/index'
          })
        }
      },1000)
      that.data.timer2 = setTimeout(()=>{
        clearInterval(that.data.timer)
        clearInterval(that.data.timer2)
        if (this.data.timer_count>=that.data.timer_max_count){
          that.setData({
            timer: null,
            timer2: null,
            timer_count: 0,
          })
          wx.navigateTo({
            url: '../scan_qrcode/index'
          })
        } else {
          that.setData({
            timer: null,
            timer2: null,
            timer_count: 0,
          })
        }
      },that.data.timer_count_down)
    } else {
      if (count >= that.data.timer_max_count) {
        clearInterval(that.data.timer)
        clearInterval(that.data.timer2)
        that.setData({
          timer: null,
          timer2: null,
          timer_count: 0,
        })
        wx.navigateTo({
          url: '../scan_qrcode/index'
        })
      }
    }
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
    this.setData({
      showAuth: false,
    });
    this.chatList();
  },

  /**
   * 聊天列表
   */
  chatList() {
    var that = this;
    tools.httpRequest('GET', '/api/chat/index', {
      lat: app.globalData.lat,
      lng: app.globalData.lng
    }, function (res) {
      if (res.code == 1) {
        that.setData({
          list: res.data.list || [],
        });
      }
    });
  },

  //打开地图
  openLocation(e) {
    app.openLocation(e.currentTarget.dataset.lat, e.currentTarget.dataset.lng);
  },

  //确认赴约
  sure_appoint(e) {
    var that = this;
    tools.modal('确认赴约么？', true, function (ret) {
      if (ret.confirm) {
        tools.submitRequest(that, 'POST', '/api/order/sureOrder', {
          order_id: e.currentTarget.dataset.id,
          lat: app.globalData.lat,
          lng: app.globalData.lng
        }, function (res) {
          if (res.code == 1) {
            that.setData({
              list: []
            }, function () {
              that.chatList();
            });
          } else {
            tools.modal(res.msg, false);
          }
        });
      }
    });
  },

  //取消订单
  toggleCancel(e) {
    this.setData({
      show_cancel: !this.data.show_cancel,
      appoint_id: e.currentTarget.dataset.appointid,
      order_id: e.currentTarget.dataset.orderid,
      is_cancel_return: e.currentTarget.dataset.sure
    });
  },
  //取消成功回调
  cancelConfirm() {
    var that = this;
    this.setData({
      show_cancel: !this.data.show_cancel,
      appoint_id: 0,
      order_id: 0,
      is_cancel_return: false,
      list: [],
    }, function () {
      that.chatList();
    });
  },

  //修改时间
  show_time(e) {
    var params = e.currentTarget.dataset.params;
    this.setData({
      show_time: !this.data.show_time,
      timesList: params.appoint.time_list || [],
      appoint_id: params.appoint.id || 0,
      order_id: params.id || 0
    });
  },

  //关闭时间弹窗
  show_change_time(e) {
    this.setData({
      show_time: !this.data.show_time,
    });
  },
  //时间弹窗修改成功
  show_com_change_time() {
    var that = this;
    this.setData({
      show_time: !this.data.show_time,
      listt: []
    }, function () {
      that.chatList();
    });
  },

  //提醒对方赴约
  sure_appoint_two(e) {
    var that = this;
    tools.modal('对方是否到达？', true, function (ret) {
      if (ret.confirm) {
        tools.submitRequest(that, 'POST', '/api/order/order_tips', {
          order_id: e.currentTarget.dataset.id,
          lat: app.globalData.lat,
          lng: app.globalData.lng
        }, function (res) {
          if (res.code == 1) {
            that.setData({
              list: []
            }, function () {
              that.chatList();
            });
          } else {
            tools.modal(res.msg, false);
          }
        });
      }
    });
  },

  /**
   * 聊天
   */
  detail(e) {
    var appoint_id = e.currentTarget.dataset.id;
    var order_id = e.currentTarget.dataset.orderid;
    wx.navigateTo({
      url: '../online_chat/index?appoint_id=' + appoint_id + '&order_id=' + order_id,
    })
  },

  //写评价
  to_comment(e) {
    wx.navigateTo({
      url: '../questionnaire/index?order_id=' + e.currentTarget.dataset.id,
    })
  },

  //查看评价
  to_comment_info(e) {
    wx.navigateTo({
      url: '../my_comments/index?order_id=' + e.currentTarget.dataset.id,
    })
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
    this.setData({
      showAuth: isLogin ? false : true
    });
    if (isLogin) {
      this.chatList();
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
    var that = this;
    this.setData({
      list: []
    }, function () {
      that.chatList();
      wx.stopPullDownRefresh();
    });
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