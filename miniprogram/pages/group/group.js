// pages/group/group.js
const prompts = ["添加分组", "保存修改"];
let updataGroupsIndex = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    groups:[],
    groupName : null,
    groupId : null,
    index : null,
    prompt: prompts[0]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //从数据库获取全部分组
    this.loadGroups();
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
  //点击 修改 按钮
  changeGroupName(e){ 
    //修改提交按钮提示信息 为 保存修改
    this.setData({ prompt: prompts[1] });
    //获取按钮的index
    let index = e.mark.index;
    this.setData({index});
    //获取组名
    this.setData({ groupName: this.data.groups[index].groupName});
    //获取组的id
    this.setData({ groupId: this.data.groups[index]._id});
  },
  //点击删除分组
  deleteGroup(e){
    let index = e.mark.index;
    wx.showModal({
      title: '删除分组',
      content: '您确认删除分组 “' + this.data.groups[index].groupName+'” 吗？',
      success : res => {  //确认删除分组
        if (res.confirm) {
          //数据库删除分组
          this.deleteGroupDB(this.data.groups[index]._id);
        } else if (res.cancel) {  //取消删除分组
          this.showToast('已取消！',"none");
        }
      }
    })
  },
  //点击提交按钮（ 添加或修改分组 ）
  saveOrChangeGroup(e){
    //获取输入的分组名
    let groupName = e.detail.value.groupName;
    if (groupName != null && groupName != ""){  //分组名非空验证
      //获取组名id
      let groupId = this.data.groupId;
      //判断是修改还是添加分组
      if (groupId != null && groupId != "") { //修改分组名
        //验证输入的分组名是否 为原始值
        if (groupName == this.data.groupName){  //未改变分组名
          this.showToast("分组名不能为原始名称！", 'none');
          return ;
        }
        //修改提交按钮提示信息 为 添加分组
        this.setData({ prompt: prompts[0] });
        //数据库修改分组名
        this.changeGroupNameDB(groupName);
      } else {                              //添加分组名
        //数据库添加分组
        this.addGroupDB(groupName);
      }
      //去除表单中显示的组名
      this.setData({ groupName: null });
    }else{  //没有分组名
      this.showToast("分组名称不能为空！", 'none');
    }
  },
  //数据库添加分组
  addGroupDB(groupName){
    wx.cloud.callFunction({
      name: 'addGroup',
      // 传递给云函数的event参数
      data: {
        groupName
      }
    }).then(res => {
      console.log(res);
      //从数据库获取全部分组
      this.loadGroups(true,"添加成功！","success");
    }).catch(err => {
      console.log(err);
    })
    console.log("添加分组", groupName);
  },
  //数据库修改分组名
  changeGroupNameDB(groupName){
    //修改分组名
    wx.cloud.callFunction({
      name: 'updataGroupName',
      // 传递给云函数的event参数
      data: {
        "_id":this.data.groupId,
        groupName
      }
    }).then(res => {
      console.log(res);
      //页面中修改组名
      this.changeGroupNameInPage(groupName);
    }).catch(err => {
      console.log(err);
    })
    //还原data中的grouId为空
    this.setData({ groupId: null });
    console.log("修改分组名", groupName);
  },
   //页面中修改组名
  changeGroupNameInPage(groupName){
    let groups = this.data.groups;
    let index = this.data.index;
    groups[index].groupName = groupName;
    this.setData({ groups });
    this.setData({index : null});
    this.showToast("修改成功");
    console.log("页面中修改组名");
  },
  //数据库删除分组
  deleteGroupDB(groupId){
    wx.cloud.callFunction({
      name: 'deleteGroup',
      data: {
        "_id": groupId
      }
    }).then(res => {
      console.log(res);
      //删除分组中的照片
      this.deleteGroupPhoto(groupId);
      console.log("删除分组", groupId);
    });
  },
  //数据库删除分组中的照片
  deleteGroupPhoto(groupId){
    wx.cloud.callFunction({
      name: 'deleteGroupPhoto',
      data: {
        groupId
      }
    }).then(res => {
      console.log(res);
      //页面中删除分组
      this.deleteGroupPhotoInPage();
      console.log("删除分组中的照片");
    });
  },
  //页面中删除分组
  deleteGroupPhotoInPage(){
    let index = this.data.index;
    let groups = this.data.groups;
    groups.splice(index,1);
    this.setData({groups});
    this.setData({ index: null });
    this.showToast("删除成功");
    console.log("页面中删除分组");
  },
  //从数据库获取全部分组
  loadGroups() {
    this.loadGroups(false, "", "");
  },
  //从数据库获取全部分组 
  loadGroups(showToast, title,icon){
    wx.cloud.callFunction({
      name: 'getGroups',
    }).then(res => {
      console.log(res);
      this.setData({ groups: res.result.data});
    }).catch(err => {
      console.log(err);
    });
    //是否显示提示框
    if (showToast){   //显示提示内容
      this.showToast(title, icon);
    }
    console.log("获取所有分组");
  },
  //显示消息提示框 成功图标
  showToast(title) {
    showToast(title, "success")
  },
  //显示消息提示框
  showToast(title, icon){
    wx.showToast({
      title,
      icon,
    })
  }
})