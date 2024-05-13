// pages/task_detail/index.js
const app = getApp();
const tools = require("../../utils/tools");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_id: 0,
    detail:{},
    banners: [],
    mini_price: 0,
    isSelectTime: false,
    show_time: false,
    appoint_id: 0,
    show_cancel: false,
    showDiscountsModal: false,
    showQrCodeModal: false,
    ticketList: [],
    halt_ticketList: [],
    current_ticket_info:{},
    disabled: true,
    showAuth: false,
    submitStatus: false,
    comment_order_id: 0,
  },
  pageInit(){
    var that = this;
    tools.httpRequest('GET', '/api/appoint/multi_appoint_detail', {
      id: that.data.order_id,
      lat: app.globalData.lat,
      lng: app.globalData.lng
    }, function (res) {
      if (res.code === 1) {
        const mini_price_info = res.data?.ticketTypes?.sort?.((a,b)=>a.ticket_price>b.ticket_price?-1:1)[0] || {}
        that.setData({
          showAuth: false,
          showDiscountsModal: false,
          mini_price: mini_price_info.ticket_price,
          detail:res.data||{},
          current_ticket_info: mini_price_info,
          disabled: res.data?.appointData.appoint_status !== 21,
          ticketList: res.data.ticketTypes.filter(item=>item.signup_num !== item.ticket_num) || [],
          halt_ticketList: res.data.ticketTypes.filter(item=>item.signup_num === item.ticket_num) || [],
          banners: res.data?.appointData?.multi_appoint_banner?.split?.(','),
          comment_order_id: res.data?.comment_order_id || 0,
          // comment_order_id: 125,
        })
      }
    });
  },
  handleCurrentTicketInfo(e){
    var that = this;
    that.setData({
      current_ticket_info:e.currentTarget.dataset.item
    })
  },

  hideModal(e) {
    var that = this;
    that.setData({
      showDiscountsModal: false,
      showQrCodeModal: false,
    })
  },

  showModal(e) {
    var that = this;
    that.setData({
      showDiscountsModal: true,
    })
  },

  //打开地图
  openLocation(e) {
    app.openLocation(e.currentTarget.dataset.lat, e.currentTarget.dataset.lng);
  },
  verify_action(e) {
    var that = this;
    that.setData({
      showQrCodeModal: true,
    })
  },


  //修改时间
  show_time(e) {
    var params = e.currentTarget.dataset.params;
    this.setData({
      show_time: !this.data.show_time,
      timesList: params.appoint.time_list || [],
      appoint_id: params.appoint.id || 0,
      order_id: params.order.id || 0
    });
  },
  show_list_image(e){
    const imgs = e.currentTarget.dataset.item.image_list.map(item=>tools.showImage(item))
    wx.previewImage({
      urls: imgs,
      current: e.currentTarget.dataset.url
    })
  },

  //关闭时间弹窗
  show_change_time(e) {
    this.setData({
      show_time: !this.data.show_time,
    });
  },

  // 立即参与
  appointOrder() {
    console.log(1)
    var that = this;
    var isLogin = tools.getCache('token');
    if (!isLogin) {
      this.setData({
        showAuth: true,
      });
      return false;
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
        complete(){
          tools.submitRequest(that, 'POST', '/api/activity_order/createOrder', {
            appoint_id: that.data.order_id,
            pay_type_id: that.data.current_ticket_info.id
          }, function (res) {
            that.setData({
              submitStatus: false
            });
            if (res.code == 1) {
              //发起支付
              wx.showLoading({
                title: '支付中...',
              })
              that.wx_pay(res.data.data, 305);
            } else {
              var btn_text = res.code == 400 ? '去注册' : (res.code == 202 ? '去写评价' : '确定');
              tools.modal(res.msg || '参与失败', false, function (ret) {
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



      // tools.submitRequest(that, 'POST', '/api/activity_order/createOrder', {
      //   appoint_id: that.data.order_id,
      //   pay_type_id: that.data.current_ticket_info.id
      // }, function (res) {
      //   that.setData({
      //     submitStatus: false
      //   });
      //   if (res.code == 1) {
      //     //发起支付
      //     wx.showLoading({
      //       title: '支付中...',
      //     })
      //     that.wx_pay(res.data.data, 305);
      //   } else {
      //     var btn_text = res.code == 400 ? '去注册' : (res.code == 202 ? '去写评价' : '确定');
      //     tools.modal(res.msg || '参与失败', false, function (ret) {
      //       if (res.code == 400) {
      //         wx.navigateTo({
      //           url: '../perfect_info/index',
      //         })
      //       }
      //       if (res.code == 202) {
      //         wx.navigateTo({
      //           url: '../my_appoint/index?status=4',
      //         })
      //       }
      //     }, btn_text);
      //   }
      // });
    }
  },

  
  /**
   * 发起支付
   */

  wx_pay(data, order_id = 0) {
    let that = this
    wx.requestPayment({
      timeStamp: data['timeStamp'],
      nonceStr: data['nonceStr'],
      package: data['package'],
      signType: 'MD5',
      paySign: data['paySign'],
      success(res) {
        wx.hideLoading();
        tools.toast('支付成功');
        that.pageInit()
        // wx.navigateTo({
        //   url: '../pay_success/index?is_type=2&order_id=' + order_id,
        // })
      },
      fail(res) {
        wx.hideLoading();
        tools.modal('支付失败', false, function (ret) {
          // wx.switchTab({
          //   url: '../mine/index',
          // })
        });
      }
    })
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
   //取消授权
   authClose() {
    tools.toast('拒绝授权会导致部分功能不能用哦～');
    this.setData({
      showAuth: false
    });
    this.getLocation(this.data.id)
  },
  //写评价
  to_comment(e) {
    const url = `order_id=${this.data.comment_order_id}&appoint_type=2`
    wx.navigateTo({
      url: '../questionnaire/index?' + url,
    })
  },
  /**
   * 刷新数据
   */
  reFresh(params) {
    console.log('refresh', params);
    var that = this;
    that.pageInit();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this;
    this.setData({
      order_id: options.id || 0
    }, function () {
      this.pageInit();
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
    app.eventBus.off('reFresh', this.reFresh(), this);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

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
  onShareAppMessage(e) {
    var id = this.data.order_id || 0;
    return {
      title: '找搭子上搭翎，让真实见面成为可能',
      path: '/pages/task_detail/index?id=' + id
    }
  }
})