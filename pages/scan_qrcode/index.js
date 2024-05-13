// pages/scan_qrcode/index.js
const app = getApp();
const tools = require("../../utils/tools");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    qr_code: '',
  },

  scan_qrcode(){
    wx.scanCode({
      scanType: 'qrcode',
      success: e=>{
        tools.httpRequest('GET', `/api/${e.result}`, {

        }, function (res) {
          if (res.code == 1) {
            tools.toast('扫码成功');
          } else {
            tools.modal(res.msg, false)
          }
        });
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(111)
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