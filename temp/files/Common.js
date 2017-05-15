app.factory('http', function ($http) {
    return {
        //http.POST请求，该项目全部使用post请求方法
        post: function (myUrl, data) {
            return $http({
                url: myUrl,
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: data,
            }).then(function (data) {
                return data.data;
            });
        }
    }
})
/*.factory('BlankFactory', function () {
 var commonUrl = "http://serv.dcxxsoft.xyz:52000/api/";
 return {
 //post请求
 getPostName: function (name,userId) {
 return commonUrl + name + '?userID=' + userId;
 }
 }
 })*/
    .factory('BlankFactory', function () {
        var commonUrl = "http://serv.dcxxsoft.xyz:52001/api/";
        return {
            //post请求
            getPostName: function (name) {
                return commonUrl + name;
            }
        }
    })


    .factory('TimeCountFactory', function () {
        return {
            getNowYear: function () {
                var thisDate = new Date();
                var comYear = thisDate.getFullYear();
                return comYear;

            },
            getNowMonth: function () {
                var thisDate = new Date();
                var comMonth = thisDate.getMonth();
                return comMonth+1;
            },
            getToMonthFirst:function () {
                var nowDate, year, month, date;
                var currDate = new Date();
                year = currDate.getFullYear();
                month = currDate.getMonth() + 1;
                date = currDate.getDate();
                date = (date < 10) ? ('0' + date) : date;
                month = (month < 10) ? ('0' + month) : month;
                nowDate = year + '-' + month + '-' + '01';
                return nowDate;
            },
            getNowDate: function () {
                var nowDate, year, month, date;
                var currDate = new Date();
                year = currDate.getFullYear();
                month = currDate.getMonth() + 1;
                date = currDate.getDate();
                date = (date < 10) ? ('0' + date) : date;
                month = (month < 10) ? ('0' + month) : month;
                nowDate = year + '-' + month + '-' + date;
                return nowDate;
            },
            get1MonthBefor: function () {
                var resultDate, year, month, date;
                var currDate = new Date();
                year = currDate.getFullYear();
                month = currDate.getMonth() + 1;
                date = currDate.getDate();
                switch (month) {
                    case 1:
                        month += 11;
                        year--;
                        break;
                    default:
                        month -= 1;
                        break;
                }
                date = (date < 10) ? ('0' + date) : date;
                month = (month < 10) ? ('0' + month) : month;
                resultDate = year + '-' + month + '-' + date;
                return resultDate;
            },
            get3MonthBefor: function () {
                var nowDate, resultDate, year, month, date;
                var currDate = new Date();
                year = currDate.getFullYear();
                month = currDate.getMonth() + 1;
                date = currDate.getDate();
                switch (month) {
                    case 1:
                    case 2:
                    case 3:
                        month += 9;
                        year--;
                        break;
                    default:
                        month -= 3;
                        break;
                }
                date = (date < 10) ? ('0' + date) : date;
                month = (month < 10) ? ('0' + month) : month;
                resultDate = year + '-' + month + '-' + date;
                return resultDate;
            },
            get1YearBefor: function () {
                var resultDate, year, month, date;
                var currDate = new Date();
                year = currDate.getFullYear();
                month = currDate.getMonth() + 1;
                date = currDate.getDate();
                year--;
                date = (date < 10) ? ('0' + date) : date;
                month = (month < 10) ? ('0' + month) : month;
                resultDate = year + '-' + month + '-' + date;
                return resultDate;
            }
        }

    })

    //遍历生成字符串组
    .factory('arryList', function () {

        return {
            arryGet: function (lists) {
                var keys = '';
                for (var p in lists) {
                    keys += "&" + p + "=" + lists[p];
                }
                return keys;
            }
        }

    })
    //拆解数组为字符串
    .factory('stringIn', function () {
        return {
            stringGet: function (list) {
                var perId = '';
                for (var i = 0; i < list.length; i++) {
                    perId += list[i].id + ",";
                }
                perId = perId.substring(0, perId.lastIndexOf(','));
                return perId;
            }
        }
    })
    .factory('stringfile', function () {
        return {
            fileGet: function (data) {
                var fileId = data;
                return fileId;
                if (data instanceof Array) {
                    for (var i = 0; i < data.length; i++) {
                        fileId += data[i] + ",";
                    }
                    fileId = fileId.substring(0, fileId.lastIndexOf(','));
                    return fileId;
                }
            }
        }
    })
    .factory('stringNum', function () {
        return {
            stringGet: function (list) {
                var num = list;
                if (list instanceof Array) {
                    for (var i = 0; i < list.length; i++) {
                        num += list[i] + ",";
                    }
                    num = num.substring(0, num.lastIndexOf(','));
                    return num;
                }
            }
        }
    })
    //把请求数据拆解成数组（获取文件）
    .factory('fileInto', function () {
        return {
            fileUrls: function (data) {
                var filesInfo = [];
                for (var i = 0; i < data.length; i++) {
                    filesInfo[i] = 'http://serv.dcxxsoft.xyz:52000' + data[i].file_url;
                }
                return filesInfo;
            },
            fileNames: function (data) {
                var filesInfo = [];
                for (var i = 0; i < data.length; i++) {
                    filesInfo[i] = {
                        caption: data[i].file_title + data[i].file_type,
                        url: 'http://serv.dcxxsoft.xyz:52000/api/filemanager/DeleteFile?fileID=' + data[i].file_id,
                        key: data[i].file_id
                    };
                }
                return filesInfo;
            }
        }
    })
    //生成文件绑定数组
    .factory('fileArr', function () {
        return {
            getFile: function (data) {
                var fileInfos = [];
                for (var i = 0; i < data.length; i++) {
                    fileInfos.push({
                        id: data[i].file_id,
                        name: data[i].file_title + data[i].file_type,
                        url: 'http://serv.dcxxsoft.xyz:52000' + data[i].file_url
                    })
                }
                return fileInfos;
            }
        }
    })
    //按日期排序
    .factory('getDate', function () {
        return {
            getThis: function (arr, name) {
                var newName = name;
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i][name].length > 10) {
                        arr[i][name] = arr[i][name].substring(0, 10);
                    } else {
                        arr[i][name] = arr[i][name];
                    }
                }
                arr.sort(function (a, b) {
                    return parseInt(b[newName].replace(/-/g, ''), 10) - parseInt(a[newName].replace(/-/g, ''), 10);//时间正序
                });
                return arr;

            }
        }
    })
    //时间长度返回10位
    .factory('filterDate', function () {
        return {
            getThis: function (arr, name) {
                var newName = name;
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i][name] == undefined || arr[i][name] == null) {
                        arr[i][name] = arr[i][name];
                    } else {
                        arr[i][name] = arr[i][name].substring(0, 10);
                    }
                }
                return arr;

            }
        }
    })
    //生成序号
    .factory('creatIndex', function () {
        return {
            getIndex: function (arr, name) {
                // var newName = name;
                for (var i = 0; i < arr.length; i++) {
                    arr[i][name] = i + 1;
                }
                return arr;
            }
        }
    })
    //0/1的装换
    .factory('OI', function () {
        return {
            getOI: function (arr, name) {
                if (arr.length > 0) {
                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i][name] == '0') {
                            arr[i].OIname = '否';
                        } else if (arr[i][name] == '1') {
                            arr[i].OIname = '是';
                        } else {
                            arr[i].OIname = '未知';
                        }
                    }
                } else {

                }
                return arr;
            }
        }
    })
    //根据无key的数组返回key数组
    .factory('getKey', function () {
        return {
            getNewKey: function (arr, name) {
                // var keyName = [];
                if (arr.length > 0) {
                    for (var i = 0; i < arr.length; i++) {
                        for (var j = 0; j < arr[i][name].length; j++) {
                            arr[i]['list' + j] = arr[i][name][j];
                        }
                    }
                } else {
                    // keyName[i].name = [];
                }
                return arr;
            }
        }
    })

    //拼接键值对得到字符串
    .factory('getStr', function () {
        return {
            catchStr: function (obj) {
                var temp = '';
                for (var i in obj) {
                    temp += i + ":" + obj[i] + ",";
                }
                temp = temp.substring(0, temp.lastIndexOf(','));
                return temp;
            }
        }
    })
    //提示框方法
    .factory('banner', function ($rootScope) {
        return {
            bannerInit: function () {
                $rootScope.banner = {
                    table: {show: false, warMesShow: false, warMes: null, sucMesShow: false, sucMes: null},
                    modal: {show: false, warMesShow: false, warMes: null, sucMesShow: false, sucMes: null}
                };
            },
            setTableSuc: function (type, mes) {
                switch (type) {
                    case  "add":
                        mes = "新增成功!";
                        break;
                    case  "edit":
                        mes = "编辑成功!";
                        break;
                    case  "delete":
                        mes = "删除成功!";
                        break;
                    case  "select":
                        mes = "查询成功!";
                        break;
                    case  "set":
                        mes = "设置成功!";
                }
                $rootScope.banner = {
                    table: {show: true, warMesShow: false, warMes: null, sucMesShow: true, sucMes: mes},
                    modal: {show: false, warMesShow: false, warMes: null, sucMesShow: false, sucMes: null}
                };
            },
            setTableWar: function (type, mes) {
                switch (type) {
                    case  "add":
                        mes = "新增失败,错误提示："+mes;
                        break;
                    case  "edit":
                        mes = "编辑失败,错误提示："+mes;
                        break;
                    case  "delete":
                        mes = "删除失败,错误提示："+mes;
                        break;
                    case  "select":
                        mes = "查询失败,错误提示："+mes;
                    case  "set":
                        mes = "设置失败,错误提示："+mes;
                        break;
                }
                $rootScope.banner = {
                    table: {show: true, warMesShow: true, warMes: mes, sucMesShow: false, sucMes: null},
                    modal: {show: false, warMesShow: false, warMes: null, sucMesShow: false, sucMes: null}
                };
            },
            setModalSuc: function (type, mes) {
                switch (type) {
                    case  "add":
                        mes = "新增成功!";
                        break;
                    case  "edit":
                        mes = "编辑成功!";
                        break;
                    case  "delete":
                        mes = "删除成功!";
                        break;
                    case  "select":
                        mes = "查询成功!";
                    case  "set":
                        mes = "设置成功!";
                        break;
                }
                $rootScope.banner = {
                    table: {show: false, warMesShow: false, warMes: null, sucMesShow: false, sucMes: mes},
                    modal: {show: true, warMesShow: false, warMes: null, sucMesShow: true, sucMes: mes},
                };
            },
            setModalWar: function (type, mes) {
                switch (type) {
                    case  "add":
                        mes = "新增失败,错误提示："+mes;
                        break;
                    case  "edit":
                        mes = "编辑失败,错误提示："+mes;
                        break;
                    case  "delete":
                        mes = "删除失败,错误提示："+mes;
                        break;
                    case  "select":
                        mes = "查询失败,错误提示："+mes;
                        break;
                    case  "set":
                        mes = "设置失败,错误提示："+mes;
                        break;
                }
                $rootScope.banner = {
                    table: {show: false, warMesShow: false, warMes: null, sucMesShow: false, sucMes: mes},
                    modal: {show: true, warMesShow: true, warMes: mes, sucMesShow: false, sucMes: null},
                };
            },

        }
    })
    //select方法
    .factory('selectfun', function () {
        return {
            //给select添加一个请选择的头
            unshiftdata: function (arr, Admin_Div_Code, Admin_Div_Name) {
                var obj = {};
                obj[Admin_Div_Code] = '';
                obj[Admin_Div_Name] = "请选择";
                if (arr == null)
                    arr = [obj];
                else
                    arr.unshift(obj);
                return arr;
            },
            //根据编号给select赋值
            CheckNode: function (data, codename, id) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i][codename] == id)
                        return data[i]

                }
                return data[0];
            },
            GetBoolVal: function (data) {
                if (data == null)
                    return data;
                if (data)
                    return 'true';
                else
                    return 'false';
            },
            BoolInit: function () {
                return [{Code: false, Name: "否"}, {Code: true, Name: "是"}];
            },
            StatusInit: function () {
                return [{Code: "离职", Name: "离职"}, {Code: "在职", Name: "在职"}];
            },
            SexInit: function () {
                return [{Code: "男", Name: "男"}, {Code: "女", Name: "女"}];
            },
            MarriageInit: function () {
                return [{Code: "未婚", Name: "未婚"}, {Code: "已婚", Name: "已婚"}, {Code: "离异", Name: "离异"}];
            },
            getselectsdata: function (arr, code, name) {
                arr.forEach(function (value, index, array) {
                    array[index].id = value[code];
                    array[index].text = value[name];
                })
                return arr;
            }
        }
    })
    //table方法
    .factory('tablefun', function ($rootScope) {
        return {
            bulidTable: function (columns, data, height) {
                $rootScope.bsTableControl = {
                    options: {
                        columns: columns,
                        data: data,

                        // dataType: "json",
                        // url: 'Json.json',         //请求后台的URL（*）
                        method: 'post',                      //请求方式（*）
                        // toolbar: '.toolbar',                //工具按钮用哪个容器
                        striped: true,                      //是否显示行间隔色
                        cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
                        pagination: true,                   //是否显示分页（*）
                        sortable: false,                     //是否启用排序
                        sortOrder: "asc",                   //排序方式
                        // queryParams: oTableInit.queryParams,//传递参数（*）
                        sidePagination: "client",           //分页方式：client客户端分页，server服务端分页（*）
                        pageNumber: 1,                       //初始化加载第一页，默认第一页
                        pageSize: 10,                       //每页的记录行数（*）
                        pageList: [10, 20, 50, 100],        //可供选择的每页的行数（*）
                        search: false,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
                        strictSearch: false,
                        showColumns: false,                  //是否显示选择显示列的按钮
                        //showRefresh: true,                  //是否显示刷新按钮
                        minimumCountColumns: 3,             //最少允许的列数
                        clickToSelect: false,                //是否启用点击选中行
                        height: height,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
                        uniqueId: "ID",                     //每一行的唯一标识，一般为主键列
                        //showToggle: true,                    //是否显示详细视图和列表视图的切换按钮
                        //cardView: false,                    //是否显示详细视图
                        detailView: false,                   //是否显示父子表
                        fixedColumns: false,                  //固定列
                        // fixedNumber: +$('#fixedNumber').val() //固定列数
                        fixedNumber: 4
                    }

                }
            }
            ,
            GetBoolVal: function (value, row, index) {
                if (value == null) return null;
                if (value) return "是"; else return "否";
            }
            ,

            index: function (value, row, index) {
                return index + 1;
            }
        }
    })
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
    //市县乡三级联动方法
    .factory('CCT', function ($rootScope, http, BlankFactory, selectfun) {
        //监听地市
        $rootScope.$watch('City.selected', function (newValue, oldValue) {
            if (!$rootScope.editstate && newValue != undefined) {
                bindtown();
                if (newValue == "") {
                    bindcounty();
                }
                else {
                    AdministrationInit(newValue, 1);
                }
            }


        })
        //监听县市
        $rootScope.$watch('county.selected', function (newValue, oldValue) {
            if (!$rootScope.editstate && newValue != undefined) {
                if (newValue == "") {
                    bindtown();
                }
                else {
                    AdministrationInit(newValue, 2);
                }
            }

        })
        //清空select
        function clearselect() {
            $rootScope.City.selected = null;
            bindcounty();
            bindtown();
        }

        //绑定地市
        function bindCity(data) {

            $rootScope.City = data;

        }

        //绑定县市
        function bindcounty(data, select) {
            if (data != undefined) {
                $rootScope.county = data;
                $rootScope.county.selected = select;
            } else {
                $rootScope.county = null;
            }
        }

        //绑定乡镇
        function bindtown(data, select) {
            if (data != undefined) {
                $rootScope.town = data;
                $rootScope.town.selected = select;
            } else {
                $rootScope.town = null;
            }


        }

        //请求行政区划
        function AdministrationInit(parentCode, type, select) {
            http.post(BlankFactory.getPostName("AdminDivisions/GetAdminDivisions"), {
                userID: "",
                parentCode: parentCode
            }).then(
                function (data) {
                    if (data.success == true) {
                        switch (type) {
                            case 1:
                                bindcounty(data.message, select);
                                break;
                            case 2:
                                bindtown(data.message, select);
                                break;
                        }
                    }
                    else {
                        switch (type) {
                            case 1:
                                bindcounty();
                                break;
                            case 2:
                                bindtown();
                                break;
                        }

                    }

                }
            )

        }

        return {
            //请求行政区划
            AdministrationInit: function (parentCode, type, select) {
                AdministrationInit(parentCode, type, select)
            },
            //绑定地市
            bindCity: function (data) {
                bindCity(data);
            },
            //清空select
            clearselect: function () {
                clearselect()
            },
            //绑定县市
            bindcounty: function (data, select) {
                bindcounty(data, select);
            },
            //绑定乡镇
            bindtown: function (data, select) {
                bindtown(data, select);
            },
            //获取编辑弹框
            GetAdminSelect: function (select) {
                $rootScope.editstate = true;
                switch (select.length) {
                    case  0:
                        clearselect();
                        break;
                    case  4:
                        $rootScope.City.selected = select;
                        AdministrationInit(select.substring(0, 4), 1);
                        bindtown();
                        break;
                    case  6:
                        $rootScope.City.selected = select.substring(0, 4);
                        AdministrationInit(select.substring(0, 4), 1, select);
                        AdministrationInit(select.substring(0, 6), 2);
                        break;
                    default:
                        $rootScope.City.selected = select.substring(0, 4);
                        AdministrationInit(select.substring(0, 4), 1, select.substring(0, 6));
                        AdministrationInit(select.substring(0, 6), 2, select);

                        break;

                }
                setTimeout(function () {
                    $rootScope.editstate = false;
                }, 1000)

            },
            //请求地市数据
            getcitydata: function () {
                http.post(BlankFactory.getPostName("AdminDivisions/GetAdminDivisions"), {
                    userID: "",
                    parentCode: ''
                }).then(
                    function (data) {
                        if (data.success == true) {
                            bindCity(data.message);
                        }
                        else {
                            bindCity();
                        }
                        bindcounty();
                        bindtown();

                    }
                )
            },
            //获取最小的行政区划Code
            GetMinSelect: function () {
                //获取需要上传的最小行政区划编码
                if ($rootScope.town != null) {
                    if (angular.isString($rootScope.town.selected) && $rootScope.town.selected != "")
                        return $rootScope.town.selected;
                }
                if ($rootScope.county != null) {
                    if (angular.isString($rootScope.county.selected) && $rootScope.county.selected != "")
                        return $rootScope.county.selected;
                }
                if ($rootScope.City != null) {
                    if (angular.isString($rootScope.City.selected))
                        return $rootScope.City.selected;
                }
                return "";

            }
        }
    })
    /**
     * select2 内置查询功能
     */
    .factory('select2Query', function ($timeout) {
        return {
            testAJAX: function () {
                var config = {
                    minimumInputLength: 1,
                    ajax: {
                        url: "http://api.rottentomatoes.com/api/public/v1.0/movies.json",
                        dataType: 'jsonp',
                        data: function (term) {
                            return {
                                q: term,
                                page_limit: 10,
                                apikey: "ju6z9mjyajq2djue3gbvv26t"
                            };
                        },
                        results: function (data, page) {
                            return {results: data.movies};
                        }
                    },
                    formatResult: function (data) {
                        return data.title;
                    },
                    formatSelection: function (data) {
                        return data.title;
                    }
                };

                return config;
            }
        }
    })
    //生成地图表头data
    .factory('getMapData', function () {
        return {
            getThis: function (data) {
                var newData = [];
                if (data) {
                    for (var i = 0; i < data.length; i++) {
                        newData.push({
                            "AreaCode": data[i].Admin_Div_Code,
                            "AreaName": data[i].Admin_Div_Name,
                            "Level": data[i].Level,
                            "parentCode": data[i].Parent_Code
                        });
                    }
                    return newData;
                } else {
                    return data;
                }
            }
        }
    })
    //生成流域地图的表头
    .factory('getRiverData', function () {
        return {
            getThis: function (data) {
                var newData = [];
                if (data) {
                    for (var i = 0; i < data.length; i++) {
                        newData.push({
                            "AreaCode": data[i].Basin_ID,
                            "AreaName": data[i].Basin_Name
                        });
                    }
                    return newData;
                } else {
                    return data;
                }
            }
        }
    })
    .factory('getMapDataSec', function () {
        return {
            getThis: function (data) {
                var newData = [];
                if (data) {
                    for (var i = 1; i < data.length; i++) {
                        newData.push({
                            "AreaCode": data[i].Admin_Div_Code,
                            "AreaName": data[i].Admin_Div_Name,
                            "Level": data[i].Level,
                            "parentCode": data[i].Parent_Code
                        });
                    }
                    return newData;
                } else {
                    return data;
                }
            }
        }

    })
    //生成地图表内容
    .factory('getMapSeries', function () {
        return {
            getThis: function (data) {
                var newData = [];
                if (data) {
                    for (var i = 0; i < data.length; i++) {
                        var jsData = JSON.parse(data[i].Coordinates);
                        //data[i].Coordinates.properties={};
                        // data[i].Coordinates.properties = {"AreaCode":data[i].Admin_Div_Code};
                        newData.push({
                            "type": "Feature",
                            "geometry": jsData,
                            "properties": {
                                "AreaCode": data[i].Admin_Div_Code,
                                "ttCITYNAME": data[i].Admin_Div_Name
                            }
                        })
                        // newData[i].type="Feature";
                        // newData[i].geometry={"type":"Polygon","coordinates":data[i].Coordinates,"properties":data[i].Admin_Div_Code};
                    }
                    return newData;
                } else {
                    return data;
                }
            }
        }
    })
    //生成河流地图表内容
    .factory('getRiverSeries', function () {
        return {
            getThis: function (data) {
                var newData = [];
                if (data) {
                    for (var i = 0; i < data.length; i++) {
                        var jsData = JSON.parse(data[i].Coordinates);
                        newData.push({
                            "type": "Feature",
                            "geometry": jsData,
                            "properties": {
                                "AreaCode": data[i].Basin_ID,
                                "ttCITYNAME": data[i].Basin_Name
                            }
                        })
                        // newData[i].type="Feature";
                        // newData[i].geometry={"type":"Polygon","coordinates":data[i].Coordinates,"properties":data[i].Admin_Div_Code};
                    }
                    return newData;
                } else {
                    return data;
                }
            }
        }
    })
    .factory('getMapSerieSec', function () {
        return {
            getThis: function (data) {
                var newData = [];
                if (data) {
                    for (var i = 1; i < data.length; i++) {
                        var jsData = JSON.parse(data[i].Coordinates);
                        //data[i].Coordinates.properties={};
                        // data[i].Coordinates.properties = {"AreaCode":data[i].Admin_Div_Code};
                        newData.push({
                            "type": "Feature",
                            "geometry": jsData,
                            "properties": {
                                "AreaCode": data[i].Admin_Div_Code,
                                "ttCITYNAME": data[i].Admin_Div_Name
                            }
                        })
                        // newData[i].type="Feature";
                        // newData[i].geometry={"type":"Polygon","coordinates":data[i].Coordinates,"properties":data[i].Admin_Div_Code};
                    }
                    return newData;
                } else {
                    return data;
                }
            }
        }
    })
    //二次组装地图表头
    .factory('secMapData', function () {
        return {
            getThis: function (oldData, newData, name1, name2, name3) {
                if (oldData && newData) {
                    // oldData生成的行政区域  newData是该行政区域绑定的数据
                    for (var i = 0; i < oldData.length; i++) {
                        oldData[i][name1] = newData[i][name1];
                        oldData[i][name2] = newData[i][name2];
                        oldData[i][name3] = newData[i][name3];
                        if(newData[i][name1]=='0'){
                            oldData[i].value='0';
                        }else{
                            var x=(newData[i][name2])/(newData[i][name1]);
                            if(x=='0'){
                                oldData[i].value='0';
                            }else{
                                oldData[i].value=(Math.round(x* 10000)/100).toFixed(1);
                            }
                        }
                    }
                    return oldData;
                } else {
                    return oldData;
                }
            }
        }
    })
    .factory('secMapData3', function () {
        return {
            getThis: function (oldData, newData, name1, name2, name3) {
                if (oldData && newData) {
                    // oldData生成的行政区域  newData是该行政区域绑定的数据
                    for (var i = 0; i < oldData.length; i++) {
                        oldData[i][name1] = newData[i][name1];
                        oldData[i][name2] = newData[i][name2];
                        oldData[i][name3] = newData[i][name3];
                        if(newData[i][name1]=='0'){
                            oldData[i].value=0;
                        }else{
                            var x=(newData[i][name1]-newData[i][name2])/(newData[i][name1]);
                            if(x=='0'){
                                oldData[i].value='0';
                            }else{
                                oldData[i].value=(Math.round(x* 10000)/100).toFixed(1);
                            }
                        }
                    }
                    return oldData;
                } else {
                    return oldData;
                }
            }
        }
    })
    //
    //县级行政区
    .factory('secMapDataElse', function () {
        return {
            getThis: function (oldData, newData, name1, name2, name3) {
                if (oldData && newData) {
                    // oldData生成的行政区域  newData是该行政区域绑定的数据
                    for (var i = 0; i < oldData.length; i++) {
                        oldData[i][name1] = newData[i + 1][name1];
                        oldData[i][name2] = newData[i + 1][name2];
                        oldData[i][name3] = newData[i + 1][name3];
                    }
                    return oldData;
                } else {
                    return oldData;
                }
            }
        }
    })
//百分比转化
    .factory('setPer', function () {
        return {
            getThis: function (data1,data2) {
                if(data1=='0'){
                    return '0';
                }else{
                    var x=data2/data1;
                    per=(Math.round(x* 10000)/100).toFixed(1);
                    return per;
                }
            }
        }
    })
//根据行政编码查行政名称
  .factory('getXZQ',function () {
    return{
        getThis: function (code) {
            if(code=='33'){
                return '浙江省';
            }else{
                switch (code){
                    case '3301':
                        var name='杭州市';
                        break;
                    case '3302':
                        var name='宁波市';
                        break;
                    case '3303':
                        var name='温州市';
                        break;
                    case '3304':
                        var name='嘉兴市';
                        break;
                    case '3305':
                        var name='湖州市';
                        break;
                    case '3306':
                        var name='绍兴市';
                        break;
                    case '3307':
                        var name='金华市';
                        break;
                    case '3308':
                        var name='衢州市';
                        break;
                    case '3309':
                        var name='舟山市';
                        break;
                    case '3301':
                        var name='杭州市';
                        break;
                    case '3310':
                        var name='台州市';
                        break;
                    case '3311':
                        var name='丽水市';
                        break;
                }
                    return name;

            }
        }
    }
})