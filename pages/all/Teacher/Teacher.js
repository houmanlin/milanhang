
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:"",
    TeacherImg:"",
    name:"",
    scholl:"",
    TeacherDatil:1,
    TeacherDatiles:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    const vm = this;
    vm.setData({
      TeacherDatile:1
    })
    wx.request({
      url: app.globalData.getLecturerInfo,
      data: {
        lecturerId: "1"
      },
      method: 'POST',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
  
        vm.data.TeacherImg = res.data.rows[0].lecturerPaths[0].lecturerPath;
        vm.data.name = res.data.rows[0].lecturerName;
        vm.data.scholl = res.data.rows[0].lecturerIntroduce
        vm.data.TeacherDatiles = res.data.rows[0].lecturerPaths
      
        vm.setData({
          title: vm.data.name + "详细简介",
          TeacherImg: vm.data.TeacherImg,
          name: vm.data.name,
          scholl: vm.data.scholl,
          TeacherDatiles: vm.data.TeacherDatiles
        })
      }
    })
  },

  SelectFun:function(e){
    this.TeacherDatil = e.currentTarget.dataset.index
  
    this.setData({
    
      TeacherDatil: e.currentTarget.dataset.index
    })

  },

  goBack:function(){
    wx.navigateBack({
      delta: 1
    })
  }

})