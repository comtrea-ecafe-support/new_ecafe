const express = require('express')
const router = express.Router()
const Food = require('../db/model/foodModel')
const { formatDateTime } = require('../utils/time');
const User = require('../db/model/userModel')
const payment = require('../db/model/paymentModel')
const Mail = require('../utils/mail');
const path = require('path')
const moment = require('moment')
const ObjectsToCsv = require('objects-to-csv')
/**
 * @api {post} /food/add 商品添加
 * @apiName 商品添加
 * @apiGroup Food
 *
 * @apiParam {String} name 名称
 * @apiParam {String} price 价格
 * @apiParam {String} desc 描述
 * @apiParam {Number} typeid 分类id
 * @apiParam {String} img 图片
 * @apiParam {String} typename 分类名称
 */
router.post('/add', (req, res) => {
  // req.body.selectFoods.forEach((item)=>{
  //   item.username = req.body.username
  //   payment.insertMany(item)
  // })
  // var item = {};

  if (req.body._id) {
    const { _id, username,selectFoods,patient } = req.body
    payment.updateOne({ _id }, { selectFoods ,patient})
      .then(() => {
        res.send({ code: 200, msg: '修改成功' })
      })
      .catch(() => {
        res.send({ code: 500, msg: '修改失败' })
      })
  } else {

    const {  username } = req.body
    delete req.body['_id']
    var  createTime = new Date().toLocaleString('zh-CN')
    createTime = moment().format("MM-DD-YYYY");
    payment.insertMany({
      createTime : createTime,
      ...req.body
    }).then((result) => {
      res.send({ code: 200, msg: '添加成功' })
    }).catch((err) => {
      res.send({ code: 200, msg: '添加失败' })
    });
  }
})

/**
 * @api {post} /food/del 删除
 * @apiName 删除
 * @apiGroup Food
 *
 * @apiParam {Number} _id id
 */
router.post('/del', (req, res) => {
  const { _id } = req.body

  payment.remove({ _id })
    .then((data) => {
      res.send({ code: 200, msg: '删除成功' })
    })
    .catch(() => {
      res.send({ code: 500, msg: '删除失败' })
    })
})

/**
 * @api {post} /food/update 商品修改
 * @apiName 商品修改
 * @apiGroup Food
 *
 * @apiParam {String} _id id
 * @apiParam {String} name 名称
 * @apiParam {Number} price 价格
 * @apiParam {String} desc 描述
 * @apiParam {Number} typeid 分类id
 * @apiParam {String} img 图片
 * @apiParam {String} typename 分类名称
 */
router.post('/update', (req, res) => {
  const { _id, username,selectFoods ,takeMealTime,isDone} = req.body
  payment.update({ _id }, { username,selectFoods,isDone,takeMealTime })
    .then(() => {
      if(isDone){
        Mail.sendOrderTime(username,takeMealTime,_id)
      } else {
        Mail.sendOrderError(username)
      }
      res.send({ code: 200, msg: '修改成功' })
    })
    .catch(() => {
      res.send({ code: 500, msg: '修改失败' })
    })
})

/**
 * @api {post} /food/page 商品列表
 * @apiName 商品列表
 * @apiGroup Food
 *
 * @apiParam {Number} pageNo 页数
 * @apiParam {Number} pageSize 条数
 * @apiParam {Number} typeid 分类id
 * @apiParam {Number} key 关键字查询
 */
router.post('/page', (req, res) => {
  const pageNo = Number(req.body.pageNo) || 1
  const pageSize = Number(req.body.pageSize) || 10000
  const { typeid,username } = req.body

  const { key } = req.body
  const reg = new RegExp(key)
  let query = {}
  if (username) {
    query = {
      username,
      isDone : req.body.isDone,
    }
  } else {
    query = {
    }
  }
  payment.countDocuments(query, (err, count) => {
    if (err) {
      res.send({ code: 500, msg: '商品列表获取失败' })
      return
    }
    payment.find(query)
      .skip(pageSize * (pageNo - 1))
      .limit(pageSize)
      .then((data) => {
        const temp = []

        data.map(item => {
          temp.push(item)
        })
        res.send({
          code: 200,
          data: temp,
          total: count,
          pageNo: pageNo,
          pageSize: pageSize,
          msg: '商品列表获取成功',
        })
       
      })
      .catch(() => {
        res.send({ code: 500, msg: '商品列表获取失败' })
      })
  })
})

