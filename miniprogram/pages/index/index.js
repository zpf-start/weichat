// miniprogram/pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    groups : [],
    bannerPhotos : []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
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
    //获取4张录播图片
    this.getBannerPhoto(4);
    //获取分组
    this.loadGroups();
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

  },
  //跳转到添加分组
  addGroup(){
    wx.navigateTo({
      url: '/pages/group/group',
    });
  },
  //跳转到添加照片
  addImages(){
    wx.navigateTo({
      url: '/pages/addimages/addimages',
    });
  },
  //跳转到显示分组照片页面
  showGourpImages(e){
    let groupId = e.mark.groupId;
    let index = e.mark.index;
    //判断当前分组是否有图片
    let group = this.data.groups[index];
    if (group.lastPhostUrl == null || group.lastPhostUrl == "") {  //添加照片
      //跳转到添加照片
      wx.navigateTo({
        url: '/pages/addimages/addimages?index=' + index
      });
    }else{  //跳转到显示照片页面
      wx.navigateTo({
        url: '/pages/imageslist/imagelist?groupId=' + groupId
      });
    }
    console.log(e);
  },
  //获取banner
  getBannerPhoto(size){
    wx.cloud.callFunction({
      name: 'getBannerPhoto',
      data: {
        size : 4
      }
    }).then(res => {
      console.log(res);
      this.setData({ bannerPhotos : res.result.data});
      console.log("获取banner照片");
    })
  },
  //从数据库获取全部分组
  loadGroups() {
    wx.cloud.callFunction({
      name: 'getGroups',
    }).then(res => {
      console.log(res);
      this.setData({ groups: res.result.data });
    }).catch(err => {
      console.log(err);
    });
    console.log("获取所有分组");
  }

})