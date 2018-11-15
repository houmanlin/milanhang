const app = getApp()

Page({
  data:{
    bankList: [
      {
        id: 0,
        name: '工商银行',
        type: 1
      },
      {
        id: 1,
        name: '农业银行',
        type: 2
      },
      {
        id: 2,
        name: '中国银行',
        type: 3
      },
      {
        id: 3,
        name: '建设银行',
        type: 4
      },
      {
        id: 4,
        name: '招商银行',
        type: 5
      },
      {
        id: 5,
        name: '储蓄银行',
        type: 6
      },
      {
        id: 6,
        name: '交通银行',
        type: 7
      },
      {
        id: 7,
        name: '浦发银行',
        type: 8
      },
      {
        id: 8,
        name: '民生银行',
        type: 9
      },
      {
        id: 9,
        name: '兴业银行',
        type: 10
      },
      {
        id: 10,
        name: '平安银行',
        type: 11
      },
      {
        id: 11,
        name: '中信银行',
        type: 12
      },
      {
        id: 12,
        name: '华夏银行',
        type: 13
      },
      {
        id: 13,
        name: '广发银行',
        type: 14
      },
      {
        id: 14,
        name: '光大银行',
        type: 15
      }
    ],
    search: {
      bankType: null,
      bankName: null
    },
    bankIndex: 0,
    nameInput: '',
    numInput: '',
    memId: '',
    discount: 0
  },
  goBack: function() {
    wx.navigateBack({
      delta: 1
    })
  },
  bankChange: function(e) {
    var vm = this
    var search = vm.data.search
    search.bankType = vm.data.bankList[e.detail.value].type
    search.bankName = vm.data.bankList[e.detail.value].name
    vm.setData({
      search: search,
      bankIndex: e.detail.value
    })
  },
  nameInput: function(e) {
    var vm = this
    vm.data.nameInput = e.detail.value
    vm.setData({
      nameInput: e.detail.value
    })
  },
  numInput: function(e) {
    var vm = this
    vm.data.numInput = e.detail.value
    vm.setData({
      numInput: e.detail.value
    })
  },
  openTranslateT: function() {
    wx.navigateTo({
      url: '../translateT/translateT'
    })
  },
  onLoad: function() {
    var vm = this
    vm.data.bankList.unshift({
      id: -1,
      name: "请选择银行",
      type: 0
    })
    vm.setData({
      bankList: vm.data.bankList
    })
  },
  btnclick: function() {
    var vm = this
    if(vm.data.search.bankType === null || vm.data.search.bankType === undefined){
      wx.showToast({
        title:'请选择银行',
        icon:'none',
        duration: 2000
      })
      return false
    }
    if(vm.data.nameInput === null || vm.data.nameInput === undefined || vm.data.nameInput === ''){
      wx.showToast({
        title:'请填写持卡人姓名',
        icon:'none',
        duration: 2000
      })
      return false
    }
    if(vm.data.numInput === null || vm.data.numInput === undefined || vm.data.numInput === ''){
      wx.showToast({
        title:'请填写卡号',
        icon:'none',
        duration: 2000
      })
      return false
    }
    wx.showModal({
      title: '提示',
      content: '确定退费了嘛~',
      cancelText: '我再想想',
      confirmText: '无情退出',
      success: function(res) {
        if(res.confirm) {
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
                vm.data.memId = res.data.rows.memId
                vm.data.discount = res.data.rows.discount
                // 返给后台数据
                wx.request({
                  url: app.globalData.applyrefunds,
                  method: "POST",
                  data: {
                    openid: app.globalData.openid,
                    refund_type: 2,
                    memId: vm.data.memId,
                    accountType: vm.data.search.bankType,
                    accountName: vm.data.nameInput,
                    cardNum: vm.data.numInput,
                    money: vm.data.discount
                  },
                  header: {
                    "content-type": "application/x-www-form-urlencoded"
                  },
                  success: function (data) {
                    console.log(data)
                    if(data.data.code === 200) {
                      wx.showToast({
                        title: '申请成功，请等待审核',
                        icon: 'none',
                        duration: 3000
                      })
                    }else if(data.data.code === 500) {
                      wx.showToast({
                        title: '申请失败，请重试',
                        icon: "none"
                      })
                      console.log('失败')
                    }
                  },
                  fail: function (res) {
                    console.log(res);
                  }
                })
              }else if(res.data.code === 500){
                console.log('会员信息为空')
              }
            },
            fail: function() {
            },
            complete: function() {
            }
          })
        }else if (res.cancel){
          wx.showToast({
            title: '我还是会员呦~',
            icon: 'none',
            duration: 3000
          })
        }
      }
    })
  }
})