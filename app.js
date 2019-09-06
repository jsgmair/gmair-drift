//app.js
App({
  globalData: {
    openid: '',
    // http://192.168.30.94:8015
    protocol: 'https://',
    // protocol: 'http://',
    url: 'microservice.gmair.net',
    // url: '192.168.30.94:8015',
    port: 443,
  },
  onLaunch: function () {
    this.check_session(this)
  },
  check_session: function (context) {
    let that = this;
    wx.checkSession({
      success: function () {
        let openid = wx.getStorageSync('openid');
        console.log(openid)
        if (openid == undefined || openid == '') {
          // console.log('login')
          that.login();
        }
      },
      fail: function () {
        // console.log('fail')
        that.login();
      },
      complete: function () {
        // console.log('complete')
        let openid = wx.getStorageSync('openid');
        that.globalData.openid = openid;
      }
    })
  },
  login: function () {
    let that = this;
    // console.log('login')
    wx.login({
      success(response) {
        let code = response.code;
        console.log(code)
        that.code2openid(code);
      }
    });
  },
  code2openid: function (code) {
    let that = this;
    wx.request({
      url: 'https://microservice.gmair.net/drift/user/openid',
      // url: app.globalData.protocol+app.globalData.url+'/drift/user/openid',
      method: "POST",
      data: {
        code: code
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      success: function (response) {
        console.log(response);
        response = response.data;
        if (response.responseCode == 'RESPONSE_OK') {
          let openid = response.data;
          wx.setStorage({
            key: 'openid',
            data: openid,
          })
        }
      }
    })
  }
})
