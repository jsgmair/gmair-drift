// pages/activity_detail/activity_detail.js

var util = require("../../utils/util.js");

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    acitivity_id: 'ACT20190723a545nr39',
    act_name: '',
    act_desc: '',
    start_date: '',
    end_date: '',
    host: '',
    registered_size: 0,
    notification: '',
    areaList:[],
    leftIcon: {
      type: String,
      value: ''
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.request({
      url: app.globalData.protocol + app.globalData.url + '/drift/activity/' + that.data.acitivity_id + '/profile',
      success: function(response) {
        console.log(response)
        response = response.data;
        if(response.responseCode == 'RESPONSE_OK') {
          let item = response.data;
          let start_date = util.formatTimeToDateCN(item.startTime);
          let end_date = util.formatTimeToDateCN(item.endTime);
          that.setData({ act_name: item.activityName, act_desc: item.introduction, start_date: start_date, end_date: end_date, host: item.host, notification: '尊敬的用户, 本次活动——' + item.activityName + ', 由' + item.host + "发起, 活动时间为: " + start_date + '-' + end_date + ', 欢迎参加'});
        }
      }
    });
    // console.log(that.data)
    wx.request({
      url: app.globalData.protocol + app.globalData.url + '/drift/order/summary?activityId=' + that.data.acitivity_id,
      success: function(response) {
        // console.log(response)
        response = response.data
        if (response.responseCode == 'RESPONSE_OK') {
          let item = response.data
          that.setData({registered_size: item.size})
        }
      }
    });
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

  },

  more(){
    wx.showModal({
      content: '本甲醛检测仪完全满足GB/T 18204.2《公共场所卫生检验方法 第2部分：化学污染物》7.4光电光度法要求。甲醛气体通过检测单元时，检测单元中浸有发色剂的纸因化学反应其颜色由白色变为黄色。变色的程度所引起反射光强度的变化与甲醛浓度呈函数关系，根据反射光量强度的变化率测定甲醛的浓度。待仪器达到试纸反应时间读取数值。',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        }
      }
    });
  },
  acctivity_apply(){
    let activity_id = this.data.activity_id;
    wx.navigateTo({
      url: '../apply_detail/apply_detail?activityId=' + activity_id
    }) 
  }
})