const util = require('../../utils/util.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_id: "",
    activity_id:"",
    address: '',
    address_detail: '',
    name: '',
    phone: '',
    equip_name: '',
    annux_name: '',
    item_quantity: '',
    realPay: '',
    status: '',
    start_time: '',
    back_time:'',
    modal_hidden:true,
    company_array:['顺丰快递'],
    company_index: '0',
    company_value:['shunfeng'],
    expressId:'',
    list:[],
    equipPrice:'',
    annexPrice:'',
    back_address:'',
    back_name:'',
    back_phone:'',
    is_select:false,
    datelist:[],//日期范围list
    can_select_list: [],//可以选择的日期
    interval:2,
  },

  //日期选择
  daySelect(e){
    let start_time = e.detail.item.value
    let back_time = this.formatEndTime(start_time, this.data.interval)
    this.setData({
      start_time:start_time,
      back_time: back_time,
      is_select: false
    })
     console.log(start_time)
      this.update_expectDate(this.data.order_id,start_time)
  },

  select_day(e){
    console.log("select")
    this.setData({
      is_select:true
    })
  },
  toggleBottomPopup(e){
    this.setData({
      is_select: false
    })
  },

  //根据id修改expectDate
  update_expectDate(orderId,expectedDate){
    wx.request({
      url: app.globalData.protocol + app.globalData.url + '/drift/order/updateExpectedDate',
      method:'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      data: {
        orderId: orderId,
        expectedDate:expectedDate
      },
      success:function(response){
          response = response.data
          if (response.responseCode === "RESPONSE_OK"){
            wx.showToast({
              title: '修改成功',
              icon: 'success',
              duration: 2000
            })
          }else{
            wx.showToast({
              title: '修改失败',
              icon: 'none',
              duration: 2000
            })
          }
      }
    })
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
    let company = this.data.company_value[this.data.company_index]
    let that = this
    if(this.check_submit(expressId,company)){
      wx.request({
        url: app.globalData.protocol + app.globalData.url + '/drift/order/express/create',
        // url:'http://192.168.31.124:8015/drift/order/express/create',
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        },
        data: {
          orderId: orderId,
          expressNo: expressId,
          expressFlag: expressFlag,
          company: company,
        },
        success: function (response) {
          response = response.data
          console.log(response)
          if (response.responseCode === "RESPONSE_OK") {
            that.setData({
              modal_hidden: true
            })
            that.obtain_order_detail(that.data.order_id)
            wx.showToast({
              title: '提交成功',
              icon: 'success',
              duration: 2000
            })
          } else {
            wx.showToast({
              title: '提交失败',
              icon: 'none',
              duration: 2000
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
    this.setData({
      expressId:e.detail.value
    })
  },
  scan(e){
    let that = this
    wx.scanCode({
      success: (res) => {
        let str = res.result;
        that.setData({
          expressId: str
        })
      }
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
          that.obtain_activity(response.data.activityId)
          let expectedDate = response.data.expectedDate;
          let start_time = null,back_time=null
          if(expectedDate !== null){
            start_time = util.formatTimeToDate(expectedDate)
            back_time = util.formatTimeToDate(expectedDate + response.data.intervalDate * 86400000)
          }
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
            start_time:start_time,
            back_time:back_time,
            list:response.data.list,
            equipPrice: response.data.list[0].itemPrice,
            annexPrice: price
          })
        }
      }
    })
  },
  obtain_activity(activityId){
    let that = this
    wx.request({
      url: app.globalData.protocol + app.globalData.url + '/drift/activity/' + activityId + '/profile',
      success: function (response) {
        response = response.data;
        if (response.responseCode == 'RESPONSE_OK') {
          let item = response.data;
          console.log(item)
          that.setData({
             back_address:item.backAddress,
             back_name:item.backName,
             back_phone:item.backPhone
          })
        }
      }
    });
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

  toReport(){
     this.obtain_report_detail(this.data.order_id)
  },

  obtain_report_detail(order_id) {
    let that = this
    // console.log(order_id)
    wx.request({
      url: app.globalData.protocol + app.globalData.url +"/drift/report/query?orderId=" + order_id,
      // url: "http://localhost:8026/drift/report/query?orderId=" + order_id,
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      success: function (response) {
        response = response.data
        if(response.responseCode==="RESPONSE_OK"){
          wx.navigateTo({
            url: '/pages/report/report?orderId=' + order_id,
          })
        }else{
          wx.navigateTo({
            url: '/pages/report_submit/report_submit?orderId=' + order_id,
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    console.log(options)
    let that = this;
    let order_id = options.orderId;
    this.obtain_order_detail(order_id)
    that.setData({
      order_id: order_id
    })
    // this.obtain_order_detail(this.data.order_id)

    //获取日期list
    wx.request({
      url: app.globalData.protocol + app.globalData.url + '/drift/order/' + order_id,
      success: function (response) {
        response = response.data;
        if (response.responseCode == 'RESPONSE_OK') {
          that.setData({
            activity_id:response.data.activityId
          });
          //获取日期list
          wx.request({
            url: app.globalData.protocol + app.globalData.url + '/drift/activity/' + that.data.activity_id + '/available',
            success: function (response) {
              response = response.data;
              if (response.responseCode == 'RESPONSE_OK') {         
                response.data = that.formatResponse(response.data)
                that.setData({
                  can_select_list: that.formatSelectList(response.data),
                  datelist: that.formatList(response.data)
                })
                for (let i = 0; i < response.data.length; i++) {
                  let json = response.data[i]
                  // console.log(json)
                  for (let key in json) {
                    if (json[key] === true) {
                      let starttime = key
                      that.setData({
                        //start_time: starttime,
                        //back_time: that.formatEndTime(starttime, that.data.interval)
                      })
                      return
                    }
                  }
                }
              }
            }
          });
        }
      }
    });
  },

  formatResponse(data){
    let array = []
    for (let i = 0; i < data.length; i++) {
      let json = data[i]
      // console.log(json)
      for (let key in json) {
        if (new Date(key)>new Date("2020-01-23 23:59:59")&&new Date(key)<new Date("2020-01-30 23:59:59")) {
          json[key] = false
        }
      }
      array.push(json)
    }
    return array
  },

  formatSelectList(data){
    let array = []
    for (let i = 0; i < data.length; i++) {
      let json = data[i]
      // console.log(json)
      for (let key in json) {
        if (json[key] === true) {
          // console.log(key)
          array.push(key)
        }
      }
    }
    return array
  },
  formatList(data) {
    let array = []
    for (let i = 0; i < data.length; i++) {
      let json = data[i]
      for (let key in json) {
        array.push(key)
      }
    }
    return array
  },
  formatStartTime(start_date,new_date){
    // console.log(new_date.getTime())
    let result;
    if(start_date>=new_date.getTime){
      result = util.formatTimeToDate(start_date)
    }else{
      result = util.formatTimeToDate(new_date)
    }
    return result;
  },
  formatEndTime(start_time,interval){
    let result;
    let start = new Date(start_time)
    result = start.getTime() + 86400000*interval
    return util.formatTimeToDate(result)
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