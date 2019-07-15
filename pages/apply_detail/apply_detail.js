// pages/apply_detail/apply_detail.js
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    areaList:[],
    add_select:false,
    address:'',
    name:'',
    phone:'',
    phone_true:false,
    btn_text:"获取验证码",
    code_send:'',//后台返回的验证码
    code:'',
    address_detail:'',
    start_time:"",//活动开始时间
    end_time:"",//活动截止时间
    time:"",//个人选择时间
    day_list:["3","5","7"],//从后台获取可选时间
    day_index:0,
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
    //  console.log(e);
     var value=e.detail.values;
     var address=value[0].name+value[1].name+value[2].name
    //  console.log(address)
     this.setData({
       add_select:false,
       address:address,
     })
    this.check_submit_ready(this.data.name, this.data.phone, this.data.phone_true, this.data.code, this.data.code_send, address, this.data.address_detail, this.data.time, this.data.day_index,this.data.is_check);
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
    this.check_submit_ready(e.detail.value, this.data.phone, this.data.phone_true, this.data.code, this.data.code_send, this.data.address, this.data.address_detail, this.data.time, this.data.day_index, this.data.is_check);
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
    this.check_submit_ready(this.data.name, phone, phone_true, this.data.code, this.data.code_send, this.data.address, this.data.address_detail, this.data.time, this.data.day_index, this.data.is_check);
  },
  //验证码按钮点击
  btn_obtain_click(e){
    var that = this;
    that.setData({
       obtain_click:true,
    })
    if(e.currentTarget.dataset.isable===true){
       var interval = 60;
       that.setData({
          phone_true:false,
       })
       var verification_interval = setInterval(() => {
         interval = interval - 1;
         that.setData({ btn_text: interval + 's后重发' });
         if (interval < 0) {
           that.setData({ btn_text: '获取验证码', obtain_click:false});
           clearInterval(verification_interval);
         }
       }, 1000);
     }
     
  },
  //验证码输入
  code_input(e){
     this.setData({
        code:e.detail.value,
     })
    this.check_submit_ready(this.data.name, this.data.phone, this.data.phone_true, e.detail.values, this.data.code_send, this.data.address, this.data.address_detail, this.data.time, this.data.day_index, this.data.is_check);
  },
  detail_address_input(e){
     this.setData({
        address_detail:e.detail.value,
     })
    this.check_submit_ready(this.data.name, this.data.phone, this.data.phone_true, this.data.code, this.data.code_send, this.data.address, e.detail.value, this.data.time, this.data.day_index, this.data.is_check);
  },
  //开始时间选择
  bindStartTimeChange(e){
     this.setData({
        time:e.detail.value,
     })
    this.check_submit_ready(this.data.name, this.data.phone, this.data.phone_true, this.data.code, this.data.code_send, this.data.address, this.data.address_detail,e.detail.value, this.data.day_index);
  },
  //使用时长选择
  day_length_change(e){
      this.setData({
         day_index:e.detail.value
      })
    this.check_submit_ready(this.data.name, this.data.phone, this.data.phone_true, this.data.code, this.data.code_send, this.data.address, this.data.address_detail, this.data.time, e.detail.value, this.data.is_check);
  },
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
    this.check_submit_ready(this.data.name, this.data.phone, this.data.phone_true, this.data.code, this.data.code_send, this.data.address, this.data.address_detail, this.data.time, this.data.day_index, is_check);
      that.setData({
        is_check:is_check,
      })
  },
  //判断是否可以提交，满足姓名、手机号、验证码正确、地址、详细地址、开始时间、使用天数均已选择填写
  check_submit_ready(name, phone, phone_true, code, code_send, address, address_detail, time, day_index, is_check){
    var submit_ready;
    var that=this;
    //将开始时间和使用天数删除后判断条件更改
    // if (name !== "" && phone !== "" && phone_true === true && code === code_send&&address !== "" && address_detail !== "" && time !== "" && day_index !== "" && is_check===true){
    if (name !== "" && phone !== "" && phone_true === true && code === code_send && address !== "" && address_detail !== "" && is_check === true) {
      submit_ready=true;
    }else{
      submit_ready=false;
    }
    that.setData({
      submit_ready:submit_ready,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      //todo 获取活动信息
     var time = util.formatTimeToDate(new Date());
     this.setData({
        time:time,
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