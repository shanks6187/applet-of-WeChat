// pages/restaurant_detail/index.js
const app = getApp();
const tools = require("../../utils/tools");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: null,
    image_list: [],
  },

  /**
   * 餐厅详情
   */
  infos(id,c_id) {
    var that = this;
    tools.httpRequest('GET', '/api/index/restaurant_info', {
      id: id,
      c_id:c_id,
      lat: app.globalData.lat,
      lng: app.globalData.lng
    }, function (res) {
      that.setData({
        info: res.data.info,
        image_list: res.data.images_list
      });
    });
  },

  //作品详情
  show_image(e) {
    wx.previewImage({
      urls: [e.currentTarget.dataset.url],
      current: e.currentTarget.dataset.url
    })
  },

  //导航
  openLocation(e) {
    app.openLocation(e.currentTarget.dataset.lat, e.currentTarget.dataset.lng);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.infos((options.id || 0),(options.c_id || 0));
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