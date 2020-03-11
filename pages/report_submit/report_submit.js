// pages/report_submit/report_submit.js
var util = require("../../utils/util.js");

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_id:'',
    response_data:'',
    report_template_id:'DRT202001095e2r5y76',
    detect_date: util.formatTimeToDate(new Date()),
    live_date: '无',
    decorate_date: '无',
    close_type:['否','是'],
    is_closed:0,
    temperature: ['0℃及以下', '1℃', '2℃', '3℃', '4℃', '5℃', '6℃', '7℃', '8℃', '9℃', '10℃', '11℃', '12℃', '13℃', '14℃', '15℃', '16℃', '17℃', '18℃', '19℃', '20℃', '21℃', '22℃', '23℃', '24℃', '25℃', '26℃', '27℃', '28℃', '29℃', '30℃', '31℃', '32℃', '33℃', '34℃', '35℃及以上'],
    temperature_index:16,
    data:[{id:util.setSixRandom(),position:'',area:'',data:''}],
    submit_ready:false,
    is_report:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    let that = this;
    let order_id = options.orderId;
    console.log(order_id);
    // order_id = "GMO20200107frn42g71"
    this.obtain_order_detail(order_id);
    this.obtain_template(this.data.report_template_id);
    this.setData({
      order_id:order_id
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
        console.log(response.data)
        let order_data = response.data.data;
        order_data['consigneeAddress'] = order_data.province + order_data.city + order_data.district + order_data.address
        console.log(order_data)
        that.setData({
          order_data: order_data,
          detect_date:util.formatTimeToDate(order_data.expectedDate)
        })
      }
    })
  },

  obtain_template(report_template_id){
    let that = this;
    wx.request({
      url: app.globalData.protocol + app.globalData.url +'/drift/report/template/query?reportTemplateId=' +report_template_id,
      // url: 'http://localhost:8026/drift/report/template/query?reportTemplateId=' + report_template_id,
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      success: function (response) {
        response = response.data;
        if (response.responseCode === "RESPONSE_OK") {
          that.setData({
            template:response.data[0]
          })
        }
      }
    })
  },

  switch_change(e) {
    this.setData({
      add_switch: e.detail.value
    })
  },

  detectDateChange(e) {
    var detect_date = util.formatTimeToDate(e.detail.value);
    this.setData({
      detect_date: detect_date,
    })
  },

  liveDateChange(e) {
    var live_date = util.formatTimeToDate(e.detail.value);
    this.setData({
      live_date: live_date,
    })
  },

  decorateDateChange(e) {
    var decorate_date = util.formatTimeToDate(e.detail.value);
    this.setData({
      decorate_date: decorate_date,
    })
  },

  bindcloseChange(e){
    this.setData({
      is_closed:parseInt(e.detail.value)
    })
  },

  temperatureChange(e){
    this.setData({
      temperature_index: parseInt(e.detail.value)
    })
  },

  addData(){
    let data = this.data.data;
    let id = util.setSixRandom();
    let json = { id: id, position: '', area: '', data: '' };
    data.push(json);
    this.setData({
      data:data,
      submit_ready:this.checkSubmit(data)
    })
  },

  positionInput(e){
    console.log(e)
    let data = this.data.data;
    let id = e.currentTarget.dataset.id;
    data.map((item,index)=>{
      if(item.id === id ){
        item.position = e.detail.value
      }
    })
    this.setData({
      data:data,
      submit_ready:this.checkSubmit(data)
    })
  },
  areaInput(e) {
    console.log(e)
    let data = this.data.data;
    let id = e.currentTarget.dataset.id;
    if (!util.isNumber(e.detail.value)){
      return
    }
    data.map((item, index) => {
      if (item.id === id) {
        item.area = e.detail.value
      }
    })
    this.setData({
      data: data,
      submit_ready: this.checkSubmit(data)
    })
  },
  dataInput(e) {
    console.log(e)
    let data = this.data.data;
    let id = e.currentTarget.dataset.id;
    if (!util.isNumber(e.detail.value)) {
      return
    }
    data.map((item, index) => {
      if (item.id === id) {
        item.data = e.detail.value
      }
    })
    console.log(this.checkSubmit(data))
    this.setData({
      data: data,
      submit_ready: this.checkSubmit(data)
    })
  },

  deleteItem(e){
    console.log(e)
    let data = this.data.data;
    if(data.length<=1){
      wx.showToast({
        title: '至少要有一组数据',
        icon: 'none',
        duration: 2000
      })
      return
    }
    let id = e.currentTarget.dataset.id;
    let newData = []
    data.map((item, index) => {
      if (item.id !== id) {
         newData.push(item)
      }
    })
    console.log(data);
    console.log(newData);
    this.setData({
      data: newData,
      submit_ready: this.checkSubmit(newData)
    })
  },

  checkSubmit(data){
    
    let result = true
    if(data.length<1){
       result = false;
    }
    console.log(data)
    for(let i=0;i<data.length;i++){
      if (!util.isNumber(data[i].area) || !util.isNumber(data[i].data) || data[i].position == "") {
        result = false;
        break;
      }
    }
    return result;
  },

  submit(){
    let that = this;
    that.setData({
      submit_ready:false,
    })
    wx.showToast({
      title: '报告生成中',
      icon: 'loading',
      duration: 10000
    })
    let dataItem = JSON.stringify(that.data.data);
    let liveDate = that.data.live_date == "无" ? '' : that.data.live_date;
    let decorateDate = that.data.decorate_date == "无" ? '' : that.data.decorate_date
    wx.request({
      url: app.globalData.protocol + app.globalData.url +'/drift/report/create',
      // url: 'http://localhost:8026/drift/report/create',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      data: {
        orderId: that.data.order_id,
        detectDate: that.data.detect_date,
        liveDate: liveDate,
        decorateDate: decorateDate,
        isClosed: that.data.is_closed,
        temperature: that.data.temperature[that.data.temperature_index],
        reportTemplateId: that.data.report_template_id,
        dataItem:dataItem,
      },
      success: function (response) {
        console.log(response)
        response = response.data;
        if (response.responseCode == 'RESPONSE_OK') {
          wx.request({
            url: app.globalData.protocol + app.globalData.url+'/drift/report/query?orderId=' + that.data.order_id,
            header: {
              "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
            },
            success: function (response) {
              response = response.data;
              console.log(response);
              if (response.responseCode === "RESPONSE_OK") {
                setTimeout(() => {
                  wx.hideToast();
                  wx.showToast({
                    title: '报告生成成功',
                    icon: 'success',
                    duration: 2000
                  })
                  setTimeout(() => {
                    wx.redirectTo({
                      url: '/pages/report/report?orderId='+that.data.order_id,
                    })
                  }, 2000)
                }, 1000)
              }
            }
          })
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

  }
})