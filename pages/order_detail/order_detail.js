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
    modal_hidden:true,
    company_array:['顺丰快递'],
    company_index: '0',
    expressId:'',
    equipPrice:'',
    annexPrice:'',
    attach1: {},
    attach2: {},
  },
  check_submit(expressId,company){
    if(expressId === ""||company === ""|| company == undefined){
      return false
    }else{
      return true
    }
  },
  expressIdSubmit(){
    let orderId = this.data.order_id
    let expressId = this.data.expressId
    let expressFlag = 1
    let company = this.data.company_array[this.data.company_index]
    let that = this
    if(this.check_submit(expressId,company)){
      wx.request({
        url: app.globalData.protocol + app.globalData.url + '/drift/express/create',
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        },
        data: {
          orderId: orderId,
          expressId: expressId,
          expressFlag: expressFlag,
          company: company
        },
        success: function (response) {
          response = response.data
          console.log(response)
          if (response.responseCode === "RESPONSE_OK") {
            that.obtain_order_detail(that.data.order_id)
            that.setData({
              modal_hidden: true
            })
          }
        }
      })
    }else{
      wx.showToast({
        title: '请检查信息是否填写完整',
        icon: 'none',
        duration: 2000
      })
    }
    
  },
  expressIdInput(e){
    wx.scanCode({
      success: (res) => {
        console.log(res)
      }
    })
    this.setData({
      expressId:e.detail.value
    })
  },
  bindCompanyChange(e){
    // console.log(e)
    this.setData({
      company_index:e.detail.value
    })
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
          let num = 0
          let price = 0
          // for (let i = 1; i < response.data.list.length; i++) {
          //   num += response.data.list[i].quantity * response.data.list[i].singleNum
          //   price+= response.data.list[i].quantity * response.data.list[i].itemPrice
          // }
          that.setData({
            address: response.data.province + response.data.city + response.data.district,
            address_detail: response.data.address,
            name: response.data.consignee,
            phone: response.data.phone,
            equip_name: response.data.list[0].itemName,
            annux_name: response.data.list[1].itemName,
            item_quantity: num,
            realPay: response.data.realPay.toFixed(2),
            status:response.data.status,
            time:time,
            attach1: response.data.list[1],
            attach2: response.data.list[2],
            equipPrice: response.data.list[0].itemPrice,
            annexPrice: price
          })
        }
      }
    })
  },
  express(e){
     console.log(e);
     wx.navigateTo({
       url: '/pages/express/express?orderId='+this.data.order_id,
     })
  },
  order_cancel(e){
    let that = this
    // console.log(order_id)
    wx.showModal({
      title: '取消订单',
      content: '确定要取消该订单吗？',
      confirmText: '取消订单',
      cancelText: '点错了',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.protocol + app.globalData.url + '/drift/order/cancel',
            method: 'POST',
            data: {
              orderId: that.data.order_id,
            },
            header: {
              "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
            },
            success: function (response) {
              console.log(response)
              response = response.data
              if (response.responseCode === "RESPONSE_OK") {
                wx.switchTab({
                  url: '/pages/order_list/order_list'
                })
              }
            }
          })
        } else if (res.cancel) {
          console.log('取消')
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
    // order_id ="GMO20190909zh2l8o5"
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