var mongoose = require('mongoose');

var NewsSchema = new mongoose.Schema({
  title:{           //����
    type:String
  }, 
   url:{            //����
    type:String,
    unique: true
  }, 
  source:String,     //��Դ
  area:String,       //����
  type:String,       //���
  publicTime: Date,  //����ʱ��
  finishTime:Date,   //��ֹʱ��
  createTime: {type: Date, default: Date.now}    //����ʱ��
});

var News = mongoose.model('News', NewsSchema);