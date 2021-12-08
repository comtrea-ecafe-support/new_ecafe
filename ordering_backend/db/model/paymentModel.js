const mongoose = require('mongoose');
var Schema = mongoose.Schema;
/**
 * count: 3
created: "-"
desc: "家常菜333333333"
img: "http://localhost:6166/static/img/tudousi.jpg"
name: "土豆丝222222222222"
price: "15"
typeid: 2
typename: "热菜333333333"
updated: "-"
__v: （…）
_id: "5f301b5e47f9f3012d2ba43b"
 * 
 */
var permitSchema = new Schema({
  id:  {type:Number,default:1}, // 权限自增id
  username:  {type:String,required:true}, // 权限自增id
  created: {type:String,required:false}, // 权限名称
  desc: {type:String,required:false}, // 权限名称
  img: {type:String,required:false}, // 权限名称
  name: {type:String,required:false}, // 权限名称
  typename: {type:String,required:false}, // 权限名称
  updated: {type:String,required:false}, // 权限名称
  updated: {type:String,required:false}, // 权限名称
  prince: {type:Number,default:0}, // 排序
  count:  {type:Number,default:0}, // 权限自增id
  price:  {type:Number,default:0}, // 权限自增id
  typeid:  {type:Number,default:0}, // 权限自增id
  isDone:  {type:Number,default:0}, // 权限自增id,
  takeMealTime:{type:String,required:false},
  selectFoods:{
    type:Array
  },
  createTime: {type:String,required:true},
  patient:{type:String,required:false}
});

var Permit = mongoose.model('payment', permitSchema);

module.exports = Permit;