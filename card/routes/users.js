////引入mongoose模块
var db = require('mongoose');
//// 链接数据库 mongodb 协议, localhost 主机ip, student_db 数据库名称
db.connect('mongodb://localhost/student_db');

/////备忘录内容
var Note = db.model('note', {
  folder: { type: db.Schema.ObjectId,ref:'note_folder'}, ////关联的模型名字为数据库集合中的使用名单数形式
  content: { type: String, default: "" },
  create_time:{type:Date, default:Date.now},
  update_time:{type:Date,default:Date.now}
})
/////备忘录文件夹
var NoteFolder = db.model('note_folder',{
  name:{type:String,default:"",required:true},
  create_time:{type:Date, default:Date.now},
  update_time:{type:Date,default:Date.now}
})
////创建一个文件夹数据
// var noteFolder = new NoteFolder({name:"我的备忘录"})
// noteFolder.save((err)=>{
//   if(err){
//     console.log(err)
//   }
//   else{
//     /////创建一条文件数据 指定所属文件夹的id为创建的文件夹id
//     var note = new Note({folder:noteFolder._id,content:'这是一个测试内容'})
//     note.save(err=>{
//       if(err){
//         console.log(err)
//       }
//       else{
//         console.log(note)
//       }
//     })
//   }
// })
/////通过populate实现关联查询
//.populate('folder')
////查询id的时候注意此处的查询条件为_id
Note.find({_id:'5798576b258a6bbc0d1a4c00'}).exec((err,data)=>{
  console.log(data)
})
Note.find({_id:'5798576b258a6bbc0d1a4c00'}).populate('folder').exec((err,data)=>{
  console.log(data)
})
Note.findById('5798576b258a6bbc0d1a4c00',(err,data)=>{
  console.log(data)
})
