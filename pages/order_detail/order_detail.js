const util = require('../../utils/util.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_id: "",
    address: '',
    address_detail: '',
    name: '',
    phone: '',
    equip_name: '',
    annux_name: '',
    item_quantity: '',
    realPay: '',
    status: '',
    time: '',
    modal_hidden:true
  },
  toPay(e){
    let orderId = this.data.order_id
    wx.redirectTo({
      url: '/pages/order_confirm/order_confirm?orderId=' + orderId
    })
  },
  addOrder(e){
    this.setData({
      modal_hidden:false
    })
  },
  cancel(e){
    this.setData({
      modal_hidden: true
    })
  },
  confirm(e) {
    this.setData({
      modal_hidden: true
    })
  },
  obtain_order_detail(order_id) {
    let that = this
    // console.log(order_id)
    wx.request({
      url: app.globalData.protocol + app.globalData.url + '/drift/order/' + order_id,
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      success: function (response) {
        console.log(response)
        response = response.data
        if (response.responseCode === "RESPONSE_OK") {
          let time = util.formatTimeToDate(response.data.expectedDate) + '至' + util.formatTimeToDate(response.data.expectedDate + response.data.intervalDate * 86400000)
          that.setData({
            address: response.data.province + response.data.city + response.data.district,
            address_detail: response.data.address,
            name: response.data.consignee,
            phone: response.data.phone,
            equip_name: response.data.list[0].itemName,
            annux_name: response.data.list[1].itemName,
            item_quantity: response.data.list[1].quantity,
            realPay: response.data.realPay * 100,
            status:response.data.status,
            time:time,
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let order_id = options.orderId;
    this.obtain_order_detail(order_id)
    that.setData({
      order_id: order_id
    })
    // this.obtain_order_detail(this.data.order_id)
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