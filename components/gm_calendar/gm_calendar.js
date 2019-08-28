// pages/calendar/gm_calendar.js
const util = require('../../utils/util.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    day_select:{
      type:String,
      value:''
    },
    can_select_list:{
      type:Array,
      value:[]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    year: '',
    month: '',
    day: '',
    weekArr: ['日', '一', '二', '三', '四', '五', '六'],
    dateArr: [],
    columnArr:[],
    firstDay: '',
    lastDay: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
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
    setDate() {
      var dateArr = []
      let json = {}
      for (var i = 0; i < this.data.firstDay; i++) {
        json = {}
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
      let columnArr = []
      let array = []
      for (let i = 0; i < dateArr.length; i++) {
        array.push(dateArr[i])
        if (i % 7 === 6) {
          columnArr.push(array)
          array = []
        }
      }
      console.log(columnArr)
      this.setData({
        dateArr: dateArr,
        columnArr: columnArr
      })
    },
    //判断某日期是不是在可选范围内
    check_select(date) {
      let can_select_list = this.data.can_select_list
      for (let i = 0; i < can_select_list.length; i++) {
        if (date === can_select_list[i]) {
          return true
        }
      }
      return false
    },
    //根据日期获取星期
    getWeekByDay(dayValue) {
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
    day_click(e) {
      console.log(e)
      let item = e.currentTarget.dataset.item
      if (item.index !== '' && item.canSelect) {
        this.setData({
          day_select: item.value
        })
        this.triggerEvent('daySelect', {item},{})
      }
      // console.log(this.data.day_select)
    },
  },
  ready: function () {
    console.log(this.data.day_select)
    let selectDay = this.data.day_select === ""?new Date():this.data.day_select 
    this.getDate(selectDay);
    this.setDate();   
  },
})
