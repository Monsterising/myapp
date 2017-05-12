var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var counts = 0;
function fetchData(key, page) {
    var url = 'http://www.zjzfcg.gov.cn/new/articleSearch/search_'+page+'.do?count=30&bidType=&region=&chnlIds=207,211&bidMenu=&searchKey=&bidWay=&applyYear=2016&flag=1&releaseStartDate=&noticeEndDate=&releaseEndDate=&noticeEndDate1=&zjzfcg=0';

    request({encoding: null,url:url}, function (err, res) {
        if (err) {
            return console.log(err);
        }
        var $ = cheerio.load(iconv.decode(res.body.toString()));
        var arr = [];
        var info = {};

        $('li').each(function () {

            info = {
                "title": $(this).find('a').eq(2).text(),
                "url": "http://www.zjzfcg.gov.cn/new" + $(this).find('a').eq(2).attr("href").replace("..", ""),
                "sou": $(this).find('font').eq(0).text().replace("[", ""),
                "type": $(this).find('font').eq(0).text().replace("]", ""),
                "finishTime":$(this).find('span').text().replace("[截止ֹ:", "").replace("]", "")
            };
            arr.push(info);
            console.log(info);
            counts++;

        });
        if ($('li').length == 0) {
            console.log('没有数据了...');
            console.log("总计查询 " + counts + " 条数据，查询了 " + (page) + " 页")
        } else {
            page++;
            setTimeout(function () {
                fetchData(key, page);
            }, 2000);
        }
    });
}
fetchData('', 1);