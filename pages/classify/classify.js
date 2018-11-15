const app = getApp()
Page({
  data: {
    cateItems: [],
    curNav: 1,
    curIndex: 0,
    showItems: [],
    bgcColor: 'red',
    lightType: 0
  },
  switchRightTab: function (e) {
    var vm = this
    console.log(e)
    let index = e.target.dataset.index,
      sn = e.currentTarget.dataset.sn
    this.setData({
      curNav: sn,
      curIndex: index
    })
    console.log(sn)
    for (var i = 0; i < vm.data.showItems.length; i++) {
      vm.data.showItems[i] = false
    }
    vm.data.showItems[index] = true
    this.setData({
      showItems: vm.data.showItems
    })
  },
  onLoad: function() {
    var vm = this
    vm.setData({
      hidden: false
    })
    wx.request({
      url: app.globalData.allcoursetype,
      data: {
        courType: 1
      },
      method: 'POST',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function(res){
        for (var i = 0; i < res.data.rows.length; i++) {
          vm.data.showItems.push(false)
          for(var j = 0; j<res.data.rows[i].courseTypeII.length; j++){
            for(var k = 0; k<res.data.rows[i].courseTypeII[j].courseTypeIII.length; k++){
              if(res.data.rows[i].courseTypeII[j].courseTypeIII[k].lightType == 1){
                res.data.rows[i].courseTypeII[j].courseTypeIII[k].bgcColor = '#fe8f10'
              }else if(res.data.rows[i].courseTypeII[j].courseTypeIII[k].lightType == 0){
                res.data.rows[i].courseTypeII[j].courseTypeIII[k].bgcColor = '#eeeeee'
              }
              vm.data.lightType = res.data.rows[i].courseTypeII[j].courseTypeIII[k].lightType
            }
          }
        }
        vm.data.showItems[0] = true;
        vm.setData({
          hidden: true,
          cateItems: res.data.rows,
          showItems: vm.data.showItems
        })
      },
      fail: function() {
      },
      complete: function() {
      }
    })
  },
  openCurriculum: function(e) {
    var vm = this
    let typeDetail = e.currentTarget.dataset.typedetail
    let name = e.currentTarget.dataset.typename
    let lighttype = e.currentTarget.dataset.lighttype
    if(lighttype == 1) {
      wx.navigateTo({
        url: '../curriculum/curriculum/curriculum?sn=' + typeDetail + '&name=' + name
      })
    }else if(lighttype == 0) {
      wx.showToast({
        title: "暂未开设此课程哦~",
        icon: 'none',
      })
    }
  }
})