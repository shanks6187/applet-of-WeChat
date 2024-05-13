// pages/my_comments/index.js
const app = getApp();
const tools = require("../../utils/tools");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_id: 0,
    list: [],
    page: 1,
    total_count: 0
  },

  //数据列表
  lists() {
    var that = this;
    var page = this.data.page;
    var list = this.data.list;
    var order_id = this.data.order_id;
    tools.httpRequest('GET', '/api/mine/my_comment', {
      page: page,
      order_id: order_id
    }, function (res) {
      if (res.data.list.length > 0) {
        list.push(...res.data.list);
      }
      that.setData({
        total_count: res.data.total_count,
        list: list
      });
    })
  },

  //显示图片
  show_image(e) {
    wx.previewImage({
      urls: [e.currentTarget.dataset.url],
      current: e.currentTarget.dataset.url
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this;
    this.setData({
      order_id: options.order_id || 0
    }, function () {
      this.lists();
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
    var page = this.data.page;
    var list = this.data.list;
    var total_count = this.data.total_count;
    var that = this;
    if (total_count > list.length) {
      this.lists({
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