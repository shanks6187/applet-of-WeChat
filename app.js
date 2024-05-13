// app.js
//全局事件
const eventBus = require("./utils/eventbus");
//外部函数
const util = require("./utils/util");

App({

    onLaunch() {
     
    },

    //获取定位
    getLocation() {
        var that = this;
        wx.getLocation({
            type: 'gcj02',
            success: function (res) {
                that.globalData.lat = res.latitude;
                that.globalData.lng = res.longitude;
                return res;
            }
        })
    },

    //打开地图
    openLocation(latitude, longitude) {
        wx.openLocation({
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            scale: 18,
            fail: function (res) {
                console.log('res',res);
                wx.showToast({
                  title: '地图打开失败',
                  icon:'none'
                })
            }
        })
    },

    //全局属性
    eventBus: new eventBus(),
    util: util,
    //全局数据存储
    globalData: {

            // api_url:'https://n.xilukeji.com/dadafriends/public/index.php', //请求接口地址
        	web_url:'https://n.xilukeji.com/dadafriends/public', //域名 项目根目录
        	// image_url:'https://xilu-images.oss-cn-shanghai.aliyuncs.com', //图片链接
        // mock mirror
        api_url: 'https://dadatest.darlingty.com/dadafriends/public/index.php', //请求接口地址
        // web_url: 'http://localhost.dada.com', //域名 项目根目录
        image_url: 'https://dadatest.darlingty.com/dadafriends/public/index.php', //图片链接
        openid:'',
        cache_key: 'da', //缓存前缀
        lat:'31.231859',
        lng:'121.486561',
        locationInfo:null,
        map_key:'LCQBZ-7YLCW-4NIRH-3L7FC-JMOA6-SMFAX',
    }

})