router.post('/lastPage', (req, res) => {
  const pageNo = Number(req.body.pageNo) || 1
  const pageSize = Number(req.body.pageSize) || 10000
  const { typeid,username } = req.body

  const { key } = req.body
  const reg = new RegExp(key)
  let query = {}
  if (username) {
    query = {
      username,
    }
  } else {
    res.send({ code: 500, msg: '请输入用户名' })
      return
  }
  payment.countDocuments(query, (err, count) => {
    if (err) {
      res.send({ code: 500, msg: '商品列表获取失败' })
      return
    }
    payment.find(query)
      .skip(pageSize * (pageNo - 1))
      .limit(pageSize)
      .then((data) => {
        res.send({
          code: 200,
          data: data[data.length - 1],
          total: count,
          pageNo: pageNo,
          pageSize: pageSize,
          msg: '商品列表获取成功',
        })
      })
      .catch(() => {
        res.send({ code: 500, msg: '商品列表获取失败' })
      })
  })
})

router.post('/export', (req, res) => {
  const pageNo = Number(req.body.pageNo) || 1
  const pageSize = Number(req.body.pageSize) || 10000
  const { typeid,username } = req.body

  const { key } = req.body
  const reg = new RegExp(key)
  let query = {}
  if (username) {
    query = {
      
    }
  } else {
    query = {}
  }
  payment.countDocuments(query, (err, count) => {
    if (err) {
      res.send({ code: 500, msg: '商品列表获取失败' })
      return
    }
    payment.find(query)
      .skip(pageSize * (pageNo - 1))
      .limit(pageSize)
      .then((data) => {
        var temp = []
        var count = 0;
        var price = 0;
        data  = data.map((item)=>{

          if(!item.patient){
            item._doc.patient = ''
          }
          if (item.selectFoods) {
            item.selectFoods.forEach(item1 => {
              item1.patient = item._doc.patient
              var result = {
                username : item.username,
                takeMealTime : item.takeMealTime,
                isDone : item.isDone,
                ...item1,
              }
              temp.push(result);
              if(item1.count){
                count += item1.count
              }
              if(item1.price){
                price += item1.count * item1.price
              }
            });
          }
          return  item._doc})
          var result = {};
          // Total Spent就显示这一个月这个账号的所有的账单加起来要多少钱
          // Total Patient Orders是如果这个账号为病人点过餐就把它这一个月点的所有账单加起来显示
          temp.forEach((data)=>{
            if (!result[data.username]) {
              result[data.username] = {}
              result[data.username]['Total Patient Orders'] = 0
              result[data.username]['Total Spent'] = 0
            } 
            if (data.patient) {
              result[data.username]['Total Patient Orders'] += data.count * data.price 
            }else {
              result[data.username]['Total Spent'] += data.count * data.price 
            }
          });
          temp = []
          for (const key in result) {
            if (Object.hasOwnProperty.call(result, key)) {
              const element = result[key];
              element.username = key;
              temp.push(element)
            }
          }
        const csv = new ObjectsToCsv(temp)
        var fileName = Math.random().toString(36).substr(2) + '.csv'
        
        csv.toDisk(`./ordering_backend/static/${fileName}`)
        res.send({ filepath:`http://localhost:6166/static/${fileName}`,code: 200, msg: '删除成功' })
      })
      .catch(() => {
        res.send({ code: 500, msg: '商品列表获取失败' })
      })
  })
})

module.exports = router
