// pages/express/express.js
const util = require('../../utils/util.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [{ time: '2019-08-22', desc: '待收货' }, { time: '2019-08-23', desc: '已发货' }, { time: '2019-08-23', desc: '快递到达南京分拨中心' }, { time: '2019-08-23', desc: '快递从南京发往上海' }, { time: '2019-08-24', desc: '快递到达上海浦东分拨中心' }, { time: '2019-08-24', desc: '等待配送' }, { time: '2019-08-25', desc: '已收货' }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     console.log(options.orderId)
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