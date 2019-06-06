// pages/apply_detail/apply_detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    areaList:[],
    add_select:false,
    address:'',
  },
  city_select(){
    this.setData({
       add_select:true
    })
  },
  onCityConfirm(e){
     console.log(e);
     var value=e.detail.values;
     var address=value[0].name+value[1].name+value[2].name
     console.log(address)
     this.setData({
       add_select:false,
       address:address,
     })
  },
  onCityCancel(e){
    this.setData({
       add_select:false,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    wx.request({
      url: 'https://cashier.youzan.com/wsctrade/uic/address/getAllRegion.json',
      success: response => {
        console.log(response);
        this.setData({
          areaList: response.data.data
        });
      }
    });
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