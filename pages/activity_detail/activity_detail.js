// pages/activity_detail/activity_detail.js

var util = require("../../utils/util.js");

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activity_id: 'ACT20190723a545nr39',
    act_name: '',
    act_desc: '',
    start_date: '',
    end_date: '',
    host: '',
    registered_size: 0,
    notification: '',
    thumbnails: [],
    areaList:[],
    leftIcon: {
      type: String,
      value: ''
    },
    equip_id:'',
    equip_name:'',
    activity_type:0,
    type:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.obtain_equip();
    //获取活动信息
    wx.request({
      url: app.globalData.protocol + app.globalData.url + '/drift/activity/' + that.data.activity_id + '/profile',
      success: function(response) {
        console.log(response)
        response = response.data;
        if(response.responseCode == 'RESPONSE_OK') {
          let item = response.data;
          let start_date = util.formatTimeToDateCN(item.openDate);
          let end_date = util.formatTimeToDateCN(item.closeDate);
          let newDate=new Date().getTime();
          let activity_type;
          if(newDate<item.openDate){
            activity_type=0
          }else if(newDate>item.closeDate){
            activity_type = 2
          }else{
            activity_type = 1
          }
          that.setData({ act_name: item.activityName, act_desc: item.introduction, start_date: start_date, end_date: end_date, host: item.host, activity_type: activity_type});
        }
      }
    });
    //获取活动图片信息
    wx.request({
      url: app.globalData.protocol + app.globalData.url + '/drift/activity/' + that.data.activity_id + '/thumbnail',
      success: function(response) {
        response = response.data;
        // console.log(JSON.stringify(response.data))
        console.log(response)
        if(response.responseCode == 'RESPONSE_OK') {
          response = response.data;
          let paths = [];
          for (let i = 0; i < response.length; i ++) {
            paths.push(response[i].thumbnailPath)
          }
          // console.log(paths)
          that.setData({ thumbnails: paths})
        }
      } 
    })
    // console.log(that.data)
    //获取活动的报名人数
    wx.request({
      url: app.globalData.protocol + app.globalData.url + '/drift/order/summary?activityId=' + that.data.activity_id,
      success: function(response) {
        response = response.data
        // console.log(JSON.stringify(response))
        if (response.responseCode == 'RESPONSE_OK') {
          let item = response.data
          that.setData({registered_size: item.size})
        }
      }
    });
    //获取活动的通知信息
    wx.request({
      url: app.globalData.protocol + app.globalData.url + '/drift/activity/' + that.data.activity_id + '/notification',
      success: function(response) {
        response = response.data;
        if(response.responseCode == 'RESPONSE_OK') {
          let list = response.data;
          let message = '';
          // console.log(JSON.stringify(list[0].context))
          for (let i = 0; i < list.length; i++) {
            message += list[i].context;
          }
          // console.log(message)
          that.setData({ notification: message})
        }
      }
    })
  },
  //根据activityId获取equip详情
  obtain_equip(){
    let that = this;
    wx.request({
      url: app.globalData.protocol + app.globalData.url + '/drift/activity/getEquip/by/' + that.data.activity_id,
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      success: function (response) {
        response = response.data;
        if (response.responseCode == 'RESPONSE_OK') {
          that.setData({
            equip_id:response.data[0].equipmentId,
            equip_name:response.data[0].equipmentName
          })
        }
      }
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
    let that=this
    //获取活动的报名人数
    wx.request({
      url: app.globalData.protocol + app.globalData.url + '/drift/order/summary?activityId=' + that.data.activity_id,
      success: function (response) {
        response = response.data
        // console.log(JSON.stringify(response))
        if (response.responseCode == 'RESPONSE_OK') {
          let item = response.data
          that.setData({ registered_size: item.size })
        }
      }
    });
    that.obtain_info();
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
    wx.navigateTo({
      url: '/pages/equip_detail/equip_detail'
    })
    // wx.showModal({
    //   content: '本甲醛检测仪完全满足GB/T 18204.2《公共场所卫生检验方法 第2部分：化学污染物》7.4光电光度法要求。甲醛气体通过检测单元时，检测单元中浸有发色剂的纸因化学反应其颜色由白色变为黄色。变色的程度所引起反射光强度的变化与甲醛浓度呈函数关系，根据反射光量强度的变化率测定甲醛的浓度。待仪器达到试纸反应时间读取数值。',
    //   showCancel: false,
    //   success: function (res) {
    //     if (res.confirm) {
    //       console.log('用户点击确定')
    //     }
    //   }
    // });
  },
  obtain_info(){
    let that = this
    let openid = wx.getStorageSync('openid')
    wx.request({
      url: app.globalData.protocol + app.globalData.url + '/drift/user/info?openid=' + openid,
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      success: function (response) {
        response = response.data;
        console.log(response)
        if (response.responseCode === "RESPONSE_OK") {
          if (response.data[0].phone) {
            that.setData({
              type:2
            })
          }else{
            that.setData({
              type:1
            })
          }
        }else {
          that.setData({
            type: 0
          })
        } 
      }
  })
},
  activity_apply1(e){
    let openid = wx.getStorageSync('openid');
    let that = this;
    if(e.detail.errMsg === "getUserInfo:ok") {
      let iv = e.detail.iv
      let data = e.detail.encryptedData
      wx.request({
        url: app.globalData.protocol + app.globalData.url + '/drift/user/decode/user',
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        },
        data: {
          openid: openid,
          iv: iv,
          data: data
        },
        success: function (response) {
          response = response.data
          console.log(response)
          if (response.responseCode === "RESPONSE_OK") {
            that.setData({
              type:1
            })
          }
        }
      })
    }
  },
  activity_apply2(e) {
    let openid = wx.getStorageSync('openid');
    let that = this;
    console.log(e)
    if (e.detail.errMsg === "getPhoneNumber:ok") {
      let iv = e.detail.iv
      let data = e.detail.encryptedData
      wx.request({
        // url: 'https://microservice.gmair.net/drift/user/decode/phone',
        url: app.globalData.protocol + app.globalData.url + '/drift/user/decode/phone',
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        },
        data: {
          openid: openid,
          iv: iv,
          data: data
        },
        success: function (response) {
          response = response.data
          console.log(response)
          if (response.responseCode === "RESPONSE_OK") {
            that.setData({
              type:2
            })
          }
        }
      })
    }
  },
  activity_apply3(e) {
    let activity_id=this.data.activity_id;
    let equip_id = this.data.equip_id;
    wx.showModal({
      title: '使用提示',
      content: '仪器使用完毕后，需按照约定时间顺丰寄回，邮费用户自理',
      confirmText: '确认申请',
      success(res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/apply_detail/apply_detail?activityId=' + activity_id + '&equipId=' + equip_id
          })
        } else if (res.cancel) {
            console.log('用户点击取消')
        }
      }
    })
  }
})