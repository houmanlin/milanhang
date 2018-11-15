const app = getApp()

Page({
    data:{
        showNot: false,
        hidden: true,
        state: '待审核',
        billLists: []
    },
    goBack: function() {
        wx.navigateBack({
            delta: 1
        })
    },
    onShow: function() {
        var vm = this
        vm.setData({
            hidden: false
        })
        wx.request({
            url: app.globalData.getBankAccount,
            method: "POST",
            data: {
                openid: app.globalData.openid,
                refund_type: 2
            },
            header: {
              "content-type": "application/x-www-form-urlencoded"
            },
            success: function (data) {
              console.log(data)
              if(data.data.rows){
                vm.data.billLists = data.data.rows
                vm.data.billLists.forEach(item => {
                    if(item.check_type == 0){
                        vm.data.state = "待审核"
                    }else if(item.check_type == 1) {
                        vm.data.state = "审核通过"
                    }
                });
                vm.setData({
                    hidden: true,
                    showNot: false,
                    state: vm.data.state,
                    billLists: vm.data.billLists
                })
              }else{
                vm.setData({
                    hidden: true,
                    showNot: true
                })
              }
            },
            fail: function (res) {
              console.log(res);
            }
          })
    }
})