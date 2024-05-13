// pages/my_account/index.js
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
    money: 0,
  },

  //数据
  lists() {
    var that = this;
    var page = this.data.page;
    var list = this.data.list;
    tools.httpRequest('GET', '/api/mine/my_account', {
      page: page
    }, function (res) {
      if (res.data.list.length > 0) {
        list.push(...res.data.list);
      }
      that.setData({
        list: list,
        total_count: res.data.total_count,
        money: res.data.money
      });
    });
  },

  //提现
  add_withdraw() {
    var that = this;
    wx.navigateTo({
      url: '../cash/index',
      success: function (res) {
        res.eventChannel.emit('userAccount', {
          money: that.data.money
        });
      }
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
    var that = this;
    this.setData({
      page: 1,
      list: [],
      total_count: 0
    }, function () {
      that.lists();
    });
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
    var list = this.data.list;
    var page = this.data.page;
    var total_count = this.data.total_count;
    var that = this;
    if (total_count > list.length > 0) {
      that.setData({
        page: page + 1
      }, function () {
        that.lists();
      });
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})