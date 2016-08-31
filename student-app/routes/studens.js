var express = require('express');
var router = express.Router();

var db = require('../db');
var moment = require('moment');

/**
 * 设置页面中用于分页的中间页面的内容
 * @param  {[type]} page      [description]
 * @param  {[type]} pageCount [description]
 * @return {[type]}           [description]
 */
function getPages(page, pageCount) {
    var pages = [page]
    // 左边的第1个页码
    var left = page - 1
    // 右边的第1个页码
    var right = page + 1

    // 左右两边各加1个页码，直到页码够11个或
    // 左边到1、右边到总页数
    while (pages.length < 11 && (left >= 1 || right <= pageCount)) {
        if (left > 0) pages.unshift(left--)
        if (right <= pageCount) pages.push(right++)
    }

    return pages
}

/* GET home page. */
router.get('/list/:page', function (req, res, next) {

    //////拼接查询条件数据
    var filter = {};
    var name = req.query.name;
    var mobile = req.query.mobile;
    var email = req.query.email;
    var gender = req.query.gender;
    var maxAge = req.query.maxAge;
    var minAge = req.query.minAge;

    if (!!name) {
        filter.name = { '$regex': `.*?${name}.*?` };
    }
    if (!!mobile) {
        filter.mobile = { '$regex': `.*?${mobile}.*?` };
    }
    if (!!email) {
        filter.email = { '$regex': `.*?${email}.*?` };;
    }
    if (!!gender) {
        filter.gender = gender;
    }
    if (!!maxAge && !!minAge) {
        filter.age = { '$lte': maxAge, '$gte': minAge };
    }
    // console.log(filter);

    var page = req.params.page;
    page = page || 1;
    page = parseInt(page);
    var pageSize = 3
    // console.log(page);


    db.Student.find(filter).count((err, total) => {
        if (err) {
            console.log(err);
        }
        //总页数(总共有多少页)
        var pageCount = Math.ceil(total / pageSize);

        //此处做页面范围限制
        if (page > pageCount) {
            page = pageCount
        }
        if (page < 1) {
            page = 1
        }
      
        db.Student.find(filter).skip((page - 1) * pageSize)
            .limit(pageSize).sort({ '_id': -1 }).exec((err, data) => {
                data.forEach(function (item) {
                    //console.log(moment(item.birthday).format('YYYY-MM-DD'));
                    //新增一个属性 用于村相互需要在页面上展示的日期时间值
                    item.birthdayForShow = moment(item.birthday).format('YYYY-MM-DD');
                })
                res.render('studens/list', {
                    data: data,
                    pages: getPages(page, pageCount),
                    page: page,
                    pageCount: pageCount
                });
            })
    })

   
});

/**
 * 新增和修改页面放在一起调用
 * @param  {[type]} '/editor/:id' [description]
 * @param  {[type]} function      (req,         res, next [description]
 * @return {[type]}               [description]
 */
router.get('/editor/:id', function (req, res, next) {
    //根据id去查找数据
    var id = req.params.id;
    //通过id去数据库中查找数据
    db.Student.findById(id, (err, data) => {
        if (data) {
            //格式化出一个日期字符串数据 用于在页面修改的时候显示
            data.birthdayForShow = moment(data.birthday).format('YYYY-MM-DD');
            console.log(data.birthdayForShow);
            console.log('编辑');
        }
        else {
            data = new db.Student();
            console.log('新增');
        }

        res.render('studens/editor', { data: data });
    })

   
})

router.post('/editor/:id', function (req, res, next) {
    var id = req.params.id;
    //获取从页面中传递过来的数据
    var student = req.body;

    //通过页面传递过来的出生年月计算年龄
    student.age = ((new Date()).getFullYear()) - (new Date(req.body.birthday)).getFullYear();

    db.Student.findByIdAndUpdate(id, student, { upsert: true }, (err) => {
        if (err) {
            console.log(err);
        }
        res.redirect('/student/list/1');
    });

 
})

/**
 * 根据ID删除记录
 */
router.post('/delete', function (req, res) {
    if (req.body.id) {
        db.Student.findByIdAndRemove(req.body.id, (err) => {
            if (err) {
                console.log(err);
            }
            res.redirect('/student/list/1');
        })
    }
    else {
        res.redirect('/student/list/1');
    }
})

module.exports = router;
