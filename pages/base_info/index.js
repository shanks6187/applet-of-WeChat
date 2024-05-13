// pages/base_info/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ageArr: [18, 19, 20],
    ageIdx: -1,
    home:[],
    hobbyPop:false,
    headPop:false
  },
  toggleheadPop(){
    this.setData({
      headPop:!this.data.headPop
    })
  },
  toggleHobby(){
    this.setData({
      hobbyPop:!this.data.hobbyPop
    })
  },
  homeChange(e){
    this.setData({
      home:e.detail.value
    })
  },
  ageChange(e) {
    this.setData({
      ageIdx: e.detail.value
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