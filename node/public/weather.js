var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var schedule = require('node-schedule');
var util = require('util');
var http = require('http');
//抓取网站，并调用服务
function fetchData(key, page, code) {
    var url = 'http://php.weather.sina.com.cn/xml.php?city=' + key + '&password=DJOYnieT8234jlsK&day=' + page + '&code=' + code;
    request(url, function (err, res) {
        if (err) {
            console.log('err,共获取了' + page + '页');
            process.exit();
        }
        var $ = cheerio.load(res.body.toString());

        if ($('city').text() != "") {
            var status1 = $('status1').text();
            var status2 = $('status2').text();
            var info = {
                CityCode: res.req.path.split('&')[3].split('=')[1],
                WeatherDesc: status1 == status2 ? status1 : status2 == "" ? status1 : status1 + '转' + status2,
                HighTemperature: $('temperature1').text(), //最高温度
                LowTemperature: $('temperature2').text(),//最低温度
                ObtainDate: GetDateStr(0), //获取日期
                WeatherDate: GetDateStr(parseInt(res.req.path.split('&')[2].split('=')[1])),//天气日期
                WeatherType: res.req.path.split('&')[2].split('=')[1]//类型

            }

            info = require('querystring').stringify(info);
            var options = {
                host: '115.236.2.246',
                port: 52006,
                path: '/api/Weather/AddWeather',
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


    });
}
//定时器
function scheduleCronstyle() {
    schedule.scheduleJob('0 1 * * * *', function () {
        if (new Date().getHours() == 0 || new Date().getHours() == 6 || new Date().getHours() == 12 || new Date().getHours() == 18) {
            init();
        }
    });
}
//根据行政区划进行循环
function init() {
    console.log("获取天气中...");
    for (var i = 0; i < result.length; i++) {
        for (var j = 0; j < 4; j++) {
            fetchData(getcode(iconv.encode(result[i].Admin_Div_Name.substring(0, result[i].Admin_Div_Name.length - 1), 'gb2312')), j, result[i].Admin_Div_Code);
        }
    }
}
//转成GB2312
function getcode(code) {
    var arr = util.inspect(code).replace(/<Buffer /, '').replace(/>/, '').split(/\s+/);

    var ret = '';
    arr.map(function (e, i) {
        ret += '%' + e;
    });
    return ret;
}
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
    return y + '-' + m + '-' + d;
}