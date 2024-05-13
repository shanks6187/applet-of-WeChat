// pages/notification/index.js
const app = getApp();
const tools = require("../../utils/tools");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    page: 1,
    total_count: 0,
    isSelectTime: false,
    show_time: false,
    timeList: [], //时间列表
    appoint_id: 0,
    order_id: 0,
    show_cancel: false,
    is_cancel_return: false,
    showQrCodeModal: false,
    QrCode: '',
    current_appoint_type: 1,
  },

  //数据列表
  lists() {
    var that = this;
    var page = this.data.page;
    var list = this.data.list;
    tools.httpRequest('GET', '/api/message/index', {
      page: page,
      lat: app.globalData.lat,
      lng: app.globalData.lng
    }, function (res) {
      if (res.data.list.length > 0) {
        list.push(...res.data.list);
      }
      that.setData({
        total_count: res.data.total_count,
        list: list
      });
    });
  },

  //打开地图
  openLocation(e) {
    app.openLocation(e.currentTarget.dataset.lat, e.currentTarget.dataset.lng);
  },

  //搭子时间修改
  toggleTime(e) {
    this.setData({
      isSelectTime: !this.data.isSelectTime,
      appoint_id: e.currentTarget.dataset.id || 0,
    })
  },
  //搭子时间修改回调
  da_change_time() {
    var that = this;
    this.setData({
      isSelectTime: !this.data.isSelectTime,
      list: [],
      page: 1,
      total_count: 0,
      appoint_id: 0,
      order_id: 0,
      is_cancel_return: false,
    }, function () {
      that.lists();
    });
  },

  //取消订单
  toggleCancel(e) {
    this.setData({
      current_appoint_type: e.currentTarget?.dataset?.item?.appoint?.appoint_type || 1,
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
      current_appoint_type: 1,
      show_cancel: !this.data.show_cancel,
      appoint_id: 0,
      order_id: 0,
      is_cancel_return: false,
      list: [],
      page: 1,
      total_count: 0
    }, function () {
      that.lists();
    });
  },

  //确认赴约
  sure_appoint(e) {
    var that = this;
    if (e.currentTarget.dataset.item?.appoint?.appoint_type == 2){
      tools.httpRequest('GET', '/api/message/getQRCode', {
        order_no: e.currentTarget.dataset.item?.order?.order_no,
        lat: app.globalData.lat,
        lng: app.globalData.lng
      }, function (res) {
        if (res.code == 1) {
          that.setData({
            showQrCodeModal: true,
            QrCode: res.data.url
          })
        }
      });
      return
    }

    tools.modal('确认赴约么？', true, function (ret) {
      if (ret.confirm) {
        tools.submitRequest(that, 'POST', '/api/order/sureOrder', {
          order_id: e.currentTarget.dataset.id,
          lat: app.globalData.lat,
          lng: app.globalData.lng
        }, function (res) {
          if (res.code == 1) {
            that.setData({
              list: [],
              page: 1,
              total_count: 0
            }, function () {
              that.lists();
            });
          } else {
            tools.modal(res.msg, false);
          }
        });
      }
    });
  },

  hideModal(e) {
    var that = this;
    that.setData({
      showQrCodeModal: false,
      QrCode: '',
    })
  },
  

  //修改时间
  show_time(e) {
    var params = e.currentTarget.dataset.params;
    this.setData({
      show_time: !this.data.show_time,
      timesList: params.appoint.time_list || [],
      appoint_id: params.appoint.id || 0,
      order_id: params.order.id || 0
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
      list: [],
      page: 1,
      total_count: 0
    }, function () {
      that.lists();
    });
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

  //订单详情
  orderDetail(e) {
    if (e.currentTarget.dataset.appoint_type === 2){
      wx.navigateTo({
        url: '../task_detail/index?id=' + e.currentTarget.dataset.id + '&order_id=' + e.currentTarget.dataset.orderid,
      })
    } else {
      wx.navigateTo({
        url: '../appoint_detail/index?id=' + e.currentTarget.dataset.id + '&order_id=' + e.currentTarget.dataset.orderid,
      })
    }
  },

  /**
   * 刷新数据
   */
  reFresh(params) {
    console.log('refresh', params);
    var that = this;
    this.setData({
      list: [],
      page: 1,
      total_count: 0,
    }, function () {
      that.lists();
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
              list: [],
              page: 1,
              total_count: 0
            }, function () {
              that.lists();
            });
          } else {
            tools.modal(res.msg, false);
          }
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.lists();
    app.eventBus.on('reFresh', this.reFresh(), this);
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
    var that = this;
    if (this.data.list.length > 0) {
      this.setData({
        list: [],
        page: 1,
        total_count: 0
      }, function () {
        that.lists();
      });
    }

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    app.eventBus.off('reFresh', this.reFresh(), this);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    var that = this;
    this.setData({
      list: [],
      page: 1,
      total_count: 0
    }, function () {
      that.lists();
      wx.stopPullDownRefresh();
    });

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    var page = this.data.page;
    var total_count = this.data.total_count;
    var list = this.data.list;
    var that = this;
    if (total_count > list.length) {
      this.setData({
        page: page + 1
      }, function () {
        that.lists();
      });
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage(e) {
    var title = e.target.dataset.name;
    var id = e.target.dataset.id || 0;
    return {
      title: '找搭子上搭翎，让真实见面成为可能',
      path: '/pages/invitation_detail/index?id=' + id
    }
  }
})