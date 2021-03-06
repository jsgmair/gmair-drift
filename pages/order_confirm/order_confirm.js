// pages/order_confirm/order_confirm.js
const util = require('../../utils/util.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_id:"",
    // order_id: "GMO20190731oa7hx818",
    address:'',
    address_detail:'',
    name:'',
    phone:'',
    equip_name:'',
    annux_name:'',
    item_quantity:'',
    realPay:'',
    code:'',
    input_disabled:false,
    list:[],
    excode:'',
    cutPrice:0
  },
  obtain_order_detail(order_id){
    let that = this
    console.log(order_id)
    wx.request({
      url: app.globalData.protocol + app.globalData.url + '/drift/order/'+order_id,
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      success: function (response) {
        console.log(response.data.data)
        response = response.data
        if (response.responseCode === "RESPONSE_OK") {
          let num = 0
          // let price = 0
          // for(let i = 1;i<response.data.list.length;i++){
          //   num += response.data.list[i].quantity * response.data.list[i].singleNum
          //   price += response.data.list[i].quantity * response.data.list[i].itemPrice
          // }
          that.setData({
            address: response.data.province + response.data.city + response.data.district,
            address_detail: response.data.address,
            name: response.data.consignee,
            phone: response.data.phone,
            equip_name: response.data.list[0].itemName,
            // annux_name: response.data.list[1].itemName,
            item_quantity: num,
            realPay:response.data.realPay*100,
            cutPrice: response.data.totalPrice-response.data.realPay,
            equipPrice: response.data.list[0].itemPrice,
            // annexPrice: price
            list:response.data.list,
            excode:response.data.excode
          })
        }
      }
    })
  },
  submit_code(e){
    let that = this
    wx.request({
      url: app.globalData.protocol + app.globalData.url + '/drift/order/pay/confirm',
      // url: 'http://localhost:8015/drift/order/pay/confirm',
      // url: app.globalData.protocol + app.globalData.url + '/drift/user/decode/phone',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      data: {
        orderId:that.data.order_id,
        code:that.data.code
      },
      success: function (response) {
        response = response.data
        console.log(response)
        if (response.responseCode === "RESPONSE_OK") {
           that.setData({
             input_disabled:true,
             realPay: response.data.realPay * 100,
             excode:response.data.excode,
             cutPrice: response.data.totalPrice - response.data.realPay,
           })
        }else{
          wx.showToast({
            title: response.description,
            icon: 'none',
            duration: 4000
          })
        }
      }
    })
  },
  onClickButton(e){
    let that = this
    console.log('支付')
    wx.request({
      url: app.globalData.protocol + app.globalData.url + '/drift/order/payment/'+that.data.order_id+'/info',
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      success: function (response) {
        console.log(response)
        response = response.data
        if (response.responseCode === "RESPONSE_OK") {
          console.log(response.data.timeStamp)
            wx.requestPayment({
              timeStamp: response.data.timeStamp,
              nonceStr: response.data.nonceStr,
              package: response.data.package,
              signType: response.data.signType,
              paySign: response.data.paySign,
              // total_fee: response.data[0].total_fee,
              success(res) {
                console.log('success')
                wx.switchTab({
                  url: '/pages/order_list/order_list'
                })
              },
              fail(res) {
                // wx.showToast({
                //   title: '支付失败',
                //   icon: 'none',
                //   duration: 2000
                // })
              }
          })
        }else if(response.responseCode==="RESPONSE_ERROR"){
          wx.showToast({
            title: response.description,
            icon: 'none',
            duration: 3000
          })
        }
      }
    })

  },
  codeInput(e){
    let code = e.detail.value
    this.setData({
      code:code
    })
  },
  scan(e) {
    var that = this;
    wx.scanCode({
      success: (res) => {
        console.log(res)
        wx.request({
          // url: 'https://microservice.gmair.net/install-mp/qrcode/decode',
          url: app.globalData.protocol + app.globalData.url + '/install-mp/qrcode/decode',
          method: 'post',
          data: {
            url: res.result,
          },
          header: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
          },
          success: function (response) {
            console.log(response)
            if (response.data.responseCode === "RESPONSE_OK") {
              var codeValue = response.data.data[0].codeValue;
              console.log(codeValue);
              that.setData({
                code:codeValue
              })
              that.submit_code();
            }
          }
        })
      }
    })
    // this.check_submit()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    let that=this;
    let order_id=options.orderId;
    // order_id = 'GMO20190903airhwu31'
    this.obtain_order_detail(order_id)
    that.setData({
      order_id:order_id
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
