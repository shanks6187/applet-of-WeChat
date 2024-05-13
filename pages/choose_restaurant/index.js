// pages/choose_restaurant/index.js
const app = getApp();
const tools = require("../../utils/tools");
const QQMapWX = require("../../utils/qqmap-wx-jssdk.min");
var qqmapsdk = new QQMapWX({
  key: app.globalData.map_key // 必填
});
var interval_index = null;

/**
 * 计算距离
 * 格式 string
 * from_location = '39.984060,116.307520'
 */
function getDistance(qqmapsdk, from_location, to_location) {
  var distance = '0m';
  qqmapsdk.calculateDistance({
    from: from_location,
    to: to_location,
    complete: function (res) {
      if (res.status == 0) {
        let distances = res['result']['elements']['distance']
        if (distances >= 1000) {
          distance = (distances / 1000).toFixed(2) + 'km';
        } else {
          distance = distances + 'm';
        }
      } else {
        console.log('距离计算异常：', res);
      }
    }
  });
  return distance;
}

function rad(d) {
  return d * Math.PI / 180.0; 
}

// 根据经纬度计算距离，参数分别为第一点的纬度，经度；第二点的纬度，经度
function getDistanceJs(lat1, lng1, lat2, lng2) {

  var radLat1 = rad(lat1);
  var radLat2 = rad(lat2);
  var a = radLat1 - radLat2;
  var b = rad(lng1) - rad(lng2);
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
      Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  s = s * 6378.137; // EARTH_RADIUS;
  s = Math.round(s * 10000) / 10000; //输出为公里

  var distance = s;
  var distance_str = "";

  if (parseInt(distance) >= 1) {
      distance_str = distance.toFixed(1) + "km";
  } else {
      distance_str = (distance * 1000).toFixed(1) + "m";
  }

  //s=s.toFixed(4);

  console.info('lyj 距离是', s);
  console.info('lyj 距离是', distance_str);
  return distance_str;
}


function getDistanceApi(lat,lng,lat2,lng2){
   var distance = '0m';
  tools.httpRequest('POST','/api/index/get_distance',{
    lat:lat,
    lng:lng,
    lat2:lat2,
    lng2:lng2
  },function(res){
    if(res.code == 1){
      if (res.data.distance >= 1000) {
        distance = (res.data.distance / 1000).toFixed(2) + 'km';
      } else {
        distance = res.data.distance + 'm';
      }
      return distance;
    }
  });
  // return distance;
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: false,
    lat: '',
    lng: '',
    lists: [], //附近餐厅
    recLists: [], //推荐地址
  },

  /**
   * 
   * @param {*} options 
   */
  getLocation() {
    var that = this;
    var lat = app.globalData.lat;
    var lng = app.globalData.lng;
    if (!lat || !lng) {
      wx.getLocation({
        type: 'gcj02',
        success: function (res) {
          app.globalData.lat = res.latitude;
          app.globalData.lng = res.longitude;
          that.setMarker(res.latitude, res.longitude);
          that.setData({
            lat: res.latitude,
            lng: res.longitude
          }, function () {
            that.searchRestaurant('餐厅');
          });
        }
      })
    } else {
      this.setData({
        lat: lat,
        lng: lng
      }, function () {
        that.searchRestaurant('餐厅');
      });
      this.setMarker(lat, lng);
    }

  },

  /**
   * 设置当前位置
   */
  setMarker(lat, lng) {
    var markers = [];
    this.decodeLatLng(lat,lng); //地址解析 
    markers.push({
      id: 0,
      latitude: lat,
      longitude: lng,
      iconPath: '/static/icon/icon_addr2.png',
      width: 45,
      height: 50,
    });
    this.setData({
      markers: markers
    });
  },

  /**
   * 检索附近餐厅
   * 关键词搜索
   */
  searchRestaurant(restaurant_name, is_show = false) {
    var that = this;
    var lists = [];
    qqmapsdk.getSuggestion({
      //获取输入框值并设置keyword参数
      keyword: restaurant_name, //用户输入的关键词，可设置固定值,如keyword:'KFC'
      region: app.globalData.city_name,
      success: function (res) { //搜索成功后的回调
        if (res.status == 0 && res.data.length > 0) {
          for (var i in res.data) {
            // let distance = getDistance(qqmapsdk, (app.globalData.lat + ',' + app.globalData.lng), (res.data[i]['location']['lat'] + ',' + res.data[i]['location']['lng']));
            let distance = getDistanceJs(app.globalData.lat,app.globalData.lng,res.data[i]['location']['lat'],res.data[i]['location']['lng']);

            lists.push({
              title: res.data[i]['title'],
              address: res.data[i]['address'],
              province: res.data[i]['province'],
              city: res.data[i]['city'],
              district: res.data[i]['district'],
              lat: res.data[i]['location']['lat'],
              lng: res.data[i]['location']['lng'],
              distance: distance
            });
          }
          if (!is_show) {
            that.setData({
              lists: lists
            });
          } else {
            that.setData({
              recLists: lists,
              isShow: is_show
            });
          }

        }
      },
      fail: function (error) {
        console.error(error);
      }
    });
  },

  /**
   * 输入关键词搜索
   */
  searchRestaurants(e) {
    this.searchRestaurant(e.detail.value, true);
  },

  /**
   * 选择餐厅
   */
  chooseRestaurant(e) {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.emit('chooseRestaurant', e.currentTarget.dataset.params);
    wx.navigateBack({
      delta: 0,
    })
  },

  /**
   * 地址解析
   */
  decodeLatLng(lat, lng) {
    qqmapsdk.reverseGeocoder({
      location: lat + ',' + lng,
      complete:function(res){
        if(res.status == 0){
          app.globalData.city_name = res['result']['address_component']['city'] || '上海市'
        } else {
          console.log('经纬度解析失败',res);
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this;
    if(qqmapsdk){
      this.getLocation();
      interval_index = setInterval(function(){
        if(that.data.lists.length == 0){
          that.searchRestaurant('餐厅');
        } else {
          clearInterval(interval_index);
        }
      },1000);
    }
    
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