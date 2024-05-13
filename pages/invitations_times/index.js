// pages/invitations_times/index.js
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
    appoint_num:0
  },

  //次数
  lists() {
    var that = this;
    var page = this.data.page;
    var list = this.data.list;
    tools.httpRequest('GET', '/api/mine/appoint_list', {
      page: page
    }, function (res) {
      if (res.data.list.length > 0) {
        list.push(...res.data.list);
      }
      that.setData({
        list: list,
        total_count: res.data.total_count,
        appoint_num:res.data.appoint_num
      });
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.lists();
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
    var total_count = this.data.total_count;
    var list = this.data.list;
    if (total_count > list.length) {
      var that = this;
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
  onShareAppMessage() {

  }
})