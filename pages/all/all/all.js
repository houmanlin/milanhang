const app = getApp()

Page({
  data:{
    activityList: [],
    practiceList: [],
    hidden: true,
    actLength: 0,
    courLength: 0,
    pracLength: 0,
    showForum: true,
    showCour: true,
    showJob: true,
    showResume: true,
    myOpenOne: 0,
    myOpenTwo: 0,
    myOpenThree: 0,
    myOpenFour: 0,
    memStatus: '',
    recordList: {
      actiCount: 0,
      inviteMemSum: 0,
      courCount: 0,
      inviteMemUsed: 0,
      inviteMemOver: 0
    },
    mobilesList:[],
    forumList: [],
    curriculumList: [],
    jobList: [],
    resumeList: [],
    vipStateOne: '待开启',
    vipStateTwo: '待开启',
    vipStateThree: '待开启',
    vipStateFour: '待开启',
    inviteMemOver: '',
    actiCount: 0
  },
  openCurriculumOther: function(e) {
    console.log(e);
    wx.navigateTo({
      url: '../curriculum-other/curriculum-other?sn=' + e.currentTarget.dataset.sn + '&courtype=' + e.currentTarget.dataset.courtype + '&actiontype=' + e.currentTarget.dataset.actitype
    })
  },
  onShow: function() {
    var vm = this
    vm.setData({
      hidden: false
    })
    // 获取用户统计信息接口
    wx.request({
      url: app.globalData.getMkCount,
      data: {
        openid: app.globalData.openid
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if(res.data.code === 200){
          if(res.data.list[0]){
            vm.data.recordList = res.data.list[0]
            vm.data.inviteMemOver = res.data.list[0].inviteMemOver
            vm.setData({
              recordList: vm.data.recordList
            })
          }
        }else if(res.data.code == 500){
          console.log('获取用户统计信息失败')
          vm.setData({
            recordList: vm.data.recordList
          })
        }
      },
      fail: function (res) {
        console.log(res);
      }
    })
    // 判断用户是几级会员
    wx.request({
      url: app.globalData.getUserMemberMsg,
      data: {
        openid: app.globalData.openid
      },
      method: 'POST',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function(res){
        if(res.data.code === 200) {
          vm.data.memStatus = res.data.rows.memStatus
        }else if(res.data.code === 500){
          console.log('会员信息为空')
        }
      },
      fail: function() {
      },
      complete: function() {
      }
    })

    //美课行动
    wx.request({
      url: app.globalData.allActivities,
      data:{
        openid:app.globalData.openid,
        type: 0,
        typeDetailI: 0,
        typeDetailII: 0,
        typeDetailIII: 0,
        courArea: 0,
        courKgI: 0,
        courKgII: 0,
        title: '',
        
      },
      header:{
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res)
        
        if (res.data.rows) {
          vm.data.mobilesList = res.data.rows
          vm.data.mobilesList.forEach(item => {
            if (item.inviteMemUsed <= vm.data.inviteMemOver || vm.data.memStatus == 2) {
              vm.data.myOpenOne = 1
              vm.data.vipStateOne = '已开启'
            } else {
              vm.data.myOpenOne = 0
              vm.data.vipStateOne = '待开启'
            }
          });
          vm.setData({
            hidden: true,
            mobilesList: vm.data.mobilesList,
            showForum: true,
            myOpenOne: vm.data.myOpenOne,
            vipStateOne: vm.data.vipStateOne
          })
        } else {
          vm.setData({
            hidden: true,
            showForum: false
          })
        }
      },
      fail: function (res) {
      }

    })


    // 名人讲堂
    wx.request({
      url: app.globalData.allCources,
      data: {
        openid: app.globalData.openid,
        type: 0,
        typeDetailI: 0,
        typeDetailII: 0,
        typeDetailIII: 0,
        courArea:0,
        courKgI: 0,
        courKgII: 0,
        title: '',
        courType: 1
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
    
        if(res.data.rows){
          vm.data.forumList = res.data.rows
          vm.data.forumList.forEach(item => {
            if(item.inviteMemUsed <= vm.data.inviteMemOver || vm.data.memStatus == 2){
              vm.data.myOpenOne = 1
              vm.data.vipStateOne = '已开启'
            }else{
              vm.data.myOpenOne = 0
              vm.data.vipStateOne = '待开启'
            }
          });
          vm.setData({
            hidden: true,
            forumList: vm.data.forumList,
            showForum: true,
            myOpenOne: vm.data.myOpenOne,
            vipStateOne: vm.data.vipStateOne
          })
        }else{
          vm.setData({
            hidden: true,
            showForum: false
          })
        }
      },
      fail: function (res) {
      }
    })
    // 优选课程
    wx.request({
      url: app.globalData.allCources,
      data: {
        openid: app.globalData.openid,
        type: 0,
        typeDetailI: 0,
        typeDetailII: 0,
        typeDetailIII: 0,
        courArea:0,
        courKgI: 0,
        courKgII: 0,
        title: '',
        courType: 2
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
       
        if(res.data.rows){
          vm.data.curriculumList = res.data.rows
          vm.data.curriculumList.forEach(item => {
   
            if(item.inviteMemUsed <= vm.data.inviteMemOver || vm.data.memStatus == 2){
              vm.data.myOpenTwo = 1
              vm.data.vipStateTwo = '已开启'
            }else{
              vm.data.myOpenTwo = 0
              vm.data.vipStateTwo = '待开启'
            }
          });
          vm.setData({
            hidden: true,
            curriculumList: vm.data.curriculumList,
            showCour: true,
            myOpenTwo: vm.data.myOpenTwo,
            vipStateTwo: vm.data.vipStateTwo
          })
        }else{
          vm.setData({
            hidden: true,
            showCour: false
          })
        }
      },
      fail: function (res) {
      }
    })
    // 就业推荐
    wx.request({
      url: app.globalData.allCources,
      data: {
        openid: app.globalData.openid,
        type: 0,
        typeDetailI: 0,
        typeDetailII: 0,
        typeDetailIII: 0,
        courArea:0,
        courKgI: 0,
        courKgII: 0,
        title: '',
        courType: 3
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
       
        if(res.data.rows){
          vm.data.jobList = res.data.rows
          vm.data.jobList.forEach(item => {
            if(item.inviteMemUsed <= vm.data.inviteMemOver || vm.data.memStatus == 2){
              vm.data.myOpenThree = 1
              vm.data.vipStateThree = '已开启'
            }else{
              vm.data.myOpenThree = 0
              vm.data.vipStateThree = '待开启'
            }
          });
          vm.setData({
            hidden: true,
            jobList: vm.data.jobList,
            showJob: true,
            myOpenThree: vm.data.myOpenThree,
            vipStateThree: vm.data.vipStateThree
          })
        }else{
          vm.setData({
            hidden: true,
            showJob: false
          })
        }
      },
      fail: function (res) {
      }
    })
    // 简历制作
    wx.request({
      url: app.globalData.allCources,
      data: {
        openid: app.globalData.openid,
        type: 0,
        typeDetailI: 0,
        typeDetailII: 0,
        typeDetailIII: 0,
        courArea:0,
        courKgI: 0,
        courKgII: 0,
        title: '',
        courType: 4
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if(res.data.rows){
          vm.data.resumeList = res.data.rows
          vm.data.resumeList.forEach(item => {
            if(item.inviteMemUsed <= vm.data.inviteMemOver || vm.data.memStatus == 2){
              vm.data.myOpenFour = 1
              vm.data.vipStateFour = '已开启'
            }else{
              vm.data.myOpenFour = 0
              vm.data.vipStateFour = '待开启'
            }
          });
          vm.setData({
            hidden: true,
            resumeList: vm.data.resumeList,
            showResume: true,
            myOpenFour: vm.data.myOpenFour,
            vipStateFour: vm.data.vipStateFour
          })
        }else{
          vm.setData({
            hidden: true,
            showResume: false
          })
        }
      },
      fail: function (res) {
      }
    })
  },
  openErWeiMa: function() {
    // 获取二维码
    wx.navigateTo({
      url: '../Invitation/Invitation'
    })
  }
})