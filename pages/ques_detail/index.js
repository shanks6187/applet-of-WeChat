// pages/ques_detail/index.js
const app = getApp();
const tools = require("../../utils/tools");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: null,
    content: null
  },

  /**
   * 详情
   */
  infos(id = 0, cms_type = 3) {
    var that = this;
    tools.httpRequest('GET', '/api/index/cms_detail', {
      id: id,
      cms_type: cms_type
    }, function (res) {
      var html_content = JSON.stringify(res.data.info.content).replace(/<img/gi, "<img class='richImg' style = 'height:auto!important;max-height:100%;width:100%;'");
      that.setData({
        info: res.data.info,
        content: JSON.parse(html_content)
      });
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.infos((options.id || 0),(options.cms_type || 3));
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

  }
})