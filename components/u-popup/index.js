// components/popup.js
var app = getApp();
Component({
  externalClasses: ['custom-class','title-class','main-class'],
  options: {
    multipleSlots: true, // 在组件定义时的选项中启用多slot支持
    addGlobalClass: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    safeArea: Boolean,
    type: {
      type: String,
      value: 'center'
    },
    show: {
      type: Boolean,
      value: false
    },
    title: {
      type: String,
      value: '标题'
    },
    showTitle: {
      type: Boolean,
      value: false
    },
    showClose: {
      type: Boolean,
      value: false
    },
    margin: {
      type: String,
      value: '0rpx'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
  },
  attached() {
    this.setData({
      // safeArea: app.globalData.isIPhoneX
    })
  },

  /**
   * 组件的方法列表
   */
   methods: {
    _popupClose: function () {
      this.triggerEvent('close', {});
    },
    _popupSure: function () {
      this.triggerEvent('sure', {});
    }
  }

})
