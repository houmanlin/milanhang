//app.js
const getOpenId = require('./config').getOpenId;
const register = require('./config').register;
const authWxMessage = require('./config').authWxMessage;
const homeActivities = require('./config').homeActivities;
const homeCourses = require('./config').homeCourses;
const enroll = require('./config').enroll;
const SetCourseEnroll = require('./config').SetCourseEnroll;
const checkPhone = require('./config').checkPhone;
const authPhoneMsg = require('./config').authPhoneMsg;
const completePhone = require('./config').completePhone;
const getPhoneCode = require('./config').getPhoneCode;

Date.prototype.Format = function (fmt) { //author: meizz 
  var o = {
    "M+": this.getMonth() + 1, //月份 
    "d+": this.getDate(), //日 
    "h+": this.getHours(), //小时 
    "m+": this.getMinutes(), //分 
    "s+": this.getSeconds(), //秒 
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
    "S": this.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

App({
  showModal: function (condition, title, success) {
    if (condition) {
      wx.showModal({
        content: title,
        showCancel: false,
        confirmText: "确定",
        success: success
      })
      return true;
    } else {
      return false;
    }
  },
  onLaunch: function () {
    var that = this;
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      
      success: res => {
      
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        // 如果本地存在openid
        that.globalData.code = res.code
        if (wx.getStorageSync('openid')) {
          var openid = wx.getStorageSync('openid');
          that.globalData.openid = openid;
          console.log('本地存在openid:', that.globalData.openid)
        } else {
          //如果不存在openid就去获取并赋值全局变量
          console.log('本地不存在openid');
          // 获取openid
          wx.request({
            url: that.globalData.getOpenId,
            data: {
              code: res.code
            },
            header: {
              "content-type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
              if(res.data.code === 200) {
        
                that.globalData.openid = res.data.openid;
                wx.setStorageSync('openid', res.data.openid)
                console.log('获取到openid', res.data.openid)
              }else if(res.data.code === 500){
                wx.showToast({
                  title: '获取用户信息失败',
                  icon: 'none'
                })
              }else if(res.data.code === 400){
                console.log('没有权限获取')
              }
            },
            fail: function (res) {
              console.log(res);
            }
          })
        }
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              var that = this;
              that.globalData.userInfo = res.userInfo
              wx.setStorageSync('userInfo', res.userInfo)
              //授权成功以后进行微信信息补全
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  //全局参数
  globalData: {
    hasLogin: false,
    openid: '', //微信ID
    isRegister: false, //是否注册
    userInfo: null,
    rgphone: '', //用户注册手机号
    getOpenId: require('./config').getOpenId,
    register: require('./config').register,
    authWxMessage: require('./config').authWxMessage,
    allActivities: require('./config').allActivities,
    allCources: require('./config').allCources,
    enroll: require('./config').enroll,
    SetCourseEnroll: require('./config').SetCourseEnroll,
    checkPhone: require('./config').checkPhone,
    authPhoneMsg: require('./config').authPhoneMsg,
    completePhone: require('./config').completePhone,
    getPhoneCode: require('./config').getPhoneCode,
    authMemberByUser: require('./config').authMemberByUser,
    submitMember: require('./config').submitMember,
    pay: require('./config').pay,
    getUserMemberMsg: require('./config').getUserMemberMsg,
    checkActiByUser: require('./config').checkActiByUser,
    checkCourseByUser: require('./config').checkCourseByUser,
    getCoupons: require('./config').getCoupons,
    findOwerActivity: require('./config').findOwerActivity,
    findActiHeadUrl: require('./config').findActiHeadUrl,
    findOwerCourse: require('./config').findOwerCourse,
    findCourseHeadUrl: require('./config').findCourseHeadUrl,
    findUserCouponMsg: require('./config').findUserCouponMsg,
    getPreMoney: require('./config').getPreMoney,
    changeUserCoupState: require('./config').changeUserCoupState,
    applyCampusAgent: require('./config').applyCampusAgent,
    oneCource: require('./config').oneCource,
    checkAgentPhone: require('./config').checkAgentPhone,
    oneActivity: require('./config').oneActivity,
    allMkVideo: require('./config').allMkVideo,
    checkAgent: require('./config').checkAgent,
    getAgentId: require('./config').getAgentId,
    allcoursetype: require('./config').allcoursetype,
    applyrefunds: require('./config').applyrefunds,
    calcrefunds: require('./config').calcrefunds,
    getAgentCount: require('./config').getAgentCount,
    getBankAccount: require('./config').getBankAccount,
    getHomePagePath: require('./config').getHomePagePath,
    getSecCode: require('./config').getSecCode,
    getAgentIICount: require('./config').getAgentIICount,
    getMkCount: require('./config').getMkCount,
    getLecturerInfo: require('./config').getLecturerInfo,
  }
})