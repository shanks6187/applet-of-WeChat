// pages/invite/index.js
const app = getApp();
const tools = require('../../utils/tools');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '',
    multiArray: [
      [
        '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '00:00', '01:00', '02:00', '03:00', '04:00', '05:00'
      ],
      ['07:00', '08:00']
    ],
    multiIndex: [0, 0],
    isShowTip: false,
    restaurantInfo: null,
    sex: 0,
    is_want: 1,
    is_to: 1,
    money_tip: null, //定金规则提示
    moneyList: [], //定金列表
    moneyIndex: -1, //定金索引
    is_agree: false,
    submitStatus: false,
    is_tiped: false,
    is_auth: 0
  },

  //时间段 点击确认时触发
  bindMultiPickerChange(event) {
    this.setData({
      multiIndex: event.detail.value
    })
  },
  //时间段 列改变时触发
  bindMultiPickerColumnChange(event) {
    const data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    }
    var arrayTwo = [];
    // 获取滚动的是哪一列
    data.multiIndex[event.detail.column] = event.detail.value
    if (event.detail.column == 0) {
      var start_at = data.multiArray[event.detail.column][event.detail.value];
      var start_arr = start_at.split(':') || [];
      if (start_arr[0] == 23) {
        var end_at1 = '00';
        var end_at2 = '01';
      } else {
        var end_at1 = parseInt(start_arr[0]) + parseInt(1);
        if (end_at1 == 23) {
          end_at1 = end_at1 < 10 ? '0' + end_at1 : end_at1;
          var end_at2 = '00';
        } else {
          var end_at2 = parseInt(start_arr[0]) + parseInt(2);
          end_at2 = end_at2 < 10 ? '0' + end_at2 : end_at2;
          end_at1 = end_at1 < 10 ? '0' + end_at1 : end_at1;
        }
      }
      arrayTwo.push(end_at1 + ':' + start_arr[1]);
      arrayTwo.push(end_at2 + ':' + start_arr[1]);
      data.multiArray[1] = arrayTwo;
      data.multiIndex[1] = 0
      console.log('multiArray', data.multiArray);
    }


    // 遍历 classArray
    // this.data.multiArray.forEach((item, index) => {
    //   // 滚动第一列
    //   if (event.detail.column === 0) {
    //     // 如果滚动到二年级 则将第二列的班级 替换成二年级对应的班级
    //     if (data.multiIndex[0] === index) {
    //       data.multiArray[1] = item
    //     }
    //     // 每次滚动 就把第二列默认设置为第一个
    //     data.multiIndex[1] = 0
    //   }
    //   this.setData(data)
    // })
    this.setData(data)
  },
  //定金提示
  toggleTip() {
    this.setData({
      isShowTip: !this.data.isShowTip
    })
  },

  //选择日期
  dateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },
  //选择餐厅
  chooseRestaurant() {
    var that = this;
    wx.navigateTo({
      url: '../choose_restaurant/index',
      success: function (res) {
        res.eventChannel.on('chooseRestaurant', function (params) {
          that.setData({
            restaurantInfo: params
          });
        });
      }
    })
  },

  //选择性别
  chooseSex(e) {
    this.setData({
      sex: e.currentTarget.dataset.sex
    });
  },
  //选择我要
  chooseWant(e) {
    this.setData({
      is_want: e.currentTarget.dataset.want
    });
  },
  //目的
  chooseTo(e) {
    this.setData({
      is_to: e.currentTarget.dataset.to
    });
  },

  //选择金额
  chooseMoney(e) {
    this.setData({
      moneyIndex: e.currentTarget.dataset.id
    });
  },

  //同意协议
  chooseAgree() {
    this.setData({
      is_agree: !this.data.is_agree
    });
  },

  /**
   *定金提示 和 定金金额
   */
  getMoneyTip() {
    var that = this;
    var is_tiped = this.data.is_tiped;
    tools.httpRequest('GET', '/api/appoint/config', {}, function (res) {
      that.setData({
        money_tip: res.data.money_tip,
        moneyList: res.data.amount_range,
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
    });
  },

  //确认邀约
  addPublish() {
    var that = this;
    var restaurant = this.data.restaurantInfo;
    var sex = this.data.sex;
    var is_want = this.data.is_want;
    var is_to = this.data.is_to;
    var appoint_date = this.data.date;
    var multiArray = this.data.multiArray;
    var multiIndex = this.data.multiIndex;
    var moneyIndex = this.data.moneyIndex;
    var is_agree = this.data.is_agree;
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

    if (!restaurant) {
      tools.toast('请选择餐厅');
    } else if (!appoint_date) {
      tools.toast('请选择日期');
    } else if (!multiArray[0][multiIndex[0]] || !multiArray[1][multiIndex[1]]) {
      tools.toast('请选择时间段');
    } else if (moneyIndex == -1) {
      tools.toast('请选择邀约定金');
    } else {

      if (this.data.submitStatus) {
        return false;
      }
      // tools.modal('消息订阅提醒', false, function (message) {

      // });

      wx.requestSubscribeMessage({
        tmplIds: [
          'CAupBXVYtEU-BX_LSAsWszNzOxdzj_2BsJijacOnZhI',
          '4QxVO1YlMMqHD57ikKTiiMYz2dT9K56NcrvUI7XE_HY'
        ],
        complete() {

          that.setData({
            submitStatus: true
          });

          tools.submitRequest(that, 'POST', '/api/appoint/publish', {
            restaurant: JSON.stringify(restaurant),
            sex: sex,
            is_want: is_want,
            is_to: is_to,
            appoint_date: appoint_date,
            start_at: multiArray[0][multiIndex[0]],
            end_at: multiArray[1][multiIndex[1]],
            money_index: moneyIndex
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
          url: '../pay_success/index?is_type=1&order_id=' + order_id,
        })
      },
      fail(res) {
        wx.hideLoading();
        let tip_message = res.errMsg.indexOf('fail cancel') != -1 ? '取消支付' : '支付发起失败'
        tools.modal(tip_message, false, function (ret) {
          wx.switchTab({
            url: '../mine/index',
          })
        });
      }
    })
  },

  //发布协议
  cms_detail(e) {
    wx.navigateTo({
      url: '../ques_detail/index?cms_type=' + e.currentTarget.dataset.type + '&id=0',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {


    var nowDate = new Date();
    var year = nowDate.getFullYear(),
      month = nowDate.getMonth() + 1,
      day = nowDate.getDate()
    this.setData({
      date: `${year}-${month}-${day}`
    })
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
    this.getMoneyTip();
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