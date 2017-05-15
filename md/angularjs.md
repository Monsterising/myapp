

#### 1、表单控制
    <form name="FormName">
    ng-disabled="FormName.$invalid"
    </form>
#### 2、监听
    $scope.$watch('search', function (newValue, oldValue) {})
#### 3、$http
    post: function (myUrl, data) {
        return $http({
            url: myUrl,
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: data
        }).then(function (data) {
            return data.data;
        });
    },
    get: function (myUrl) {
        return $http({
            url: myUrl,
            method: "GET",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (data) {
            return data.data;
        });
    },
    jsonp: function (myUrl) {
        return $http.jsonp(myUrl).then(function (data) {
            // 把数据存到server中并返回                
            return data.data;
        })
    }
#### 4、config
    app.config(function ($httpProvider) {
        $httpProvider.defaults.transformRequest = function (obj) {
            var str = [];
            for (var p in obj) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
            return str.join("&");
        }
    });

#### 5、分页
    //初始化
    $scope.page_pos = {
        "pageSize": 4, "pageNo": 1
    };
    //分页
    <tr ng-repeat="item in PostList|filter:Search_PostList|range:page_pos.pageNo:page_pos.pageSize">
    //过滤器
    .filter("range", function ($filter) {
    return function (data, page, size) {
        if (angular.isArray(data) && angular.isNumber(page) && angular.isNumber(size)) {
                var start_index = (page - 1) * size;
                if (data.length < start_index) {
                    return [];
                } else {
                    return $filter("limitTo")(data.slice(start_index), size);
                }
            } else {
                return data;
            }
        }
    })   
    //分页控件
    <uib-pagination boundary-links="true" total-items="(PostList|filter:Search_PostList).length" ng-model="page_pos.pageNo" max-size="5" previous-text="<" next-text=">" first-text="<<" last-text=">>" class="pagination-sm" boundary-link-numbers="true" items-per-page="page_pos.pageSize">


#### 6、repeatdone
    .directive('repeatDone', function () {
        return {
            link: function (scope, element, attrs) {
                if (scope.$last) {                   // 这个判断意味着最后一个 OK
                    scope.$eval(attrs.repeatDone)    // 执行绑定的表达式
                }
            }
        }
    })
#### 7、ordery
    orderBy:["Admin_Div_Code" ,"station_code"]
#### 12、filter
    $scope.time = $filter('date')(btime, "yyyy-MM-dd HH:00");
    fliter：{count:12}
    range:page_pos.pageNo:page_pos.pageSize


#### 8、$$phase
    if (!$scope.$$phase)
        $scope.$apply(function () {})
#### 9、$q
    angular.module('webapp')
      .service("NewsService", ["$http", "$q", NewsService]);
    
    
    function NewsService($http, $q) {
      function handleRequest(method, url, data) {
        var defered = $q.defer();
        var config = {
          method: method,
          url: url
        };
    
        if("POST" === method) {
          config.data = data
        } else if('GET' === method) {
          config.params = data;
        }
    
        $http(config).then(function(data){
          defered.resolve(data);
        });
        // .error(function(err){
        //   defered.reject(err);
        // });
    
        return defered.promise;
      }
      return {
        list: function(params){
          return handleRequest('GET', '/news', params);
        },
        save: function(data){
          return handleRequest('POST', '/news', data);
        },
        detail: function(id){
          return handleRequest('GET', '/news/' + id);
        },
          types: function(params){
              return handleRequest('GET', '/types', params);
          },
          areas: function(params){
              return handleRequest('GET', '/areas', params);
          }
      }
    }
    //调用
    NewsService.list(req).then(
      function(data){
      },
      function(err){}
    );
#### 10、$window
    .factory('locals', ['$window', function ($window) {
    return {        //存储单个属性
        set: function (key, value) {
            $window.localStorage[key] = value;
        },        //读取单个属性
        get: function (key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },        //存储对象，以JSON格式存储
        setObject: function (key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },        //读取对象
        getObject: function (key) {
            return JSON.parse($window.localStorage[key] || '{}');
        }

    }
    }])
#### 11、百分比转化
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
#### 12、市县乡三级联动方法
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
#### 13、提示框方法
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
#### 14、select方法
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
#### 15、table方法
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
#### 16、日期处理方法
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
#### 17、把请求数据拆解成数组（获取文件）
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
#### 18、生成文件绑定数组
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
#### 19、按日期排序
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
#### 20、根据无key的数组返回key数组
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

#### 21、拼接键值对得到字符串
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
#### 22、枚举过滤器
    .filter('Sytemkeyfilter', function ($filter) {
        return function (data, items,key,name) {
            if (items != undefined) {
                for (var i = 0; i < items.length; i++) {
                    if (items[i][key] == data)
                        return items[i][name];
                }
            }
            return "";
        }
    })