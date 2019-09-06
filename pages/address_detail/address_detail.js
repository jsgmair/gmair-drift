// pages/address_detail/address_detail.js
const util = require('../../utils/util.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressId:'',
    areaList:[],
    checked:false,
    name:'',
    phone:'',
    province:'',
    city:'',
    district:'',
    address_detail:'',
    address:'',
    add_select: false,
    type:0,   //type可选项设为0/1  0表示添加地址，1表示修改地址
  },
  nameInput(e){
    let name=e.detail.value;
    this.setData({
      name:name
    })
  },
  phoneInput(e){
    let phone=e.detail.value;
    this.setData({
      phone:phone
    })
  },
  onChange(e){
    let checked=this.data.checked;
    checked = !checked;
    this.setData({
      checked:checked
    })
  },
  city_select() {
    this.setData({
      add_select: true
    })
  },
  //城市选择取消
  onCityCancel(e) {
    this.setData({
      add_select: false,
    })
  },
  onCityConfirm(e) {
    // console.log(e);
    var value = e.detail.values;
    var address = value[0].name + value[1].name + value[2].name
    //  console.log(address)
    this.setData({
      add_select: false,
      province: value[0].name,
      city: value[1].name,
      district: value[2].name,
    })
  },
  detailInput(e){
     let address_detail = e.detail.value;
     this.setData({
       address_detail:address_detail
     })
  },
  delete(e){
    let that = this
    wx.showModal({
      title: '删除提示',
      content: '确定要删除该地址吗？',
      confirmText: '删除',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.protocol+app.globalData.url+'/drift/address/delete?addressId='+that.data.addressId,
            success: function (response) {
              response = response.data
              console.log(response)
              if(response.responseCode==="RESPONSE_OK"){
                wx.navigateBack({
                  delta: 1
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
  save(e){
    let that = this
    let openid = wx.getStorageSync('openid')
    if(that.data.type === 0){
      if (this.check_submit()) {
        let defaultAddress = that.data.checked ? 1 : 0
        wx.request({
          url: app.globalData.protocol + app.globalData.url + '/drift/address/create',
          method: 'POST',
          header: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
          },
          data: {
            consumerId: openid,
            consignee: that.data.name,
            province: that.data.province,
            city: that.data.city,
            district: that.data.district,
            addressDetail: that.data.address_detail,
            phone: that.data.phone,
            defaultAddress: defaultAddress
          },
          success: function (response) {
            response = response.data
            // console.log(response.responseCode)
            if (response.responseCode === "RESPONSE_OK") {
              wx.navigateBack({
                delta: 1
              })
            }
          }
        })
      }
    } else if (that.data.type == 1) {
      if (this.check_submit()) {
        let defaultAddress = that.data.checked ? 1 : 0
        wx.request({
          url: app.globalData.protocol + app.globalData.url + '/drift/address/update',
          method: 'POST',
          header: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
          },
          data: {
            consumerId: openid,
            addressId:that.data.addressId,
            consignee: that.data.name,
            province: that.data.province,
            city: that.data.city,
            district: that.data.district,
            addressDetail: that.data.address_detail,
            phone: that.data.phone,
            defaultAddress: defaultAddress
          },
          success: function (response) {
            response = response.data
            // console.log(response.responseCode)
            if (response.responseCode === "RESPONSE_OK") {
              wx.navigateBack({
                delta: 1
              })
            }
          }
        })
      }
    }
  },
  check_submit(){
    let toast=""
    let that = this;
    let result = false
    if(that.data.name === ""){
      toast = "请填写收货人姓名"
    } else if (!util.validate_mobile(that.data.phone)){
      toast = "请输入正确的收货人手机号"
    } else if(that.data.province === ''){
      toast = "请选择省市区"
    } else if(that.data.address_detail===""){
      toast = "请输入详细地址"
    } else {
      result = true
      return result
    }
    wx.showToast({
      title: toast,
      icon: 'none'
    })
    return result;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    if(options.addressId){
      let addressId = options.addressId
      that.setData({
        addressId:addressId,
        type:1
      })
      wx.request({
        url: app.globalData.protocol + app.globalData.url + '/drift/address/by/addressid?addressId=' + addressId,
        success: response => {
          response = response.data
          console.log(response)
          if (response.responseCode === "RESPONSE_OK") {
            let item = response.data[0]
            let checked = item.defaultAddress === 1
            console.log(item)
            that.setData({
              name: item.consignee,
              phone: item.phone,
              province: item.province,
              city: item.city,
              district: item.district,
              address_detail: item.addressDetail,
              checked: checked
            })
          }
        }
      });
    }else{
      console.log('none')
      that.setData({
        type:0
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
    wx.request({
      url: 'https://cashier.youzan.com/wsctrade/uic/address/getAllRegion.json',
      success: response => {
        // console.log(response);
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