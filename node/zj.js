//var mongoose = require('mongoose');
const request = require('superagent');
const charset = require('superagent-charset');
var cheerio = require('cheerio');
var schedule = require('node-schedule');
var http = require('http');
//抓取网站，并调用服务
//GB2313数据处理
charset(request);
function fetchData(key, page) {
    var url = 'http://www.zjzfcg.gov.cn/new/articleSearch/search_' + page + '.do?count=100&bidType=&region=&chnlIds=&bidMenu=&searchKey=&bidWay=&flag=1&releaseStartDate=' + GetDateStr(-1) + '&noticeEndDate=&releaseEndDate=' + GetDateStr(1) + '&noticeEndDate1=&zjzfcg=0';
    request.get(url).charset('gbk').end(function (err, res) {
        if (err) {
            console.log('err,共获取了' + page + '页');
            process.exit();
        }
        var $ = cheerio.load(res.text);
        console.log('正在获取第' + page + '页数据');
        var info = {};
        //内容解析
        $('li').each(function () {
            info = {
                "Title": $(this).find('a').eq(2).attr("title"),
                "Url": "http://www.zjzfcg.gov.cn/new" + $(this).find('a').eq(2).attr("href").replace("..", ""),
                "Category": $(this).text().trim().split('·')[2].trim().split(']')[0].trim().replace('（', ''),
                "Area": $(this).text().trim().split('·')[1].trim().replace("[", ""),
                "FinishTime": $(this).find('span').text().replace("[截止:", "").replace("]", ""),
                "Source": "浙江政府采购",
                "PublicTime": ''
            };
            info = require('querystring').stringify(info);
            var options = {
                host: '115.236.2.246',
                port: 52006,
                path: '/api/Bidding/AddBidding',
                method: 'POST',
                headers: {
                    "Content-Type": 'application/x-www-form-urlencoded',
                    "Content-Length": info.length
                }
            };
            var req = http.request(options, function (res) {
                return;
            });
            req.write(info + "\n");
            req.end();


        });
        //判断是否最后一页
        if ($('li').length != 0) {
            page++;
            setTimeout(function () {
                fetchData(key, page);
            }, 2000);

        } else {
            console.log('共获取了' + page + '页，没有数据了...');
        }
    });
}
//定时器
scheduleCronstyle();
function scheduleCronstyle() {
    schedule.scheduleJob('0 1 * * * *', function () {
        if (new Date().getHours() >= 8 && new Date().getHours() <= 20) {

            fetchData('水利', 1);
        }
    });
}
//获取日期
function GetDateStr(AddDayCount) {
    var dd = new Date();
    dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1;//获取当前月份的日期
    if (m <= 9)
        m = '0' + m;
    var d = dd.getDate();
    if (d <= 9)
        d = '0' + d;
    return y + m + d;
}
//初始化
fetchData('水利', 1);

