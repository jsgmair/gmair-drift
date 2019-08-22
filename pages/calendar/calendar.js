// pages/calendar/calendar.js
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    year: '',
    month: '',
    day: '',
    weekArr: ['日', '一', '二', '三', '四', '五', '六'],
    dateArr: [],
    firstDay: '',
    lastDay: '',
    day_select:'',
    can_select_list: ['2019-08-22', '2019-08-24', '2019-08-25', '2019-08-26', '2019-08-27', '2019-08-28', '2019-08-29',]
  },
  getDate: function (time) { //获取当月日期
    var mydate = new Date(time);
    var year = mydate.getFullYear();
    var month = mydate.getMonth();
    var months = month + 1;
    this.data.year = year;
    this.data.month = months;
    this.data.day = mydate.getDate();
    var fist = new Date(year, month, 1);
    var firstDay = fist.getDay();
    var last = new Date(year, months, 0);
    this.data.lastDay = last.getDate();
    this.setData({
      year: this.data.year,
      month: this.data.month,
      day: this.data.day,
      firstDay: firstDay,
      lastDay: this.data.lastDay,
      day_select: util.formatTimeToDate(time)
    })
    console.log(this.data)
    console.log("今天：" + this.data.day);
  },
  //构建日历数组
  setDate () {
    var dateArr = []
    let json = {}
    for(var i = 0;i<this.data.firstDay;i++){
      json={}
      json['index'] = ''
      json['value'] = ''
      json['canSelect'] = false
      dateArr.push(json)
    } 
    for (var i = 1; i < this.data.lastDay + 1; i++) {
      json = {}
      json['index'] = i
      let value = util.formatTimeToDate(this.data.year + '-' + this.data.month + '-' + i)
      json['value'] = value
      json['canSelect'] = this.check_select(value)
      dateArr.push(json)
    }
    console.log(dateArr)
    this.setData({
      dateArr: dateArr
    })
  },
  //判断某日期是不是在可选范围内
  check_select(date){
    let can_select_list = this.data.can_select_list
    for(let i=0;i<can_select_list.length;i++){
      if(date===can_select_list[i]){
        return true
      }
    }
    return false
  },
  //根据日期获取星期
  getWeekByDay(dayValue){
    var day = new Date(Date.parse(dayValue.replace(/-/g, '/'))); //将日期值格式化
    var today = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"); //创建星期数组
    console.log(today[day.getDay()])
    return today[day.getDay()];  //返一个星期中的某一天，其中0为星期日
  },
  prevMonth: function () { //上一月
    var months = "";
    var years = "";
    if (this.data.month == 1) {
      years = this.data.year - 1
      this.data.month = 12;
      months = this.data.month;
    } else {
      years = this.data.year;
      months = this.data.month - 1;
    }

    var first = new Date(years, months - 1, 1);
    this.data.firstDay = first.getDay();
    var last = new Date(years, months, 0);
    this.data.lastDay = last.getDate();
    this.setData({
      month: months,
      year: years,
      firstDay: this.data.firstDay,
      lastDay: this.data.lastDay,
    })

   this.setDate()
  },
  nextMonth: function () { //下一月
    var months = "";
    var years = "";
    if (this.data.month == 12) {
      this.data.month = 0;
      months = this.data.month;
      years = this.data.year + 1;
    } else {
      months = this.data.month + 1;
      years = this.data.year;
    }
    var months = this.data.month + 1;
    var first = new Date(years, months - 1, 1);
    this.data.firstDay = first.getDay();
    var last = new Date(years, months, 0);
    this.data.lastDay = last.getDate();
    this.setData({
      month: months,
      year: years,
      firstDay: this.data.firstDay,
      lastDay: this.data.lastDay,
    })
    this.setDate()
  },
  day_click(e){
    console.log(e)
    let item = e.currentTarget.dataset.item
    if(item.index!==''&&item.canSelect){
      this.setData({
        day_select:item.value
      })
    }
    console.log(this.data.day_select)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let selectDay = options.selectDay == undefined ? new Date() : options.selectDay
    console.log(options.selectDay)
    this.getDate(selectDay);
    this.setDate();
    var res = wx.getSystemInfoSync();
    console.log(this.data)
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