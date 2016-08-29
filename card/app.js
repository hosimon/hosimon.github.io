var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

// view engine setup
////引入arttemplate模板
var template = require('art-template');
template.config('base', '');
template.config('extname', '.html');
app.engine('.html', template.__express);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

////引入mongoose模块
var db = require('mongoose');

//// 链接数据库 mongodb 协议, localhost 主机ip, student_db 数据库名称
db.connect('mongodb://localhost/student_db');

/***
 * 名片模型
 */
var Card = db.model('card', {
  name: { type: String, default: "" },
  title: { type: String, default: "" },
  address: { type: String, default: "" },
  phone: { type: String, default: "" },
  qq: { type: String, default: "" },
  email: { type: String, default: "" },
  description: { type: String, default: "" },
  create_time:{type:Date, default:Date.now},
  update_time:{type:Date,default:Date.now}
})

/////使用mongoose保存数据到数据库 新建一个collections集合 名字为card
////存数据
app.post('/card', (req, res) => {
  console.log('-----执行/card post请求-------')
  console.log('req.query--------')
  console.log(req.query);
  console.log('req.body--------')
  console.log(req.body);
  /////在服务器端保存数据 把数据写入数据库
  /////在返回数据的时候把保存的数据读取出来放入data值中
  var card = new Card(req.body);
  card.update_time = Date();
  card.save((err) => {
    if (err) {
      res.json({ status: "n", msg: "新增数据失败", data: {} });
    }
    else {
      var data = card.toObject();
      data.id = data._id;
      delete data._id;
      res.json({ status: "y", msg: "新增数据成功", data: data });
    }
  })
})

/////此处是修改操作执行的方法
app.put('/card/:id', (req, res) => {
  console.log('-----执行/card put请求-------')
  console.log('req.params--------')
  console.log(req.params);
  console.log('req.body--------')
  console.log(req.body);
  /////在服务器端保存数据 把数据写入数据库
  /////在返回数据的时候把保存的数据读取出来放入data值中
  var card = req.body;
  card.update_time = Date.now();
  /////根据id进行查找 并修改
  Card.findByIdAndUpdate(req.params.id, card, (err) => {
    /////如果报错 执行err中的方法
    if (err) {
      res.json({ status: "n", msg: "修改数据失败", data: {} });
    }
    else {
      // var data = card.toObject();
      card.id = req.params.id;
      delete card._id
      res.json({ status: "y", msg: "修改数据成功", data: card });
    }
  })
})

/////取数据
///////  /:id? 取id参数,此id参数为可选的
//////  /card或者/card/a7sd67adsasdjakg
app.get('/card/:id?', (req, res) => {
  console.log('-----执行/card get请求-------')
  console.log('req.params--------')
  console.log(req.params);
  console.log('req.body--------')
  console.log(req.body);
  ////判断req.params.id是否存在
  if (req.params.id) {
    /////如果存在req.params.id内容 执行findeById操作
    Card.findById(req.params.id, (err, data) => {
      if (err) { /////如果查询失败 执行
        res.json({ status: "n", msg: "获取数据失败", data: {} });
      }
      else {
        /////判断查询返回的数据是否为空
        if (!!data) {
          ////对查询返回的数据做处理
          var temData = data.toObject();
          temData.id = data._id;
          delete temData._id;
          res.json({ status: "y", msg: "获取数据成功", data: temData });
        }
        else {
          res.json({ status: "n", msg: "获取数据失败", data: {} });
        }
      }
    })
  }
  else {
    /////获取所有的数据
    Card.find().exec((err, data) => {
      if (err) { /////获取数据失败
        res.json({ status: "n", msg: "获取数据失败", data: [] });
      }
      else { ////获取数据成功
        /////对查询到的结果数据做遍历操作
        data = data.map(function (item) {
          /////处理每一次遍历的对象 增加id属性,删除_id属性
          item = item.toObject();
          item.id = item._id;
          delete item._id;
          return item;
        })
      }
      res.json({ status: "y", msg: "获取数据成功", data: data });
    })
  }
})

app.delete('/card/:id',(req,res)=>{
  if(req.params.id){
    Card.findByIdAndRemove(req.params.id,(err)=>{
      if(err){
        console.log(err)
        res.json({status:'n',msg:'删除失败'})
      }
      else{
        res.json({status:'y',msg:'删除成功'})
      }
    })
  }
  else{
    res.json({status:'n',msg:'参数错误'})
  }
})

app.listen(3000, () => {
  console.log('服务器运行中...');
})
