// pages/report/report.js

var util = require("../../utils/util.js");

const app = getApp();

Page({

  data: {
    lastY: 0,//监听滑动动作的记录数据
    page: 1,//定义一个页面，我们需要知道当前页面是第几页
    text: '',//这是一个判断向上和向下滑动的数据
    report_template_id: 'DRT202001095e2r5y76',
    template:'',
    report_data: '',
    list:[],
    order_id:'',
  },
  noneEnoughPeople() {
    //禁止页面滑动的方法，可以不做任何操作，但是必须要写
  },
  //滑动开始的操作，记录滑动开始的位置，用于判断是向上滑动还是向下滑动
  handletouchtart: function (event) {
    // 赋值
    this.data.lastY = event.touches[0].pageY
  },
  //滑动中，判断是向上还是向下
  handletouchmove(event) {
    let currentY = event.touches[0].pageY;
    let ty = currentY - this.data.lastY;
    if (ty < 0) {
      this.setData({
        text: '向上'
      })
    } else {
      this.setData({
        text: '向下'
      })
    }
    this.data.lastY = currentY
  },
  //滑动结束，通过判断是向上还是向下来计算页面滚动的位置
  handletouchend(event) {
    console.log(this.data.text, this.data.page)
    if (this.data.text == '向上') {
      if (this.data.page == 1) {
        wx.pageScrollTo({
          scrollTop: wx.getSystemInfoSync().windowHeight,
          duration: 500
        })
        this.setData({
          page: 2
        })
      } else if (this.data.page == 2) {
        wx.pageScrollTo({
          scrollTop: wx.getSystemInfoSync().windowHeight * 2,
          duration: 500
        })
        this.setData({
          page: 3
        })
      } else if (this.data.page == 3) {
        wx.pageScrollTo({
          scrollTop: wx.getSystemInfoSync().windowHeight * 3,
          duration: 500
        })
        this.setData({
          page: 4
        })
      } else if (this.data.page == 4) {
        wx.pageScrollTo({
          scrollTop: wx.getSystemInfoSync().windowHeight * 4,
          duration: 500
        })
        this.setData({
          page: 5
        })
      }
    } else {
      if (this.data.page == 2) {
        wx.pageScrollTo({
          scrollTop: 0,
          duration: 500
        })
        this.setData({
          page: 1
        })
      } else if (this.data.page == 3) {
        wx.pageScrollTo({
          scrollTop: wx.getSystemInfoSync().windowHeight,
          duration: 500
        })
        this.setData({
          page: 2
        })
      } else if (this.data.page == 4) {
        wx.pageScrollTo({
          scrollTop: wx.getSystemInfoSync().windowHeight * 2,
          duration: 500
        })
        this.setData({
          page: 3
        })
      } else if (this.data.page == 5) {
        wx.pageScrollTo({
          scrollTop: wx.getSystemInfoSync().windowHeight * 3,
          duration: 500
        })
        this.setData({
          page: 4
        })
      }
    }
  },

  obtain_template(report_template_id) {
    let that = this;
    wx.request({
      url: app.globalData.protocol + app.globalData.url +'/drift/report/template/query?reportTemplateId=' + report_template_id,
      // url: 'http://localhost:8026/drift/report/template/query?reportTemplateId=' + report_template_id,
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      success: function (response) {
        response = response.data;
        if (response.responseCode === "RESPONSE_OK") {
          that.setData({
            template: response.data[0]
          })
        }
      }
    })
  },

  obtain_report_detail(order_id) {
    let that = this
    // console.log(order_id)
    wx.showToast({
      title: '报告加载中',
      icon: 'loading',
      duration: 10000
    })
    wx.request({
      url: app.globalData.protocol + app.globalData.url +"/drift/report/query?orderId="+order_id,
      // url: "http://localhost:8026/drift/report/query?orderId=" + order_id,
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      success: function (response) {
        console.log(response.data)
        setTimeout(()=>{
          wx.hideToast();
        },500)
        let report_data = response.data.data[0];
        report_data['detectDate'] = util.formatTimeToDate(report_data.detectDate);
        report_data['liveDate'] = report_data.liveDate==null?"未填":util.formatTimeToDate(report_data.liveDate);
        report_data['decorateDate'] = report_data.decorateDate == null ? "未填" :util.formatTimeToDate(report_data.decorateDate)
        let list = report_data.list;
        let qua_cn = 0;
        let un_qua_cn = 0;
        let qua_en = 0;
        let un_qua_en = 0;
        for(let i=0;i<list.length;i++){
           if(list[i].data<=0.1){
             qua_cn++;
             list[i]['qua_cn'] = "合格"
           }else{
             un_qua_cn++;
             list[i]['qua_cn'] = "不合格"
           }
           if(list[i].data<=0.03){
             qua_en++;
             list[i]['qua_en'] = "合格"
           }else{
             un_qua_en++;
             list[i]['qua_en'] = "不合格"
           }
        }
        that.setData({
          report_data: report_data,
          qua_cn:qua_cn,
          qua_en:qua_en,
          un_qua_cn:un_qua_cn,
          un_qua_en:un_qua_en,
          list:list,
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.obtain_template(this.data.report_template_id);
    let order_id = options.orderId;
    this.obtain_report_detail(order_id);
    this.setData({
      order_id: order_id,
    })
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