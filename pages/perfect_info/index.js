// pages/perfect_info/index.js
const app = getApp();
const tools = require("../../utils/tools");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ageIdx: -1,
    home: [],
    hobbyPop: false,
    headPop: false,
    settingOptions: null, //年龄 兴趣 数据配置项
    interestIds: [], //兴趣ids集合
    sex: 0, //性别
    avatar_id: 1, //头像id
    userInfo: null,
    is_agree: false
  },
  //输入项
  input_fileds(e) {
    let field = e.currentTarget.dataset.field;
    this.setData({
      [field]: e.detail.value
    });
  },
  //选择头像
  toggleheadPop() {
    this.setData({
      headPop: !this.data.headPop
    })
  },
  //选择兴趣
  toggleHobby() {
    this.setData({
      hobbyPop: !this.data.hobbyPop
    })
  },
  //家乡选择
  homeChange(e) {
    this.setData({
      home: e.detail.value
    })
  },
  //年龄选择
  ageChange(e) {
    this.setData({
      ageIdx: e.detail.value
    })
  },

  //选择性别
  chooseSex(e) {
    console.log('sex', e.currentTarget.dataset.id);
    this.setData({
      sex: e.currentTarget.dataset.id
    });
  },

  //选择兴趣
  chooseInterest(e) {
    var interestIds = this.data.interestIds;
    var ids = e.currentTarget.dataset.id;
    if (interestIds.indexOf(ids) == -1) {
      if (interestIds.length >= 3) {
        tools.toast('只能选择3个兴趣标签');
        return false;
      }
      interestIds.push(ids);
    } else {
      interestIds.splice(interestIds.indexOf(ids), 1);
    }
    this.setData({
      interestIds: interestIds
    });

  },

  //确定头像
  chooseAvatar(e) {
    this.setData({
      avatar_id: e.currentTarget.dataset.index
    });
  },

  //同意协议
  chooseAgree() {
    this.setData({
      is_agree: !this.data.is_agree
    });
  },

  /**
   * 年龄 兴趣配置项
   */
  ageInterestOptions() {
    var that = this;
    tools.httpRequest('GET', '/api/mine/setting', {}, function (res) {
      that.setData({
        settingOptions: res.data || [],
      });
    });
  },

  //获取个人信息
  getUserInfo() {
    var that = this;
    tools.httpRequest('GET', '/api/mine/index', {}, function (res) {
      if (res.code == 1) {
        var interest_ids = res.data.info.interest_ids ? (res.data.info.interest_ids.split(',')) : [];
        if (interest_ids.length > 0) {
          for (var i in interest_ids) {
            interest_ids[i] = parseInt(interest_ids[i]);
          }
          console.log('interest_ids', interest_ids);
        }
        that.setData({
          userInfo: res.data.info,
          nickname: res.data.info.nickname,
          username: res.data.info.username,
          sex: res.data.info.gender,
          ageIdx: res.data.info.age_index,
          home: res.data.info.home_address ? (res.data.info.home_address.split(',') || []) : [],
          idcard_no: res.data.info.idcard_no,
          interestIds: interest_ids,
          avatar_id: res.data.info.avatar || 1
        });

      }
    });
  },

  //提交保存信息
  saveSetting() {
    var ageRange = this.data.settingOptions.age_ranges;
    var nickname = this.data.nickname;
    var avatar_id = this.data.avatar_id;
    var gender = this.data.sex;
    var ageIdx = this.data.ageIdx;
    var age = ageRange[ageIdx] || 0;
    var home_address = this.data.home.join(',');
    var username = this.data.username;
    var idcard_no = this.data.idcard_no;
    var interest_ids = this.data.interestIds.join(',');
    var is_agree = this.data.is_agree;
    if (!is_agree) {
      tools.toast('请同意协议')
    } else if (!nickname) {
      tools.toast('请输入昵称')
    } else if (age == -1 || !age) {
      tools.toast('请选择年龄')
    } else if (!home_address) {
      tools.toast('请选择家乡')
    } else if (!interest_ids) {
      tools.toast('请选择兴趣')
    } else if (idcard_no && idcard_no.length != 18) {
      tools.toast('请输入18位有效身份证号')
    } else {
      tools.httpRequest('POST', '/api/mine/setting', {
        nickname: nickname,
        avatar: avatar_id,
        gender: gender,
        age: age,
        age_index: ageIdx,
        home_address: home_address,
        username: username,
        idcard_no: idcard_no,
        interest_ids: interest_ids
      }, function (res) {
        if (res.code == 1) {
          wx.navigateBack();
        } else {
          tools.modal(res.msg, false, function () {

          });
        }
      });
    }

  },

  //使用条款
  cms_detail(e) {
    wx.navigateTo({
      url: '../ques_detail/index?cms_type='+e.currentTarget.dataset.type+'&id=0',
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.ageInterestOptions();
    this.getUserInfo();
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