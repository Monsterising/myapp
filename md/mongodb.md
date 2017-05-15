#### 1、controller
    var mongoose = require('mongoose');
    var News = mongoose.model('News');
    var redisClient = require('../../config/redis');
    
    const REDIS_NEWS_PREFIX = 'news_';
    
    var getNewsFromMongo = function(id, cb){
      console.log('run getNewsFromMongo');
      News
      .findOne({_id: id})
      .exec(function(err, doc){
        if(doc) {
          console.log('save mongo doc to redis');
          redisClient.set(REDIS_NEWS_PREFIX + id, JSON.stringify(doc));
        }
        return cb(err, doc);
      });
    };
    var getNewsFromRedis = function(id, cb){
      console.log('run getNewsFromRedis');
      redisClient.get(REDIS_NEWS_PREFIX + id, function(err, v){
        if(err) return cb(err, null);
        if(!v) {
          console.log('doc not in redis');
          return cb(null, null);
        }
        try {
          v = JSON.parse(v);
        } catch(e) {
          return cb(e, null);
        }
        console.log('get doc from redis');
        return cb(err, v);
      });
    };
    
    module.exports = {
      // 新闻的创建
        create: function(req, res, next){
          var news = new News(req.body);
          news.save(function(err){
            if(err) return next(err);
    
            return res.json(news);
          });
        },
        types:function (req, res, next){
            News
                .distinct('type')
                .exec(function(err, docs){
                    if(err) return next(err);
                    return res.json(docs);
                });
        },
        areas:function (req, res, next){
            News
                .distinct('area')
                .exec(function(err, docs){
                    if(err) return next(err);
                    return res.json(docs);
                });
        },
        nearlyGetTime:function (req, res, next){
            News
                .aggregate({"$group":{_id: 'max',max_value:{"$max":"$createTime"}}})
                .exec(function(err, docs){
                    if(err) return next(err);
                    return res.json(docs);
                });
        },
      // 获取列表
      list: function(req, res, next){
        var con={};
        //var reqs={source:'浙江政府采购',area:"环境服务",type:"江干区",st:"2014-2-1",et:"2018-12-1"}
        //var reqs={source:'杭州市政府采购网',st:"2014-2-1",et:"2018-12-1"}
          var pagestart=0;
          var pagesize=0;
    
          if(req){
              console.log(req.query);
              var st = new Date(req.query.st);
              var et= new Date(req.query.et);
               pagestart=parseInt(req.query.pagestart);
               pagesize= parseInt(req.query.pagesize);
              et.setDate(et.getDate() + 1);//获取AddDayCount天后的日期
              switch(req.query.source){
                  case "0":
                      con={source:'浙江政府采购',createTime: {$gte: st, $lt:et}};
                      if(req.query.type!="")
                          con.type=req.query.type;
                      if(req.query.area)
                          con.area=req.query.area;
                      if(req.query.title!="")
                          con.title=  {$regex: req.query.title, $options:'i'};
                      break;
                  case  "1":
    
                      con={source:'杭州市政府采购网',createTime:{$gte: st, $lt:et}};
                      if(req.query.title!="")
                          con.title=  {$regex: req.query.title, $options:'i'};
                      break;
              }
          }
    
        News
        .find(con).sort({createTime:-1})
        // 搜索时，跳过的条数
        .skip( pagestart )
    
        // 获取的结果集条数
        .limit( pagesize)
    
    
        .exec(function(err, docs){
    
          if(err) return next(err);
            //计算数据总数
            News
                .find(con).count()
                .exec(function(err,result){
    
                return res.json({rows:docs,total:result}) ;
    
            });
    
        });
      },
    // distinct:function(req,res,next){
    //  var type= req.query.type;
    //   News
    //     .distinct(type)
    //     // 搜索时，跳过的条数
    //     //.skip( (pagestart - 1) * pagesize )
    //     // 获取的结果集条数
    //    // .limit( pagesize)
    //     .exec(function(err, docs){
    //       if(err) return next(err);
    
    //       return res.json(docs);
    //     });
    // },
      // 处理路由参数
      getById: function(req, res, next, id){
        if(!id) return next(new Error('News not Found'));
        getNewsFromRedis(id, function(err, doc){
          if(err) return next(err);
    
          if(!doc) {
            getNewsFromMongo(id, function(err, doc){
              if(err) return next(err);
    
              if(!doc) {
                return next(new Error('News not Found'));
              }
              req.news = doc;
              return next();
            })
          } else {
            req.news = doc;
            return next();
          }
        })
      },
      // 获取新闻详情
      get: function(req, res, next) {
        return res.json(req.news);
      }
    };
#### 2、model
    var mongoose = require('mongoose');
    
    var NewsSchema = new mongoose.Schema({
      title:{           //标题
        type:String
      }, 
       url:{            //链接
        type:String,
        unique: true
      }, 
      source:String,     //来源
      area:String,       //地区
      type:String,       //类别
      publicTime: Date,  //发布时间
      finishTime:Date,   //截止时间
      createTime: {type: Date, default: Date.now}    //创建时间
    });
    
    var News = mongoose.model('News', NewsSchema);
#### 3、routes
    var NewsController = require('../controllers/news.server.controller');
    
    module.exports = function(app){
      //获取列表
      app.route('/news')
        .get(NewsController.list)
        .post(NewsController.create);
      //获取详情
      app.route('/news/:nid')
        .get(NewsController.get);
      //获取地区
      app.route('/types')
          .get(NewsController.types);
      //获取类型
      app.route('/areas')
          .get(NewsController.areas);
      //获取最新更新时间（得到的结果需要加8小时）
      app.route('/nearlyGetTime')
          .get(NewsController.nearlyGetTime);
      app.param('nid', NewsController.getById);
    };