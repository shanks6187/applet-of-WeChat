const tools = require("../../utils/tools");

// pages/cash/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money:0,
    amount:0,
    tips:[],
  },

  //输入金额
  input_amount(e){
    this.setData({
      amount:e.detail.value || 0
    });
  },

  //确认提现
  addCash(){
    var money = this.data.money;
    var amount = this.data.amount;
    var that = this;
    if(!amount){
      tools.toast('请输入提现金额');
    } else if(parseFloat(amount) > parseFloat(money)){
      tools.toast('金额不足');
    } else {
      tools.submitRequest(that,'POST','/api/mine/add_cash',{
        amount:amount
      },function(res){
        if(res.code == 1){
          wx.navigateBack({
            delta: 0,
          })
        } else {
          tools.modal(res.msg || '提现失败',false);
        }
      });
    }
  },

  //提现规则
  tips_rule(){
    var that = this;
    tools.httpRequest('GET','/api/mine/add_cash',{},function(res){
      if(res.code == 1){
        that.setData({
          tips:res.data.tips || []
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this;
    var eventChannel = this.getOpenerEventChannel();
    eventChannel.on('userAccount',function(params){
      that.setData({
        money:params.money || 0
      });
    });
    this.tips_rule();
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