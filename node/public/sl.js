
var mongoose=require('mongoose');
var request = require('request');
var cheerio = require('cheerio');
mongoose.connect('mongodb://localhost/scms');
var NewsSchema = new mongoose.Schema({
  title:{
    type:String
  }, 
   url:{
    type:String,
    unique: true
  }, 
  source:String,
  area:String,
  type:String,
  publicTime: Date,
  finishTime:Date,
  createTime: {type: Date, default: Date.now}
});
var News=mongoose.model('News',NewsSchema);

function fetchData(key, page) {
    var url = "";
    if (page == 0)
        url = 'http://www.mwr.gov.cn/slzx/szyw/index.html';
    else
        url = 'http://www.mwr.gov.cn/slzx/szyw/index_' + page + '.html';
    // var url = 'http://zzk.cnblogs.com/s?t=b&w=' +  + '&p=' + page;
    request(url, function (err, res) {
        if (err) {
             console.log('err,共获取了'+page+'页');
            process.exit();
            //return console.log("err1");
        }
        var $ = cheerio.load(res.body.toString());
     
         console.log("正在获取第"+page+"页信息");
        //内容解析
        $('#ul_slb3').each(function () {
            $(this).find('li').each(function () {
            var info = {};
                info = {
                    "title": $(this).find('a').text(),
                    "url": "http://www.mwr.gov.cn/slzx/szyw" + $(this).find('a').attr("href").replace("./", "/"),
                    "publicTime": $(this).find('span').text(),
                    "source":"水利部官网",
                    "type":"时政要闻"
                };
        
           
                var news=new News(info);
                News.findOne(info,function(err,docs){
                  if(err)
                  console.log('err2');
                  if(!docs){
                     //console.log('插入新数据...');
                         news.save();
                  }
                  else{
                      console.log('数据重复了...');
                     process.exit();
                  }

                })

            })
           
           
          
        });
        var pagenum = $("div[style^='padding:27px 30px']");
        //下一页
        if(pagenum[0] != pagenum[1]) {
            //下一页

            page++;
            setTimeout(function () {
                fetchData(key, page);
            }, 1000);
        }else{
            console.log('共获取了'+page+'页，没有数据了...');
            process.exit();
         
        }

    });
}
fetchData('水利', 0);