
#### 1、GetQueryString
    function GetQueryString(name)
    {
         var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
         var r = window.location.search.substr(1).match(reg);
         if(r!=null)return  unescape(r[2]); return null;
    }
     
    // 调用方法
    GetQueryString("参数名1");
#### 2、时间类库
    //日期处理方法
    .factory('datetimefun', function () {
        return {
            //2015-09-01 日期
            GetDayEn: function (time) {
                console.log(time);
                if (time === undefined)
                    return moment().format('L');
                if (time == null)
                    return time;
                return moment(time).format('L');
            },
            //2015年9月1日 日期
            GetDayCn: function (time) {
                if (time === undefined)
                    return moment().format('LL');
                if (time == null)
                    return time;
                return moment(time).format('LL');
            },
            //一月 月份
            GetMonthCn: function (time) {
                if (time === undefined)
                    return moment().format('MMMM');
                if (time == null)
                    return time;
                return moment(time).format('MMMM');
            },
            //01 月份
            GetMonthEn: function (time) {
                if (time === undefined)
                    return moment().format('MM');
                if (time == null)
                    return time;
                return moment(time).format('MM');
            },
            //星期一 星期
            GetWeek: function (time) {
                if (time === undefined)
                    return moment().format('dddd');
                if (time == null)
                    return time;
                return moment(time).format('dddd');
            },
            //3 季度
            GetQuarter: function (time) {
                if (time === undefined)
                    return moment().format('Q');
                if (time == null)
                    return time;
                return moment(time).format('Q');
            },
            //2001-01-01 12:00:00 时间
            GetDateTime: function (time) {
                if (time === undefined)
                    return moment().format('YYYY-MM-DD hh:mm:ss');
                if (time == null)
                    return time;
                return moment(time).format('YYYY-MM-DD hh:mm:ss');
            },
            //2001 年份
            GetYear: function (time) {
                if (time === undefined)
                    return moment().format('YYYY');
                if (time == null)
                    return time;
                return moment(time).format('YYYY');
            },
            //获取某月天数
            GetDaysInMonth: function (time) {
                if (time === undefined)
                    return moment(moment(), "YYYY-MM").daysInMonth();
                if (time == null)
                    return time;
                return moment(time, "YYYY-MM").daysInMonth()
            },
            //相对时间
            GetfromNow: function (time) {
                if (time == null)
                    return time;
                return moment(time, 'YYYYMMDD hh:mm:ss').fromNow();
            },
            //累加小时
            AddHours: function (time, hours) {
                if (time === undefined)
                    return moment().add(hours, 'hours').format('YYYYMMDD hh:mm:ss');
                if (time == null)
                    return time;
                return moment(time).add(hours, 'hours').format('YYYYMMDD hh:mm:ss');
            },
            //累加天数
            AddDays: function (time, days) {
                if (time === undefined)
                    return moment().add(days, 'days').format('L');
                if (time == null)
                    return time;
                return moment(time).add(days, 'days').format('L');
            },
            //累加月份
            AddMonths: function (time, months) {
                if (time === undefined)
                    return moment().add(months, 'months').format('L');
                if (time == null)
                    return time;
                return moment(time).add(months, 'months').format('L');
            },
            //累加年份
            AddYears: function (time, years) {
                if (time === undefined)
                    return moment().add(years, 'years').format('L');
                if (time == null)
                    return time;
                return moment(time).add(years, 'years').format('L');
            }
        }
    })
#### 3、时间方法
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
        return y +'-'+ m +'-'+ d;
    }