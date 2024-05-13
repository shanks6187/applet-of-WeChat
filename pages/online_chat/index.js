// pages/online_chat/index.js
const app = getApp();
const tools = require("../../utils/tools");
var chat_index = null;
var auto_index = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lists: [],
    appoint_id: 0,
    order_id: 0,
    is_own: 0,
    my_user_id: 0,
    update_times: null,
    content: '',
    is_cancel_tips: false,
    change_tips: null, //修改时间 提示信息
    scrollTop: 0
  },
  //滚动条至最底部
  autoScroll() {
    var that = this
    let query = wx.createSelectorQuery()
    query.select('.container').boundingClientRect(res => {
      console.log('res', res)
      that.setData({
        scrollTop: res.height * 100
      })
    })
    query.exec(res => {})
  },
  /**
   * 聊天记录
   */
  chatList() {
    var that = this;
    tools.httpRequest('GET', '/api/chat/online_chat', {
      appoint_id: this.data.appoint_id,
      order_id: this.data.order_id
    }, function (res) {
      if (res.code == 1) {
        that.setData({
          lists: res.data.list,
          is_own: res.data.is_own || 0,
          my_user_id: res.data.my_user_id,
          update_times: res.data.update_times,
        });
        that.autoScroll();
        if (res.data.orderInfo.status == 6 && !that.data.is_cancel_tips) {
          that.setData({
            is_cancel_tips: true
          });
          tools.modal('邀约已取消，不再支持聊天', false);
        }
      }
    });
  },

  /**
   * 发送消息
   */
  sendMessage(e) {
    var content = e.detail.value;
    var that = this;
    if (!content) {
      tools.toast('请输入聊天内容');
    } else {
      tools.submitRequest(that, 'POST', '/api/chat/send_message', {
        appoint_id: this.data.appoint_id,
        order_id: this.data.order_id,
        content: content
      }, function (res) {
        that.setData({
          content: '',
        });
        that.autoScroll();
        if (res.code == 1) {
          that.chatList();
        } else {
          tools.modal(res.msg, false)
        }
      });
    }
  },

  //申请修改时间的提示
  change_time_tips() {
    var that = this;
    tools.httpRequest('GET', '/api/chat/change_times_tips', {
      order_id: this.data.order_id
    }, function (res) {
      if (res.code == 1) {
        that.setData({
          change_tips: res.data.info
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this;
    this.setData({
      appoint_id: options.appoint_id || 0,
      order_id: options.order_id || 0
    }, function () {
      that.chatList();
      that.change_time_tips();
      chat_index = setInterval(function () {
        that.chatList();
      }, 5000);
    });
    //自动刷新到底部
    auto_index = setInterval(function(){
      that.autoScroll();
      console.log(111);
    },1000);

  },

  /**
   * 同意修改时间
   */
  times_change(e) {
    var update_times = this.data.update_times;
    var status = e.currentTarget.dataset.status;
    var that = this;
    tools.submitRequest(this, 'POST', '/api/order/check_change_time', {
      times_id: update_times.id || 0,
      status: status
    }, function (res) {
      if (res.code == 1) {
        that.chatList();
      } else {
        tools.modal(res.msg, false);
      }
    });
    that.autoScroll();
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
    clearInterval(chat_index);
    clearInterval(auto_index);
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

  }
})