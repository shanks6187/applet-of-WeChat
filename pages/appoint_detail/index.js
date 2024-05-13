// pages/appoint_detail/index.js
const app = getApp();
const tools = require("../../utils/tools");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pop1: false,
    pop2: false,
    pop3: false,
    isShowTip: false,
    appoint_id: 0, //搭子id
    order_id: 0, //订单id
    info: null, //搭子/订单详情
    money_tip: null, //金额提示
    timesList: [], //修改时间列表
    show_time: false,
    is_back:'',
  },
  toggleTip() {
    this.setData({
      isShowTip: !this.data.isShowTip
    })
  },
  togglePop1() {
    this.setData({
      pop1: !this.data.pop1
    })
  },

  togglePop3() {
    this.setData({
      pop3: !this.data.pop3
    })
  },


  //显示/关闭修改时间
  show_change_time() {
    this.setData({
      show_time: !this.data.show_time,
    });
  },

  //搭子时间修改成功
  appoint_update_time() {
    this.setData({
      show_time: !this.data.show_time,
    });
    this.appoint_infos(this.data.appoint_id);
  },

  //搭子取消成功
  cancelConfirm(params) {
    this.setData({
      pop1: !this.data.pop1
    })
    if (this.data.order_id > 0) {
      this.order_infos(this.data.order_id);
    } else {
      this.appoint_infos(this.data.appoint_id);
    }
  },

  //确认赴约
  sure_appoint(e) {
    var that = this;
    tools.modal('确认赴约么？', true, function (ret) {
      if (ret.confirm) {
        tools.submitRequest(that, 'POST', '/api/order/sureOrder', {
          order_id: e.currentTarget.dataset.id,
          lat:app.globalData.lat,
          lng:app.globalData.lng
        }, function (res) {
          if (res.code == 1) {
            that.order_infos(e.currentTarget.dataset.id);
          } else {
            tools.modal(res.msg, false);
          }
        });
      }
    });
  },

  /**
   * 搭子详情
   */
  appoint_infos(id) {
    var that = this;
    tools.httpRequest('GET', '/api/appoint/detail', {
      id: id,
      lat: app.globalData.lat,
      lng: app.globalData.lng
    }, function (res) {
      if (res.code == 1) {
        that.setData({
          info: res.data.info,
          money_tip: res.data.money_tip,
          timesList: res.data.timesList
        });
      }
    });
  },

  /**
   * 订单详情
   */
  order_infos(id) {
    var that = this;
    tools.httpRequest('GET', '/api/order/orderDetail', {
      id: id,
      lat: app.globalData.lat,
      lng: app.globalData.lng
    }, function (res) {
      if (res.code == 1) {
        that.setData({
          info: res.data.info,
          money_tip: res.data.money_tip
        });
      }
    });
  },

  //打开地图
  openLocation(e) {
    app.openLocation(e.currentTarget.dataset.lat, e.currentTarget.dataset.lng);
  },

  //写评价
  to_comment(e) {
    wx.navigateTo({
      url: '../questionnaire/index?order_id='+e.currentTarget.dataset.id,
    })
  },

  //查看评价
  to_comment_info(e) {
    wx.navigateTo({
      url: '../my_comments/index?order_id='+e.currentTarget.dataset.id,
    })
  },

   /**
   * 聊天
   */
  online_chat(e) {
    var appoint_id = e.currentTarget.dataset.appointid;
    var order_id = e.currentTarget.dataset.orderid;
    wx.navigateTo({
      url: '../online_chat/index?appoint_id=' + appoint_id + '&order_id=' + order_id,
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this;
    var order_id = options.order_id || 0;
    var appoint_id = options.id || 0
    this.setData({
      order_id: order_id,
      appoint_id: appoint_id,
      is_back:options.is_back || ''
    }, function () {
      if (order_id > 0) {
        that.order_infos(order_id);
      } else {
        that.appoint_infos(appoint_id);
      }
    });
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
    if(this.data.is_back == 'mine'){
      wx.switchTab({
        url: '../mine/index',
      })
    }
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
    var title = this.data.info.restaurant.restaurant_name;
    var id = this.data.info.id || 0;
    return {
      title: '找搭子上搭翎，让真实见面成为可能',
      path: '/pages/invitation_detail/index?id=' + id
    }
  }
})