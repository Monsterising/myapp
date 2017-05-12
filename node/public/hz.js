var mongoose = require('mongoose');
var request = require('request');
var cheerio = require('cheerio');
var http = require('http');
var schedule = require('node-schedule');
var thisday = GetDateStr(0);
var thisdateday = GetDateStr(0);
//抓取网站，并调用服务
function fetchData(key, page) {
    var url = 'http://cg.hzft.gov.cn/www/noticelist.do?page.pageNum=' + page;
    request(url, function (err, res) {
        if (err) {
            console.log('err,共获取了' + page + '页');
            process.exit();
        }
        var $ = cheerio.load(res.body.toString());
        console.log('正在获取第' + page + '页数据');
        var info = {};
        //内容解析
        $('.c_list_item li').each(function () {
            if ($(this).find('a').length > 0) {
                info = {
                    "Title": $(this).find('a').text().split('.')[1].trim(0),
                    "Url": "http://cg.hzft.gov.cn/www/noticedetail.do?noticeguid=" + $(this).find('a').attr("onclick").replace("updateNoticeclick('", "").replace("')", ""),
                    "PublicTime": $(this).find('span').text().trim(),
                    "Source": "杭州市政府采购网"
                };
                thisdateday = $(this).find('span').text().trim();
                //判断是否是当天数据
                if (thisdateday == thisday) {
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

                }
            }

        });
        //是否是最后一页
        var pagenum = $('.pages span').eq(0).text().replace("共", "").replace("页", "").split('/');
        //下一页
        if (pagenum[0] != pagenum[1] && thisdateday == thisday) {

            page++;
            setTimeout(function () {
                fetchData(key, page);
            }, 1000);
        }
        else {
            // db.end();
            console.log('共获取了' + page + '页，没有数据了...');
        }

    });
}
//定时器
scheduleCronstyle();
function scheduleCronstyle() {
    schedule.scheduleJob('0 1 * * * *', function () {
        if (new Date().getHours() >= 8 && new Date().getHours() <= 20) {
            thisdateday = GetDateStr(0);
            thisday = GetDateStr(0);
            fetchData('水利', 1);
        }
    });
}
//初始化
fetchData('水利', 1);
//获取日期
function GetDateStr(AddDayCount) {
    var dd = new Date();
    dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1 > 9 ? dd.getDate() : '0' + (dd.getMonth() + 1);//获取当前月份的日期
    var d = dd.getDate() > 9 ? dd.getDate() : '0' + dd.getDate();
    return y + "-" + m + "-" + d;
}
