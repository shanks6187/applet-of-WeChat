// components/u-selecttime/index.js
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
    appoint_id: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
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
  },

  attached() {
    var nowDate = new Date();
    var year = nowDate.getFullYear(),
      month = nowDate.getMonth() + 1,
      day = nowDate.getDate()
    this.setData({
      date: `${year}-${month}-${day}`
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    save_change_time() {
      var date = this.data.date;
      var multiArray = this.data.multiArray;
      var multiIndex = this.data.multiIndex;
      var start_at = multiArray[0][multiIndex[0]] || '';
      var end_at = multiArray[1][multiIndex[1]] || '';
      var that = this;
      console.log('multiIndex', multiIndex);
      console.log('start_at', start_at);
      console.log('end_at', end_at);
      if (!date) {
        tools.toast('请选择日期');
        return false;
      }
      if (!start_at) {
        tools.toast('请选择开始时间段');
        return false;
      }
      if (!end_at) {
        tools.toast('请选择结束时间段');
        return false;
      }
      tools.submitRequest(that, 'POST', '/api/appoint/change_date', {
        id: that.data.appoint_id,
        appoint_date: date,
        start_at: start_at,
        end_at: end_at
      }, function (res) {
        if (res.code == 1) {
          that.triggerEvent('confirm');
        } else {
          tools.modal(res.msg, false);
        }
      });
    },
    //时间段 列改变时触发
    bindMultiPickerColumnChange(event) {
      const data = {
        multiArray: this.data.multiArray,
        multiIndex: this.data.multiIndex
      }
      // 获取滚动的是哪一列
      var arrayTwo = [];
      data.multiIndex[event.detail.column] = event.detail.value;

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
      console.log('datas',data);
      this.setData(data)
    },
   
    //选择日期
    dateChange(e) {
      this.setData({
        date: e.detail.value
      })
    },
    //关闭修改时间
    onCancel() {
      this.triggerEvent('close');
    },
  }
})