// pages/address/address.js
const util = require('../../utils/util.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address_list:[],
    address:'',
  },
  //获取地址list
  obtain_data(){
    let openid = wx.getStorageSync('openid')
    let that = this
    wx.request({
      url: app.globalData.protocol + app.globalData.url + '/drift/address/list/byopenid?consumerId='+openid,
      success: response => {
        response = response.data
        console.log(response)
        if (response.responseCode === "RESPONSE_OK") {
          that.setData({
            address_list:response.data
          })
        } else if (response.responseCode === "RESPONSE_NULL"){
          that.setData({
            address_list: []
          })
        }
      }
    });
  },
  //点击编辑按钮
  edit_select(e){
     let addressId=e.currentTarget.dataset.id
     wx.navigateTo({
       url: '/pages/address_detail/address_detail?addressId='+addressId,
     })
  },
  //点击添加地址按钮
  add_select(e){
    console.log(e)
    wx.navigateTo({
      url: '/pages/address_detail/address_detail',
    })
  },
  //点击地址item
  address_select(e){
     let addressId = e.currentTarget.dataset.id
     let address = this.data.address
     address['addressId'] = addressId
     console.log(address)
     this.setData({
       address:address
     })
     wx.redirectTo({
       url: '/pages/apply_detail/apply_detail?address='+JSON.stringify(address),
     })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.obtain_data()
    let address = JSON.parse(options.address)
    if(address){
      this.setData({
        address:address
      })
    }
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
     this.obtain_data()
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