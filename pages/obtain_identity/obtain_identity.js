// pages/obtain_identity/obtain_identity.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username:'',
    idcard:''
  },
  username_input(e){
    this.setData({
      username:e.detail
    })
  },
  idcard_input(e) {
    this.setData({
      idcard: e.detail
    })
  },
  submit_identity(){
    let that = this
    let openid = wx.getStorageSync('openid');
    // console.log(this.data)
    if(!this.check_name(this.data.username)){
      wx.showToast({
        title: "姓名格式不正确",
        icon: 'none',
        duration: 2000
      })
    }else if(!this.check_identity(this.data.idcard)){
      wx.showToast({
        title: "身份证号码输入不正确",
        icon: 'none',
        duration: 2000
      })
    }else{
      // todo 将身份信息传至后台
      wx.request({
        url: app.globalData.protocol + app.globalData.url + '/drift/user/check',
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        },
        data: {
          openid: openid,
          name: that.data.username,
          idno: that.data.idcard
        },
        success: function (response) {
          console.log(response.data)
          response = response.data
          if (response.responseCode === "RESPONSE_OK") {
             wx.showToast({
                title: "成功",
                icon: 'success',
                duration: 1000
             })
             setTimeout(()=>{
                 wx.switchTab({
                    url: '/pages/activity_detail/activity_detail'
                 })
            },1000)
          }
        }
      })
    }
  },

  check_identity (code) {
    var ts = this;
    //身份证号合法性验证 
    //支持15位和18位身份证号
    //支持地址编码、出生日期、校验位验证
    var city = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江 ", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北 ", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏 ", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外 " };
    var tip = "";
    var pass = true;
    var reg = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/;
    if (!code || !code.match(reg)) {
      tip = "身份证号格式错误";
      pass = false;
    } else if (!city[code.substr(0, 2)]) {
      tip = "地址编码错误";
      pass = false;
    } else {
      //18位身份证需要验证最后一位校验位
      if (code.length == 18) {
        code = code.split('');
        //∑(ai×Wi)(mod 11)
        //加权因子
        var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
        //校验位
        var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
        var sum = 0;
        var ai = 0;
        var wi = 0;
        for (var i = 0; i < 17; i++) {
          ai = code[i];
          wi = factor[i];
          sum += ai * wi;
        }
        var last = parity[sum % 11];
        if (parity[sum % 11] != code[17]) {
          tip = "校验位错误";
          pass = false;
        }
      }
    }
    console.log(pass)
    return pass;
  },
  check_name(name) {
    var ts = this;
    var reg = /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,6}$/;
    // console.log(name.match(reg))
    if (name.match(reg)) { 
      return true 
    }else{
      return false
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})