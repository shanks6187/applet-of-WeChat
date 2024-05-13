// pages/partner/index.js
const app = getApp();
const tools = require('../../utils/tools');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topBarHeight: 0,
    isCity: false,
    isGender: false,
    isWeek: false,
    zimuArr: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
    scrollId: 'A',
    genderIdx: 0,
    showAuth: false,
    lists: [],
    page: 1,
    total_count: 0,
    citysAll: null,
    hotCitys: null,
    city_name: '',
    province_id: 0,
    city_id: 0,
    message_count: 0,
    week_name: '周几',
    week_id: '7',
    weekAll: [
      {
        name: '周几',
        id: '7',
      },
      {
        name: '周日',
        id: '0',
      },
      {
        name: '周一',
        id: '1',
      },
      {
        name: '周二',
        id: '2',
      },
      {
        name: '周三',
        id: '3',
      },
      {
        name: '周四',
        id: '4',
      },
      {
        name: '周五',
        id: '5',
      },
      {
        name: '周六',
        id: '6',
      },
    ],
  },
  selectGender(e) {
    var that = this;
    this.setData({
      genderIdx: e.currentTarget.dataset.index,
      isGender: !this.data.isGender,
      isCity: false,
      lists: [],
      page: 1,
      total_count: 0
    }, function () {
      that.dadaList();
    })
  },
  closePop() {
    this.setData({
      isCity: false,
      isGender: false,
      isWeek: false,
    })
  },

  //显示城市
  toggleCity() {
    this.setData({
      isCity: !this.data.isCity,
      isGender: false,
      isWeek: false,
    })
  },
  //显示性别
  toggleGender() {
    this.setData({
      isGender: !this.data.isGender,
      isCity: false,
      isWeek: false,
    })
  },
  //显示星期
  toggleWeek() {
    this.setData({
      isWeek: !this.data.isWeek,
      isCity: false,
      isGender: false,
    })
  },
  selectZimu(e) {
    let zimu = e.currentTarget.dataset.zimu;
    this.setData({
      scrollId: zimu
    })
  },
  getBarInfo(e) {
    this.setData({
      topBarHeight: e.detail.topBarHeight
    })
  },

  //选择城市
  chooseCity(e) {
    var params = e.currentTarget.dataset.params;
    var that = this;
    this.setData({
      province_id: params.level == 1 ? params.id : params.pid,
      city_id: params.level == 2 ? params.id : 0,
      city_name: params.name,

      isCity: !this.data.isCity,
      isGender: false,

      lists: [],
      page: 1,
      total_count: 0
    }, function () {
      that.dadaList();
    });
  },

    //选择星期
    handleWeek(e) {
      var params = e.currentTarget.dataset.params;
      var that = this;
      this.setData({
        week_id: params.id,
        week_name: params.name,
  
        isWeek: !this.data.isWeek,
        isCity: false,
        isGender: false,
  
        lists: [],
        page: 1,
        total_count: 0
      }, function () {
        that.dadaList();
      });
    },

  //取消授权
  authClose() {
    tools.toast('拒绝授权会导致部分功能不能用哦～');
    this.setData({
      showAuth: false
    });
  },
  //授权成功
  authConfirm() {
    var isLogin = tools.getCache('token');
    if (isLogin) {
      this.setData({
        showAuth: false,
      });
    }
  },

  //消息列表
  messageList() {
    var isLogin = tools.getCache('token');
    if (!isLogin) {
      this.setData({
        showAuth: true
      });
    } else {
      wx.navigateTo({
        url: '../notification/index',
      })
    }
  },

  //发起搭子
  publish() {
    var isLogin = tools.getCache('token');
    if (!isLogin) {
      this.setData({
        showAuth: true
      });
    } else {
      wx.navigateTo({
        url: '../invite/index',
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
        that.dadaList(res.latitude,res.longitude);
      },
      fail: function (res) {
        app.globalData.lat = '31.231859';
        app.globalData.lng = '121.486561';
        that.dadaList('31.231859','121.486561');
        if(res.errMsg != 'getLocation:fail auth deny'){
          tools.modal('请先开启手机定位',false);
        }
        
      }
    })
  },

  //打开地图
  openLocation(e) {
    app.openLocation(e.currentTarget.dataset.lat, e.currentTarget.dataset.lng);
  },

  //搭子详情
  detail(e) {
    var is_my = e.currentTarget.dataset.my;
    if(is_my == 1){
      wx.navigateTo({
        url: '../appoint_detail/index?id=' + e.currentTarget.dataset.id,
      })
    } else {
      wx.navigateTo({
        url: '../invitation_detail/index?id=' + e.currentTarget.dataset.id,
      })
    }
   
  },

  /**
   * 搭子列表
   */
  dadaList(lat,lng) {
    var that = this;
    var lists = this.data.lists || [];
    tools.httpRequest('GET', '/api/appoint/index', {
      lat: lat || app.globalData.lat,
      lng: lng || app.globalData.lng,
      page: this.data.page,
      province_id: this.data.province_id,
      city_id: this.data.city_id,
      sex: this.data.genderIdx,
      week_num: this.data.week_id,
      is_location: !app.globalData.locationInfo ? 1 : 0,
    }, function (res) {
      if (res.code == 1) {
       
        if (res.data.list.length > 0) {
          if(that.data.page > 1){
            lists.push(...res.data.list);
          } else {
            lists = res.data.list;
          }
        }
        if(res.data.locationInfo){
          app.globalData.locationInfo = res.data.locationInfo;
          that.setData({
            lists: lists,
            total_count: res.data.total_count,
            city_name: res.data.locationInfo.city_name || '上海市'
          });
        } else {
          that.setData({
            lists: lists,
            total_count: res.data.total_count,
            city_name:  that.data.city_name || '上海市'
          });
        }
       
      }
    });
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

  //消息提醒
  message_tips(){
    var that = this;
    var token = tools.getCache('token');
    if(!token){
      return false;
    }
    tools.httpRequest('GET', '/api/appoint/message_tips', {}, function (res) {
      that.setData({
        message_count: res.data.message_count || 0,
      });
    });
  },

  //检查位置授权情况
  checkLocation(){
    var that = this;
    wx.getSetting({
      success:function(res){
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
           //已拒绝 重新发起
          tools.modal('您已拒绝定位,需重新定位',true,function(rel){
           if(rel.confirm){
            wx.openSetting({
              success:function(ret){
                if (ret.authSetting["scope.userLocation"] == true) {
                  that.getLocation();
                } 
              }
            })
           }
           
          },'重新定位');
        
        } else if(res.authSetting['scope.userLocation'] == undefined){
          //未授权
          that.getLocation();
        } else if (res.authSetting['scope.userLocation']) {
          //已授权
          that.getLocation();
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getLocation();
    this.citys_all();
    this.hot_citys();
    this.message_tips();
  },
  join_activit(e){
    wx.navigateTo({
      url: `../task_detail/index?id=${e.currentTarget.dataset.id}`,
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
    this.message_tips();
    this.checkLocation();
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
    this.message_tips();
    this.setData({
      lists:[],
      total_count:0,
      message_count:0
    },function(){
      tools.httpRequest('GET', '/api/appoint/index', {
        lat:  app.globalData.lat,
        lng: app.globalData.lng,
        page: 1,//that.data.page,
        province_id: that.data.province_id,
        city_id: that.data.city_id,
        sex: that.data.genderIdx,
        week_num: that.data.week_id,
        is_location: !app.globalData.locationInfo ? 1 : 0,
      }, function (res) {
       
        if (res.code == 1) {
          that.setData({
            lists: res.data.list || [],
            total_count: res.data.total_count,
            message_count: res.data.message_count,
          });
        }
        wx.stopPullDownRefresh();
      });
    });
    
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    var page = this.data.page;
    var lists = this.data.lists;
    var total_count = this.data.total_count;
    var that = this;
    if (total_count > lists.length) {
      that.setData({
        page: page + 1
      }, function () {
        that.dadaList();
      });
    }
  },

  /**
   * 用户点击右上角分享
   * 找搭子上搭翎，让真实见面成为可能
   */
  onShareAppMessage() {
  
    return {
      title: '找搭子上搭翎，让真实见面成为可能'
    }
  }
})