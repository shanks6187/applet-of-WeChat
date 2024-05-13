// pages/find/index.js
const tools = require("../../utils/tools");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topBarHeight: 0,
    isCity: false,
    zimuArr: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
    scrollId: 'A',

    list: [],
    page: 1,
    total_count: 0,
    citysAll: [],
    hotCitys: [],
    banner: [],
    city_name: '',
    city_id: 0,
    province_id: 0,
  },

  //关闭城市弹窗
  closePop() {
    this.setData({
      isCity: false,
    })
  },
  //显示/关闭城市弹窗
  toggleCity() {
    this.setData({
      isCity: !this.data.isCity,
    })
  },
  //选择字母
  selectZimu(e) {
    let zimu = e.currentTarget.dataset.zimu;
    this.setData({
      scrollId: zimu
    })
  },

  //头部高度
  getBarInfo(e) {
    this.setData({
      topBarHeight: e.detail.topBarHeight
    })
  },

  //选择城市
  //选择城市
  chooseCity(e) {
    var params = e.currentTarget.dataset.params;
    var that = this;
    this.setData({
      province_id: params.level == 1 ? params.id : params.pid,
      city_id: params.level == 2 ? params.id : 0,
      city_name: params.name,

      isCity: !this.data.isCity,

      list: [],
      page: 1,
      total_count: 0
    }, function () {
      that.lists();
    });
  },

  //banner
  banners() {
    var that = this;
    tools.httpRequest('GET', '/api/index/banner', {}, function (res) {
      if (res.code == 1) {
        that.setData({
          banner: res.data.list || []
        });
      }
    });
  },

  /**
   * 发现数据
   */
  lists() {
    var that = this;
    var page = this.data.page;
    var list = this.data.list;
    tools.httpRequest('GET', '/api/index/record', {
      page: page,
      lat: app.globalData.lat,
      lng: app.globalData.lng,
      is_location: !app.globalData.locationInfo ? 1 : 0,
      city_id: this.data.city_id || app.globalData.locationInfo.city_id,
      province_id: this.data.province_id
    }, function (res) {
      if (res.data.list.length > 0) {
        list.push(...res.data.list);
      }
      if (!app.globalData.locationInfo) {
        app.globalData.locationInfo = res.data.locationInfo;
      }
      that.setData({
        total_count: res.data.total_count,
        list: list
      });
    });
  },

  //显示图片
  show_image(e) {
    wx.previewImage({
      urls: [e.currentTarget.dataset.url],
      current: e.currentTarget.dataset.url
    })
  },

  // 发现列表显示图片
  show_list_image(e) {
    const imgs = e.currentTarget.dataset.item.image_list.map(item=>tools.showImage(item))
    wx.previewImage({
      urls: imgs,
      current: e.currentTarget.dataset.url
    })
  },

  //全部城市
  citys_all() {
    var that = this;
    tools.httpRequest('GET', '/api/index/getCitys', {}, function (res) {
      that.setData({
        citysAll: res.data.list || []
      });
    });
  },

  //热门城市
  hot_citys() {
    var that = this;
    tools.httpRequest('GET', '/api/index/hotCitys', {}, function (res) {
      that.setData({
        hotCitys: res.data.hotCitys || []
      });
    });
  },

  //banner详情
  banner_detail(e) {
    var params = e.currentTarget.dataset.params;
    console.log('params', params);
    if (params.is_redirect == 1) {
      wx.navigateTo({
        url: '../detail/index?id=' + params.redirect_id,
        success: function (res) {
          res.eventChannel.emit('bannerActivity', {
            thumb_image: params.thumb_image
          });
        }
      })
    }
  },

  //获取定位
  getLocation() {
    var that = this;
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        app.globalData.lat = res.latitude;
        app.globalData.lng = res.longitude;
        that.lists();
      },
      fail: function () {
        that.lists();
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (!app.globalData.locationInfo) {
      this.getLocation();
    } else {
      var that = this;
      this.setData({
        city_name: app.globalData.locationInfo.city_name,
        city_id: app.globalData.locationInfo.city_id
      }, function () {
        that.lists();
      });

    }
    this.citys_all();
    this.hot_citys();
    this.banners();
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
    var that = this;
    this.setData({
      list: [],
      page: 1,
      total_count: 0,
    }, function () {
      that.lists();
      that.banners();
    });
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    var total_count = this.data.total_count;
    var page = this.data.page;
    var list = this.data.list;
    var that = this;
    if (total_count > list.length) {
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
    return {
      title: '找搭子上搭翎，让真实见面成为可能'
    }
  }
})