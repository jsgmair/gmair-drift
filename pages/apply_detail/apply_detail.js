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
    endtime:'',
    // day_list:["3","5","7"],//从后台获取可选时间
    // day_index:0,
    annex_num:1,
    annex_num1: 1,
    attach1:{},
    attach2:{},
    // attachId1:'',
    // attachId2: '',
    // attachName1:'',
    // attachName2:'',
    annex_num2: 0,
    annex_num3: 0,
    is_check:false,
    submit_ready:false,
    obtain_click:false,//获取验证码是否点击
    can_select_list: [],
    list:[],//日期范围list
    is_select:false,
    notification:'',
    annux_name: '',
    annux_price: '',
    address_data:'',
    address_id:'',
    service_show:false
  },
  show_service(e) {
    this.setData({
      service_show: true
    })
  },
  togglePopup(e) {
    this.setData({
      service_show: false
    })
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
    this.check_submit_ready(this.data.name, this.data.phone, address, this.data.address_detail, this.data.starttime, this.data.interval,this.data.is_check,this.data.annex_num1,this.data.annex_num2,this.data.annex_num3);
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
    this.check_submit_ready(e.detail.value, this.data.phone, this.data.address, this.data.address_detail, this.data.starttime, this.data.interval, this.data.is_check, this.data.annex_num1, this.data.annex_num2, this.data.annex_num3);
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
    this.check_submit_ready(this.data.name, phone, this.data.address, this.data.address_detail, this.data.starttime, this.data.interval, this.data.is_check, this.data.annex_num1, this.data.annex_num2, this.data.annex_num3);
  },
  //验证码按钮点击
  btn_obtain_click(e){
    let that = this;
    let openid = wx.getStorageSync('openid')
    // that.setData({
    //    obtain_click:true,
    // })
    console.log(e)
    if (e.detail.errMsg === "getPhoneNumber:ok"){
      let iv = e.detail.iv
      let data = e.detail.encryptedData
      wx.request({
        // url:  'https://microservice.gmair.net/drift/user/decode/phone',
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
          console.log(response)
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
    this.check_submit_ready(this.data.name, this.data.phone, this.data.address, this.data.address_detail, this.data.starttime, this.data.interval, this.data.is_check, this.data.annex_num1, this.data.annex_num2, this.data.annex_num3);
  },
  detail_address_input(e){
     this.setData({
        address_detail:e.detail.value,
     })
    this.check_submit_ready(this.data.name, this.data.phone, this.data.address, e.detail.value, this.data.starttime, this.data.interval, this.data.is_check, this.data.annex_num1, this.data.annex_num2, this.data.annex_num3);
  },
  daySelect(e){
    let starttime = e.detail.item.value
    let endtime = this.formatEndTime(starttime, this.data.interval)
    this.setData({
      starttime:starttime,
      endtime: endtime,
      is_select: false
    })
    // console.log(this.data.address_id)
    this.check_submit_ready(this.data.address_id, starttime, this.data.interval, this.data.is_check, this.data.annex_num);
  },
  //开始时间选择
  // bindStartTimeChange(e){
  //   console.log(e)
  //   let endtime=this.formatEndTime(e.detail.value,this.data.interval)
  //    this.setData({
  //       starttime:e.detail.value,
  //       endtime:endtime
  //    })
  //   this.check_submit_ready(this.data.name, this.data.phone, this.data.address, this.data.address_detail,e.detail.value, this.data.day_index);
  // },
  //使用时长选择
  // day_length_change(e){
  //     this.setData({
  //        day_index:e.detail.value
  //     })
  //   this.check_submit_ready(this.data.name, this.data.phone, this.data.phone_true, this.data.code, this.data.code_send, this.data.address, this.data.address_detail, this.data.time, e.detail.value, this.data.is_check);
  // },
  //试纸等数量
  num_change(e) {
    console.log(e.detail)
    this.setData({
      annex_num: e.detail,
    })
  this.check_submit_ready(this.data.address_id,this.data.starttime, this.data.interval, this.data.is_check, e.detail);
  },
  num_change1(e){
    console.log(e.detail)
    this.setData({
      annex_num1:e.detail,
    })
    this.check_sum(e.detail,this.data.annex_num2, this.data.annex_num3)
  },
  num_change2(e) {
    this.setData({
      annex_num2: e.detail,
    })
    this.check_sum( this.data.annex_num1,e.detail, this.data.annex_num3)
  },
  num_change3(e) {
    this.setData({
      annex_num3: e.detail,
    })
    this.check_sum( this.data.annex_num1, this.data.annex_num2,e.detail)
  },
  check_sum(annex_num1, annex_num2, annex_num3){
    if (annex_num1 + annex_num2 + annex_num3===0){
      wx.showToast({
        title: '请记得选择试纸哦',
        icon: 'none',
        duration: 2000
      })
    }
    this.check_submit_ready(this.data.name, this.data.phone, this.data.address, this.data.address_detail, this.data.starttime, this.data.interval, this.data.is_check, annex_num1, annex_num2, annex_num3);
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
   this.check_submit_ready(this.data.address_id,this.data.starttime, this.data.interval, is_check, this.data.annex_num);
      that.setData({
        is_check:is_check,
      })
  },
  //判断是否可以提交，满足姓名、手机号、验证码正确、地址、详细地址、开始时间、使用天数均已选择填写
  check_submit_ready(addressId,starttime, interval, is_check, annex_num){
    var submit_ready;
    var that=this;
    console.log(addressId)
    // let sum = annex_num1 + annex_num2 + annex_num3
    // console.log(sum)
    //将开始时间和使用天数删除后判断条件更改
    if (addressId !== "" && addressId !=undefined && starttime !== "" && interval !== '' && is_check === true && annex_num!==0){
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
    let address_data = that.data.address_data
    // console.log(that.data)
    let attachItem = {}
    attachItem[this.data.attach1.attachId] = this.data.annex_num
    attachItem[this.data.attach2.attachId] = 2
    // attachItem[this.data.attachId2] = this.data.annex_num2
    // attachItem[this.data.attachId3] = this.data.annex_num3
    // console.log(attachItem)
    attachItem = JSON.stringify(attachItem)
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
        consignee: address_data.consignee,
        phone: address_data.phone,
        address: address_data.addressDetail,
        province: address_data.province,
        city: address_data.city,
        district: address_data.district,
        description:'',
        expectedDate:that.data.starttime,
        intervalDate:that.data.interval,
        attachItem: attachItem
        // itemQuantity:that.data.annex_num
      },
      success: function (response) {
        console.log(response)
        response = response.data;
        if (response.responseCode == 'RESPONSE_OK') {
          console.log(response)
          let orderId = response.data.orderId
          wx.redirectTo({
             url: '/pages/order_confirm/order_confirm?orderId='+orderId
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
  select_day(e){
    this.setData({
      is_select:true
    })
  },
  toggleBottomPopup(e){
    this.setData({
      is_select: false
    })
  },
  text_click(e){
     wx.navigateTo({
       url: '/pages/protocol/protocol',
     })
  },
  //获取地址list
  obtain_data() {
    let openid = wx.getStorageSync('openid')
    let that = this
    wx.request({
      url: app.globalData.protocol + app.globalData.url + '/drift/address/list/byopenid?consumerId=' + openid,
      success: response => {
        response = response.data
        console.log(response)
        if (response.responseCode === "RESPONSE_OK") {
          that.setData({
            address_data:response.data[0],
            address_id: response.data[0].addressId,
          })
        }
      }
    });
  },
  address_select(e){
    let json = {}
    json['activityId'] = this.data.activity_id
    json['equipId'] = this.data.equip_id
    json['addressId'] = this.data.address_id
    // console.log(json)
    wx.navigateTo({
      url: '/pages/address/address?address=' + JSON.stringify(json),
    })
  },
  obtain_data_by_id(addressId){
    let that = this
    wx.request({
      url: app.globalData.protocol + app.globalData.url + '/drift/address/by/addressid?addressId=' + addressId,
      success: response => {
        response = response.data
        console.log(response)
        if (response.responseCode === "RESPONSE_OK") {
          that.setData({
            address_data: response.data[0]
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    let that = this
    let address = options.address
    let activity_id
    let equip_id
    console.log(address)
    if(address){
      address=JSON.parse(address)
      console.log(address)
      activity_id = address.activityId
      equip_id = address.equipId
      let address_id = address.addressId
      this.obtain_data_by_id(address_id)
      this.setData({
        address_id:address_id
      })
    } else{
      activity_id = options.activityId
      equip_id = options.equipId
      that.obtain_data()
      // console.log(activity_id)
    }
    that.setData({
      activity_id: activity_id,
      equip_id: equip_id,
    })
    //获取attachment
    wx.request({
      url: app.globalData.protocol + app.globalData.url + '/drift/attach/list?equipId='+equip_id,
      success: function (response) {
        response = response.data;
        console.log(response)
        if (response.responseCode == 'RESPONSE_OK') {
           that.setData({
             attach1:response.data[0],
             attach2:response.data[1],
           })
        }
      }
    })
    // wx.request({
    //   url: app.globalData.protocol + app.globalData.url + '/drift/activity/' + that.data.activity_id + '/annux',
    //   success: function (response) {
    //     response = response.data;
    //     // console.log(response)
    //     if (response.responseCode == 'RESPONSE_OK') {
    //
    //     }
    //   }
    // })
    wx.request({
      url: app.globalData.protocol + app.globalData.url + '/drift/activity/' + that.data.activity_id + '/notification',
      success: function (response) {
        response = response.data;
        // console.log(response)
        if (response.responseCode == 'RESPONSE_OK') {
          let list = response.data;
          let message = '';
          // console.log(JSON.stringify(list[0].context))
          for (let i = 0; i < list.length; i++) {
            message += list[i].context;
          }
          // console.log(message)
          that.setData({ notification: message })
        }
      }
    })
    //获取试纸详情
    wx.request({
      // url:'http://192.168.30.94:8015/drift/activity/attachment/list?activityId='+this.data.activity_id,
      url: app.globalData.protocol + app.globalData.url + '/drift/activity/' + that.data.activity_id + '/notification',
      success: function (response) {
        response = response.data;
        console.log(response)
        if (response.responseCode == 'RESPONSE_OK') {
          that.setData({
            annex:response.data
          })
        }
      }
    })
    wx.request({
      url: app.globalData.protocol + app.globalData.url + '/drift/activity/' + that.data.activity_id + '/profile',
      success: function (response) {
        console.log(response)
        response = response.data;
        if (response.responseCode == 'RESPONSE_OK') {

          let item = response.data;
          // console.log(util.formatTimeToDate(item.startTime))
          // console.log(util.formatTimeToDate(item.endTime))
          let start_time = that.formatStartTime(item.startTime, new Date())
          that.setData({ act_name: item.reservationName, act_desc: JSON.parse(item.reservationText), start_date: util.formatTimeToDateCN(item.startTime), end_date: util.formatTimeToDateCN(item.endTime), host: item.host, interval: item.reservableDays, start: util.formatTimeToDate(item.startTime), end: util.formatTimeToDate(item.endTime)});
          //获取日期list
          wx.request({
            url: app.globalData.protocol + app.globalData.url + '/drift/activity/' + that.data.activity_id + '/available',
            success: function (response) {
              // console.log(response)
              response = response.data;
              if (response.responseCode == 'RESPONSE_OK') {
                // console.log(that.formatSelectList(response.data))
                that.setData({
                  can_select_list: that.formatSelectList(response.data),
                  list: that.formatList(response.data)
                })
                for (let i = 0; i < response.data.length; i++) {
                  let json = response.data[i]
                  // console.log(json)
                  for (let key in json) {
                    if (json[key] === true) {
                      let starttime = key
                      that.setData({
                        starttime: starttime,
                        endtime: that.formatEndTime(starttime, that.data.interval)
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
