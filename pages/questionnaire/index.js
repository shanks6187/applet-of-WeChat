// pages/questionnaire/index.js
const app = getApp();
const tools = require("../../utils/tools");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topBarHeight: 0,
    list: [],
    image_list: [],
    order_id: 0,
    is_other:0,
    appoint_type: 1,
  },
  getBarInfo(e) {
    this.setData({
      topBarHeight: e.detail.topBarHeight
    })
  },

  questionList() {
    var that = this;
    tools.httpRequest('GET', '/api/order/questions', {
      appoint_type: that.data.appoint_type,
    }, function (res) {
      if (res.code == 1) {
        that.setData({
          list: res.data.list
        });
      }
    });
  },

  //单选题 选择
  radios_choose(e) {
    var index = e.currentTarget.dataset.index;
    var value = e.currentTarget.dataset.value;
    var filed_no = e.currentTarget.dataset.no;
    var list = this.data.list;
    list[index]['user_answer'] = value;
    list[index]['answer_no'] = filed_no;
    this.setData({
      list: list
    });
  },

  //多选题
  box_choose(e) {
    var index = e.currentTarget.dataset.index;
    var value = e.currentTarget.dataset.value;
    var filed_no = e.currentTarget.dataset.no;
    var list = this.data.list;
    if(value == '其他'){
      this.setData({
        is_other:index
      });
    } else {
      var user_answer = list[index]['user_answer'] || [];
      if (user_answer.indexOf(value) == -1) {
        user_answer.push(value);
      } else {
        user_answer.splice(user_answer.indexOf(value), 1);
      }
      list[index]['user_answer'] = user_answer;
      this.setData({
        list: list
      });
    }
   
  },

  //多选输入答案
  input_box_answer(e){
    var index = this.data.is_other;
    var list = this.data.list;
    var value = e.detail.value;
    var user_answer = list[index]['user_answer'] || [];
    if (user_answer.indexOf(value) == -1) {
      user_answer.push(value);
    } else {
      user_answer.splice(user_answer.indexOf(value), 1);
    }
    list[index]['user_answer'] = user_answer;
    this.setData({
      list: list
    });
    console.log('user_answer',user_answer);
  },

  //问答题输入答案
  input_content(e) {
    var index = e.currentTarget.dataset.index;
    var value = e.detail.value;
    var list = this.data.list;
    list[index]['user_answer'] = value;
    this.setData({
      list: list
    });
  },

  //选择图片
  choose_image() {
    var that = this;
    var image_list = this.data.image_list;
    if(image_list.length >= 9){
      tools.toast('最多9张图片');
    } else {
      tools.chooseFile(9, function (res) {
        console.log('ress',res);
        for(var i in res){
          that.upload_image(res[i]['tempFilePath']);
        }
      });
    }
   
  },
  // 上传图片
  upload_image(file_path) {
    var that = this;
    var image_list = this.data.image_list;
    tools.fileUpload(file_path, '/api/index/ossupload', function (res) {
      if(res.code == 1){
        image_list.push(res.data.url);
        that.setData({
          image_list: image_list
        });
      }
     
    });
  },

  //删除图片
  delImage(e) {
    var index = e.currentTarget.dataset.index;
    var image_list = this.data.image_list;
    image_list.splice(index, 1);
    this.setData({
      image_list: image_list
    });
  },

  /**
   * 提交保存评价
   */
  submitComment(e) {
    var list = this.data.list;
    var submitData = [];
    for(var i in e.detail.value){
      let keys = i.split('-');
      if(keys[1]){
        list[keys[1]]['user_answer'] = e.detail.value[i];
      }
    }
    if(this.data.image_list.length >0 && this.data.image_list.length > 9){
      tools.toast('图片最多9张');
      return false;
    }
    var image_list = this.data.image_list.join(",");
    var comment = '';
    for (var i in list) {
      if (list[i]['is_require'] == 1 && !list[i]['user_answer']) {
        tools.toast("第" + (parseInt(i) + 1) + "题，还未作答");
        return false;
      } else {
        let answer = list[i]['question_type'] == 2 ? list[i]['user_answer'].join(",") : list[i]['user_answer'];
        submitData.push(list[i]['id'] + '-' + answer);
        if(list[i]['question_type'] == 3){
          comment = list[i]['user_answer'];
        }
      }
    }

    var that = this;
    var appoint_type = that.data.appoint_type
    var url = '/api/order/add_comment'
    if (appoint_type == 2) {
      url = '/api/activity_order/add_comment'
    }
    tools.submitRequest(that, 'POST', url, {
      data: submitData.join("|"),
      image_list: image_list,
      order_id: this.data.order_id,
      comment:comment
    }, function (res) {
      if (res.code == 1) {
        app.eventBus.emit('reFresh',{});
        wx.navigateTo({
          url: '../evaluation_success/index',
        })
      } else {
        tools.modal(res.msg, false);
      }
    });

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      order_id: options.order_id || 0,
      appoint_type: options.appoint_type || 1,
    });
    this.questionList();
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