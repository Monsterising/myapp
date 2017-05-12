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