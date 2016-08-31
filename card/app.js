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

// mongoose模块
var db = require('mongoose');

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


////存数据
app.post('/card', (req, res) => {
  console.log('-----执行/card post请求-------')
  console.log('req.query--------')
  console.log(req.query);
  console.log('req.body--------')
  console.log(req.body);
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

//此处是修改操作执行的方法
app.put('/card/:id', (req, res) => {
  console.log('-----执行/card put请求-------')
  console.log('req.params--------')
  console.log(req.params);
  console.log('req.body--------')
  console.log(req.body);
  var card = req.body;
  card.update_time = Date.now();
  //根据id进行查找 并修改
  Card.findByIdAndUpdate(req.params.id, card, (err) => {
    //如果报错 执行err中的方法
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
app.get('/card/:id?', (req, res) => {
  console.log('-----执行/card get请求-------')
  console.log('req.params--------')
  console.log(req.params);
  console.log('req.body--------')
  console.log(req.body);
  if (req.params.id) {
    Card.findById(req.params.id, (err, data) => {
      if (err) { 
        res.json({ status: "n", msg: "获取数据失败", data: {} });
      }
      else {
        if (!!data) {
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
    //获取所有的数据
    Card.find().exec((err, data) => {
      if (err) { 
        res.json({ status: "n", msg: "获取数据失败", data: [] });
      }
      else { 
        data = data.map(function (item) {
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
