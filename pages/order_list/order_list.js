// pages/order_list/order_list.js
var util = require("../../utils/util.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    size: 0,
    order_list: [],
    time:'',
  },
  listClick (e) {
    console.log(e)
    let orderId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/order_detail/order_detail?orderId=' + orderId
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  obtain_list(){
    let that = this;
    let openid = wx.getStorageSync('openid')
    wx.request({
      url: app.globalData.protocol + app.globalData.url + '/drift/order/' + openid + '/list',
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      success: function (response) {
        response = response.data
        if (response.responseCode == 'RESPONSE_OK') {
          let orders = response.data;
          for (let i = 0; i < orders.length; i++) {
            orders[i].time = util.formatTimeToDate(orders[i].expectedDate) + '至' + util.formatTimeToDate(orders[i].expectedDate + orders[i].intervalDate * 86400000)
            let num = 0
            for (let j = 1; j < orders[i].list.length; j++) {
              // console.log(orders[i].list[j].quantity)
              num += orders[i].list[j].quantity * orders[i].list[j].singleNum
            }
            // console.log(num)
            orders[i].item_quantity = num
          }
          console.log(orders)
          orders.reverse()
          that.setData({ size: orders.length, order_list: orders })
        }
      }
    })
  },
  onLoad: function (options) {
     this.obtain_list()
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
    this.obtain_list()
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
