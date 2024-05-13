// pages/invitation_detail/index.js
const app = getApp();
const tools = require('../../utils/tools');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    isShowTip: false,
    infos: null, //预约详情
    money_tip: null, //配置项
    choose_time: '',
    showAuth: false,
    submitStatus: false,
    show_share: 0,
    is_tiped: false,
    is_auth: 0
  },

  //取消授权
  authClose() {
    tools.toast('拒绝授权会导致部分功能不能用哦～');
    this.setData({
      showAuth: false
    });
    this.getLocation(this.data.id)
  },
  //授权成功
  authConfirm() {
    var isLogin = tools.getCache('token');
    if (isLogin) {
      this.setData({
        showAuth: false,
      });
      this.getLocation(this.data.id)
    }
  },

  //显示邀约定金提示
  toggleTip() {
    this.setData({
      isShowTip: !this.data.isShowTip
    })
  },
  //获取定位
  getLocation(id) {
    var that = this;
    var lat = app.globalData.lat;
    var lng = app.globalData.lng;
    if (!lat || !lng) {
      wx.getLocation({
        type: 'gcj02',
        success: function (res) {
          app.globalData.lat = res.latitude;
          app.globalData.lng = res.longitude;
          that.infos(id, res.latitude, res.longitude);
        },
        fail: function () {
          that.infos(id, app.globalData.lat, app.globalData.lng);
        }
      })
    } else {
      that.infos(id, lat, lng);
    }
  },

  /**
   * 邀约详情
   */
  infos(id, lat, lng) {
    var that = this;
    var is_tiped = this.data.is_tiped;
    tools.httpRequest('GET', '/api/appoint/detail', {
      id: id,
      lat: lat,
      lng: lng
    }, function (res) {
      if (res.code == 1) {
        that.setData({
          infos: res.data.info,
          timesList: res.data.timesList,
          money_tip: res.data.money_tip,
          show_share: res.data.show_share,
          is_auth: res.data.is_auth || 0
        });
        if (res.data.is_auth == 0) {
          if (!is_tiped) {
            tools.modal('请先登陆搭翎小程序', false, function () {
              that.setData({
                is_tiped: true
              });
              wx.navigateTo({
                url: '../perfect_info/index',
              })
            }, '去注册');
          }

        }
      }
    });
  },

  //打开地图
  openLocation(e) {
    app.openLocation(e.currentTarget.dataset.lat, e.currentTarget.dataset.lng);
  },

  //选择时间
  chooseTime(e) {
    this.setData({
      choose_time: e.currentTarget.dataset.time
    });
  },

  //邀约确认
  appointOrder() {
    var that = this;
    var isLogin = tools.getCache('token');
    if (!isLogin) {
      this.setData({
        showAuth: true,
      });
      return false;
    } else {
      var choose_time = this.data.choose_time;
      var appoint_id = this.data.infos.id || 0;
      var is_tiped = this.data.is_tiped;
      var is_auth = this.data.is_auth;
      if (is_auth == 0 && is_tiped) {
        tools.modal('请先登陆搭翎小程序', false, function () {
          wx.navigateTo({
            url: '../perfect_info/index',
          })
        }, '去注册');
        return false;
      }
      if (!choose_time) {
        tools.toast('请选择时间');
      } else {
        if (this.data.submitStatus) {
          return false;
        }
        this.setData({
          submitStatus: true
        });
        wx.requestSubscribeMessage({
          tmplIds: [
            'CAupBXVYtEU-BX_LSAsWszNzOxdzj_2BsJijacOnZhI',
            '4QxVO1YlMMqHD57ikKTiiMYz2dT9K56NcrvUI7XE_HY'
          ],
          complete() {
            tools.submitRequest(that, 'POST', '/api/order/createOrder', {
              appoint_id: appoint_id,
              choose_time: choose_time
            }, function (res) {
              that.setData({
                submitStatus: false
              });
              if (res.code == 1) {
                //发起支付
                wx.showLoading({
                  title: '支付中...',
                })
                that.wx_pay(res.data.data, res.data.order_id);
              } else {
                var btn_text = res.code == 400 ? '去注册' : (res.code == 202 ? '去写评价' : '确定');
                tools.modal(res.msg || '发布失败', false, function (ret) {
                  if (res.code == 400) {
                    wx.navigateTo({
                      url: '../perfect_info/index',
                    })
                  }
                  if (res.code == 202) {
                    wx.navigateTo({
                      url: '../my_appoint/index?status=4',
                    })
                  }
                }, btn_text);
              }
            });
          }
        })

      }
    }
  },


  /**
   * 发起支付
   */

  wx_pay(data, order_id = 0) {
    wx.requestPayment({
      timeStamp: data['timeStamp'],
      nonceStr: data['nonceStr'],
      package: data['package'],
      signType: 'MD5',
      paySign: data['paySign'],
      success(res) {
        wx.hideLoading();
        wx.navigateTo({
          url: '../pay_success/index?is_type=2&order_id=' + order_id,
        })
      },
      fail(res) {
        wx.hideLoading();
        tools.modal('支付失败', false, function (ret) {
          wx.switchTab({
            url: '../mine/index',
          })
        });
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let token = tools.getCache('token');
    var that = this;
    this.setData({
      id: options.id || 0,
      showAuth: !token ? true : false
    }, function () {
      that.getLocation(options.id || 0);
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
    if (this.data.infos) {
      this.infos(this.data.infos.id, app.globalData.lat, app.globalData.lng);
    }
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