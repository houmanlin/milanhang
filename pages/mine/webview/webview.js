// pages/mine/webview/webview.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    about: [{
        icon: "../../../static/newImg/index.png",
        text1: "做一个可以信赖的公司",
        text2: "谨慎对用户做出的每一个承诺，同时落实对用户的每一个承诺。"
      },
      {
        icon: "../../../static/newImg/index2.png",
        text1: "做专业的产品",
        text2: "不迎合用户的浅层需求，专注于社会与用户的深层需求，提供最好最专业的产品，最终靠质量赢得用户信任。"
      },
      {
        icon: "../../../static/newImg/index3.png",
        text1: "依靠教育改变世界",
        text2: "培养学生工作的能力，培养学生终生受益的能力，培养学生改变世界的能力！"
      }
    ],
    
    markers: [{
    iconPath: "../../../static/img/dingwei.png",
    latitude: 41.761360,
    longitude: 123.427970,
    width: 20,
    height: 20
  }],
  },

  
  CallPhonNum:function(){
    wx.makePhoneCall({
      phoneNumber: '024-31507533'
    })
  },
  goBack:function(){
      wx.navigateBack({
        delta: 1
      })
  }
})