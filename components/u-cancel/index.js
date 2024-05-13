// components/u-cancel.js
const app = getApp();
const tools = require("../../utils/tools");
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    is_sure: {
      type: Boolean,
      value: false
    },
    appoint_id: {
      type: String,
      value: '',
    },
    order_id: {
      type: String,
      value: ''
    },
    current_appoint_type: {
      type: String,
      value: ''
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    //关闭修改时间
    onCancel() {
      this.triggerEvent('close');
    },
    //取消操作
    cancelSave() {
      var that = this;
      var url = ''
      if (that.data.current_appoint_type == 2){
        url = '/api/activity_order/cancel_order'
      }
      tools.submitRequest(that, 'POST', url, {
        appoint_id: this.data.appoint_id,
        order_id: this.data.order_id
      }, function (res) {
        if (res.code == 1) {
          that.triggerEvent('confirm', {
            order_id: that.data.order_id,
            appoint_id: that.data.order_id
          });
        } else {
          tools.modal(res.msg, false);
        }
      });
    }
  }

})