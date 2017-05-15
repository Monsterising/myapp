#### 1、http
    var http = require('http');
    //获取行政
    var result = [];
    var info = {ProviceCode: ''};
    var info = require('querystring').stringify(info);
    var options = {
        host: '115.236.2.246',
        port: 52006,
        path: '/api/AdminDivisions/GetAdminDivisions_CityCounty',
        method: 'post',
        headers: {
            "Content-Type": 'application/x-www-form-urlencoded',
        }
    };
    var req = http.request(options, function (res) {
        var responseText = '';
        res.on('data', function (data) {
            responseText += data.toString();
        });
        res.on('end', function (res) {
            result = JSON.parse(responseText).message;
            scheduleCronstyle();
            init();
    
        });
        res.on('error', function (e) {
            console.log(e);
        });
    });
    req.write(info);
    req.end();
#### 2、GB2312
    var iconv = require('iconv-lite');
    var util = require('util');
    //转成GB2312
    getcode(iconv.encode(result[i].Admin_Div_Name, 'gb2312')
    function getcode(code) {
        var arr = util.inspect(code).replace(/<Buffer /, '').replace(/>/, '').split(/\s+/);
        var ret = '';
        arr.map(function (e, i) {
            ret += '%' + e;
        });
        return ret;
    }
    
#### 3、定时器
    //定时器
    var schedule = require('node-schedule');
    function scheduleCronstyle() {
        schedule.scheduleJob('0 1 * * * *', function () {
            if (new Date().getHours() == 0 || new Date().getHours() == 6 || new Date().getHours() == 12 || new Date().getHours() == 18) {
                init();
            }
        });
    }
#### 4、request
    var request = require('request');
    var cheerio = require('cheerio');
    function  fetchData(key, page, code) {
        var url = 'http://php.weather.sina.com.cn/xml.php?city=' + key + '&password=DJOYnieT8234jlsK&day=' + page + '&code=' + code;
        request(url, function (err, res) {
            if (err) {
                console.log('err,共获取了' + page + '页');
                process.exit();
            }
            var $ = cheerio.load(res.body.toString());
            
        });
    }
#### 5、superagent
    const request = require('superagent');
    const charset = require('superagent-charset');
    var cheerio = require('cheerio');
    charset(request);
    function fetchData(key, page) {
        var url = 'http://www.zjzfcg.gov.cn/new/articleSearch/search_' + page + '.do?count=100&bidType=&region=&chnlIds=&bidMenu=&searchKey=&bidWay=&flag=1&releaseStartDate=' + GetDateStr(-1) + '&noticeEndDate=&releaseEndDate=' + GetDateStr(1) + '&noticeEndDate1=&zjzfcg=0';
        request.get(url).charset('gbk').end(function (err, res) {
            if (err) {
                console.log('err,共获取了' + page + '页');
                process.exit();
            }
            var $ = cheerio.load(res.text);
            });
    }
#### 6、mongoose
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
    info = {"title": $(this).find('a').text(),
            "url": "http://www.mwr.gov.cn/slzx/szyw" + $(this).find('a').attr("href").replace("./", "/"),
            "publicTime": $(this).find('span').text(),
            "source":"水利部官网",
            "type":"时政要闻"};
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
    
                  

