// pages/apply_detail/apply_detail.js
const util = require('../../utils/util.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activity_id: '',
    equip_id:'',
    act_name: '',
    act_desc: '',
    start:'',
    end:'',
    start_date: '',//活动开始时间
    end_date: '',//活动截止时间
    areaList:[],
    add_select:false,
    address:'',
    province:'',
    city:'',
    district:'',
    name:'',
    phone:'',
    phone_true:false,
    btn_text:"获取手机号",
    code_send:'',//后台返回的验证码
    code:'',
    address_detail:'',
    starttime:"",//个人选择时间
    interval:0,
    endtime:'2019-07-30',
    // day_list:["3","5","7"],//从后台获取可选时间
    // day_index:0,
    annex_num:1,
    is_check:false,
    submit_ready:false,
    obtain_click:false,//获取验证码是否点击
  },
  //弹起框选择城市
  city_select(){
    this.setData({
       add_select:true
    })
  },
  //城市选择确定
  onCityConfirm(e){
     console.log(e);
     var value=e.detail.values;
     var address=value[0].name+value[1].name+value[2].name
    //  console.log(address)
     this.setData({
       add_select:false,
       address:address,
       province:value[0].name,
       city:value[1].name,
       district:value[2].name,
     })
    this.check_submit_ready(this.data.name, this.data.phone, address, this.data.address_detail, this.data.starttime, this.data.interval,this.data.is_check);
  },
  //城市选择取消
  onCityCancel(e){
    this.setData({
       add_select:false,
    })
  },
  //姓名输入
  name_input(e){
      this.setData({
        name:e.detail.value,
      })
    this.check_submit_ready(e.detail.value, this.data.phone, this.data.address, this.data.address_detail, this.data.starttime, this.data.interval, this.data.is_check);
  },
 //电话输入
  phone_input(e){
     var phone=e.detail.value;
     var phone_true;
     if (util.validate_mobile(phone)===true){
        phone_true=true;
     }else{
        phone_true=false;
     }
     this.setData({
       phone:phone,
       phone_true:phone_true,
     })
     console.log(phone_true)
    this.check_submit_ready(this.data.name, phone,this.data.address, this.data.address_detail, this.data.starttime, this.data.interval, this.data.is_check);
  },
  //验证码按钮点击
  btn_obtain_click(e){
    let that = this;
    let openid = wx.getStorageSync('openid')
    // that.setData({
    //    obtain_click:true,
    // })
    if (e.detail.errMsg === "getPhoneNumber:ok"){
      let iv = e.detail.iv
      let data = e.detail.encryptedData
      wx.request({
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
          response=response.data
          if(response.responseCode==="RESPONSE_OK"){
            that.setData({
              phone:response.data
            })
          }
        }
      })
    }
    // if(e.currentTarget.dataset.isable===false){
    //    var interval = 60;
    //    var verification_interval = setInterval(() => {
    //      interval = interval - 1;
    //      that.setData({ btn_text: interval + 's后获取' });
    //      if (interval < 0) {
    //        that.setData({ btn_text: '获取手机号', obtain_click:false});
    //        clearInterval(verification_interval);
    //      }
    //    }, 1000);
    //  }
  },
  //验证码输入
  code_input(e){
     this.setData({
        code:e.detail.value,
     })
    this.check_submit_ready(this.data.name, this.data.phone, this.data.address, this.data.address_detail, this.data.starttime, this.data.interval,this.data.is_check);
  },
  detail_address_input(e){
     this.setData({
        address_detail:e.detail.value,
     })
    this.check_submit_ready(this.data.name, this.data.phone, this.data.address, e.detail.value, this.data.starttime, this.data.interval, this.data.is_check);
  },
  //开始时间选择
  bindStartTimeChange(e){
    let endtime=this.formatEndTime(e.detail.value,this.data.interval)
     this.setData({
        starttime:e.detail.value,
        endtime:endtime
     })
    this.check_submit_ready(this.data.name, this.data.phone, this.data.address, this.data.address_detail,e.detail.value, this.data.day_index);
  },
  //使用时长选择
  // day_length_change(e){
  //     this.setData({
  //        day_index:e.detail.value
  //     })
  //   this.check_submit_ready(this.data.name, this.data.phone, this.data.phone_true, this.data.code, this.data.code_send, this.data.address, this.data.address_detail, this.data.time, e.detail.value, this.data.is_check);
  // },
  //试纸等数量
  num_change(e){
    this.setData({
      annex_num:e.detail,
    })
  },
  //协议check
  check_change(e){
      var that=this;
      var is_check;
      if(e.detail.value.length>0){
        is_check=true;
      }else{
        is_check=false;
      }
    this.check_submit_ready(this.data.name, this.data.phone, this.data.address, this.data.address_detail, this.data.starttime, this.data.interval, is_check);
      that.setData({
        is_check:is_check,
      })
  },
  //判断是否可以提交，满足姓名、手机号、验证码正确、地址、详细地址、开始时间、使用天数均已选择填写
  check_submit_ready(name, phone,address, address_detail, starttime, interval, is_check){
    var submit_ready;
    var that=this;
    //将开始时间和使用天数删除后判断条件更改
    if (name !== "" && phone !== ""&&address !== "" && address_detail !== "" && starttime !== ""&&interval!==''&&is_check===true){
    // if (name !== "" && phone !== "" && phone_true === true && code === code_send && address !== "" && address_detail !== "" && is_check === true) {
      submit_ready=true;
    }else{
      submit_ready=false;
    }
    that.setData({
      submit_ready:submit_ready,
    })
  },
  submit_order(){
    let that=this
    this.setData({
      submit_ready:false,
    })
    // console.log(that.data)
    wx.request({
      url: app.globalData.protocol + app.globalData.url + '/drift/order/create',
      method:'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      data:{
        consumerId: wx.getStorageSync('openid'),
        activityId:that.data.activity_id,
        equipId:that.data.equip_id,
        consignee:that.data.name,
        phone:that.data.phone,
        address:that.data.address_detail,
        province:that.data.province,
        city:that.data.city,
        district:that.data.district,
        description:'',
        expectedDate:that.data.starttime,
        intervalDate:that.data.interval,
        itemQuantity:that.data.annex_num
      },
      success: function (response) {
        // console.log(response)
        response = response.data;
        if (response.responseCode == 'RESPONSE_OK') {
          console.log(response)
          let orderId = response.data.orderId
          wx.redirectTo({
             url: '../order_confirm/order_confirm?orderId='+orderId
          })
        }
      }
    });
    
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    let activity_id = options.activityId
    let equip_id = options.equipId
    // console.log(activity_id)
     this.setData({
        activity_id:activity_id,
        equip_id: equip_id
     })
    let that = this;
    wx.request({
      url: app.globalData.protocol + app.globalData.url + '/drift/activity/' + activity_id + '/profile',
      success: function (response) {
        console.log(response)
        response = response.data;
        if (response.responseCode == 'RESPONSE_OK') {
          let item = response.data;
          let start_time = that.formatStartTime(item.startTime, new Date())
          that.setData({ act_name: item.activityName, act_desc: item.introduction, start_date: util.formatTimeToDateCN(item.startTime), end_date: util.formatTimeToDateCN(item.endTime), host: item.host, interval: item.reservableDays, starttime: start_time, endtime: that.formatEndTime(start_time, item.reservableDays), start: util.formatTimeToDate(item.startTime), end: util.formatTimeToDate(item.endTime)});
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