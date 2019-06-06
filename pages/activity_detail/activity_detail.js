// pages/activity_detail/activity_detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    wx.navigateTo({
      url: '../apply_detail/apply_detail'
    }) 
  }
})