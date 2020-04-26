// pages/addimages/addimages.js
const prompts = ["选择分组","分组"]; 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    groups:[],
    groupName : "",
    imagesSrc : [],
    prompt: prompts[0],
    index : null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取分组
    this.loadGroups();
    let index = options.index;
    //设置分组值
    this.setData({ index });
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
  //选择分组
  changeGroup(e) {
    this.setData({ groupName: this.data.groups[e.detail.value].groupName });
    this.setData({ prompt: prompts[1] });
  },
  //选择图片
  chooseImage(){
    //分组校验
    if (this.checkGroup()) {  //已选择分组
      wx.chooseImage({
        count:10,
        success : res => {
          // tempFilePath可以作为img标签的src属性显示图片
          this.setData({ imagesSrc: res.tempFilePaths}); 
        }
      })
    }
  },
  //添加图片
  addImages(e){
    //分组校验
    if (this.checkGroup() == false){  //未选择分组
      return ;
    }
    //选择图片校验
    if(this.checkImages() == false){  //未选择照片
      return ;
    }
    let index = e.detail.value.groupIndex;
    //获取分组id
    let groupId = this.data.groups[index]._id;
    //数据库添加图片
    this.addImagesDB(groupId);
  },
  //数据库添加图片
  addImagesDB(groupId){
    wx.showLoading({
      title: '上传中',
      mask : true
    })
    //存储图片
    let imagesSrc = this.data.imagesSrc;
    for (let i = 0; i < imagesSrc.length;i++){
      wx.cloud.uploadFile({
        cloudPath: 'photos/' + this.getID(),
        filePath: imagesSrc[i], // 文件路径
      }).then(res => {
        let photoUrl = res.fileID;
        //存储到数据到数据库
        wx.cloud.callFunction({
          name: 'addPhoto',
          // 传递给云函数的event参数
          data: {
            groupId, photoUrl
          }
        }).then(res => {
          console.log(res);
          if (i == imagesSrc.length - 1) {  //最后插入的图片
            this.updataGroupLastPhoto(groupId, photoUrl);
            //隐藏上传加载提示
            wx.hideLoading();
            //提示上传成功
            wx.showToast({
              title: '上传成功！',
              icon: "success"
            });
            //清除图片
            this.setData({ imagesSrc : null});
            //修改分组提示信息
            this.setData({ prompt: prompts[0]});
            //清除选择分组的提示信息
            this.setData({ groupName : ""});
          }
        }).catch(err => {
          console.log(err);
        })
      })
    }
  },
  //修改分组中最后添加的一张图片
  updataGroupLastPhoto(groupId, lastPhostUrl){
    wx.cloud.callFunction({
      name: 'updataGroupLastPhoto',
      // 传递给云函数的event参数
      data: {
        groupId, lastPhostUrl
      }
    }).then(res => {
      console.log(res);
    }).catch(err => {
      console.log(err);
    })
  },
  //从数据库获取全部分组
  loadGroups() {
    wx.cloud.callFunction({
      name: 'getGroups',
    }).then(res => {
      console.log(res);
      this.setData({ groups: res.result.data });
      //如果是从首页过来的（为分组添加照片）
      let index = this.data.index;
      if (index != null && index >= 0) {
        //显示分组
        this.setData({ groupName: this.data.groups[index].groupName });
        this.setData({ prompt: prompts[1] });
      }
    }).catch(err => {
      console.log(err);
    });
    console.log("获取所有分组");
  },
  //分组校验
  checkGroup(){
    if (this.data.prompt != "分组") {  //未选择分组
      wx.showToast({
        title: '请选择分组！',
        icon: "none"
      })
      return false;
    }
    return true;
  },
  //选择图片校验
  checkImages(){
    let imagesSrc = this.data.imagesSrc;
    if(imagesSrc == null || imagesSrc.length == 0){ //未选择图片
      wx.showToast({
        title: '请选择图片！',
        icon: "none"
      })
      return false;
    }
    return true;
  },
  getID(length) {
    return Number(Math.random().toString().substr(3, length) + Date.now()).toString(36);
  },
})