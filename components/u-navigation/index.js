// components/u-navigation/index.js
/**
 * 自定义头部导航组件，基于官方组件Navigation开发。
 *
 * <u-navigation title="会员中心" bindgetBarInfo="getBarInfo"></u-navigation>
 *
 * 组件属性列表
 * ext-class      {string}  添加在组件内部结构的class，可用于修改组件内部的样式
 * title          {string}  导航标题，如果不提供为空
 * background     {string}  导航背景色，默认#ffffff
 * color          {string}  导航字体颜色
 * border         {string}  导航底部边框颜色，为空则不显示
 * dbclickBackTop {boolean} 是否开启双击返回顶部功能，默认true
 * loading        {boolean} 是否显示标题左侧的loading，默认false
 * animated       {boolean} 显示隐藏的时候opacity动画效果
 * show           {boolean} 显示隐藏导航，隐藏的时候navigation的高度占位还在,默认true
 * place          {boolean} 是否显示导航占位，默认true
 * back           {boolean} 是否显示back按钮，默认false
 * home           {boolean} 是否显示home按钮，默认false
 * delta          {Number}  back为true的时候，返回的页面深度
 * backImage      {string}  back按钮的图标地址
 * homeImage      {string}  home按钮的图标地址
 *
 * Slot Name
 * left           左侧slot，在back按钮位置显示
 * center         标题slot，在标题位置显示
 *
 * 触发事件
 * bindgetBarInfo {eventhandler}  组件实例载入页面时触发此事件，首参为event对象，event.detail携带当前导航栏信息，如导航栏高度event.detail.topBarHeight
 * bindback       {eventhandler}  点击back按钮触发此事件响应函数
 *
*/
Component({
  options: {
    multipleSlots: true,
    addGlobalClass: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    extClass: {
      type: String,
      value: ''
    },
    leftWidth:{
      type: String,
      value:''
    },
    title: {
      type: String,
      value: ''
    },
    background: {
      type: String,
      value: '#ffffff'
    },
    color: {
      type: String,
      value: '#000000'
    },
    border: {
      type: String,
      value: ''
    },
    dbclickBackTop:{
      type:Boolean,
      value:true
    },
    loading: {
      type: Boolean,
      value: false
    },
    animated: {
      type: Boolean,
      value: true
    },
    show: {
      type: Boolean,
      value: true,
      observer: '_showChange'
    },
    place: {
      type: Boolean,
      value: true
    },
    back: {
      type: Boolean,
      value: false
    },
    home: {
      type: Boolean,
      value: false
    },
    delta: {
      type: Number,
      value: 1
    },
    backImage: {
      type: String,
      value: 'icon/icon_back4.svg'
    },
    homeImage: {
      type: String,
      value: 'icon/icon_home.svg'
    },
    homeurl:{
      type: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    displayStyle: '',
    navibarStyle: '',

  },

  attached: function attached() {
    var _this = this;
    //动态计算导航栏尺寸
    var isSupport = !!wx.getMenuButtonBoundingClientRect;
    var rect = wx.getMenuButtonBoundingClientRect ? wx.getMenuButtonBoundingClientRect() : null;
    wx.getSystemInfo({
        success: function success(res) {
          var ios = !!(res.system.toLowerCase().search('ios') + 1);
          var statusBarHeight=res.statusBarHeight;
          var topBarHeight=ios ? (44 + statusBarHeight) : (48 + statusBarHeight);
          var navibarStyle = isSupport ?
                             `--statusHeight:${statusBarHeight}px;
                              --innerRight:${res.windowWidth - rect.left}px;
                              --innerMargin:${res.windowWidth - rect.right}px;
                              --btnWidth:${rect.width}px;
                              --btnHeight:${rect.height}px;` : '';
          _this.setData({
              ios: ios,
              navibarStyle: navibarStyle,
          });

          _this.triggerEvent('getBarInfo', {statusBarHeight,topBarHeight});
        }
    });

    //back箭头处理的显示
    var pages=getCurrentPages()
    if(pages.length>1){
      this.setData({back:true})
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _showChange: function (show) {
      const animated = this.data.animated
      let displayStyle = ''
      if (animated) {
        displayStyle = `opacity: ${ show ? '1' : '0' };-webkit-transition:opacity 0.5s;transition:opacity 0.5s;`
      } else {
        displayStyle = `display: ${show ? '' : 'none'};`
      }
      this.setData({
        displayStyle
      })
    },
    //点击back事件处理
    _tapBack: function () {
      const delta = this.data.delta
      if (delta) {
        wx.navigateBack({
          delta: delta
        })
      }
      this.triggerEvent('back', { delta: delta }, {})
    },
    //返回首页
    _tapHome:function(e){
      wx.reLaunch({
        url: this.data.homeurl || '/pages/index/index'
      })
    },
    //双击返回顶部
    _doubleClick(e) {
      if (!this.data.dbclickBackTop){return}
      if (this.timeStamp && (e.timeStamp - this.timeStamp < 300)) {
        this.timeStamp = 0
        wx.pageScrollTo({
          scrollTop: 0,
          duration: 300
        })
      } else {
        this.timeStamp = e.timeStamp
      }
    }
  }

})
