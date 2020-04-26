// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  return new Promise((resolve, reject) => {
    db.collection('my_photos').add({
      data: {
        groupId: event.groupId,
        photoUrl : event.photoUrl,
        createTime: db.serverDate()
      }
    }).then(res => {
      resolve(res);
    });
  });
  
}