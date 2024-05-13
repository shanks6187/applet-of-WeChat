// components/u-countdown.js
const app = getApp();
const tools = require("../../utils/tools");
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    timeList: {
      type: Array,
      value: []
    },
    choose_time: {
      type: String,
      value: ''
    },
    appoint_id: {
      type: String,
      value: '',
    },
    order_id: {
      type: String,
      value: ''
    },
    show: {
      type: Boolean,
      value: false
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    choose_time: '',
  },

  created() {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    //关闭修改时间
    onCancel() {
      this.triggerEvent('close');
    },

    //选择时间
    chooseTime(e) {
      this.setData({
        choose_time: e.currentTarget.dataset.time
      });
    },

    //确定修改
    save_change_time() {
      var choose_time = this.data.choose_time;
      var order_id = this.data.order_id;
      var that = this;
      if (!choose_time) {
        tools.toast('请选择时间点');
      } else {
        tools.submitRequest(that, 'POST', '/api/order/change_appoint_time', {
          order_id: order_id,
          choose_time: choose_time
        }, function (res) {
          if (res.code == 1) {
            that.triggerEvent('confirm');
          } else {
            tools.modal(res.msg, false);
          }
        });
      }

    },

  }

})