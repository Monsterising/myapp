"use strict";

var webapp = angular.module('myApp',[]);
//table方法;
webapp.factory('tablefun', function ($rootScope) {
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
});
webapp.factory('http', function ($http) {
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
});
webapp.factory('BlankFactory', function () {
        var commonUrl = "http://115.236.2.246:52006/api/";
        return {
            //post请求
            getPostName: function (name) {
                return commonUrl + name;
            }
        }
    });
webapp.controller('AppCtrl', function ($scope,BlankFactory) {

    //点击查看详情
    function showControl(value, row, index) {
        return '<a class="fa fa-eye icon_step text-success-dker" onclick="window.open(&apos;' + row.Url + '&apos;)" >122</a>'
    }
    //获取时间
    function showCreateTime(value, row, index) {
        return moment(row.createTime).fromNow();
    }
    //获取标题
    function showTitle(value, row, index) {
        if (row.Title.length > 60)
            return "<a title='" + row.Title + "'>" + row.Title.substring(0, 60) + "..." + "<a>";
        else
            return "<a title='" + row.Title + "'>" + row.Title + "<a>";

    }
    $scope.siteTableInit = function() {
        $("#siteList").bootstrapTable({
            columns: [{ title: '序号', formatter: function (value, row, index) { return index + 1; } },
                { title: '最新招标信息', formatter: showTitle, align: 'left' },
                { title: '地区', field: 'type' },
                { title: '类型', field: 'area' },
                { title: '发布时间', formatter: showCreateTime },
                { title: '123', formatter: showControl }

            ],
            contentType: "application/x-www-form-urlencoded",
            dataType: "json",
            url:BlankFactory.getPostName( 'Bidding/GetBiddingPageList'),         //请求后台的URL（*）
            method: 'POST',                      //请求方式（*）
            // toolbar: '.toolbar',                //工具按钮用哪个容器
            striped: true,                      //是否显示行间隔色
            cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            pagination: true,                   //是否显示分页（*）
            sortable: false,                     //是否启用排序
            sortOrder: "desc",                   //排序方式
            queryParams: function queryParams(params) {


                return {

                    Start_Time: '2017-05-06',
                    End_Time: '2017-05-14',
                    Title: '' ,
                    source: '杭州市政府采购网',
                    area: '',
                    Category:'',
                    PageSize: params.limit,
                    RowStart: params.offset
                }
            },//传递参数（*）
            sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
            pageNumber: 1,                       //初始化加载第一页，默认第一页
            pageSize: 10,                       //每页的记录行数（*）
            pageList: [10, 20, 50, 100],        //可供选择的每页的行数（*）
            search: false,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
            strictSearch: false,
            showColumns: false,                  //是否显示选择显示列的按钮
            //showRefresh: true,                  //是否显示刷新按钮
            minimumCountColumns: 3,             //最少允许的列数
            clickToSelect: false,                //是否启用点击选中行
            // height: 384,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
            uniqueId: "ID",                     //每一行的唯一标识，一般为主键列
            //showToggle: true,                    //是否显示详细视图和列表视图的切换按钮
            //cardView: false,                    //是否显示详细视图
            detailView: false,                   //是否显示父子表
            fixedColumns: false,                  //固定列
            // fixedNumber: +$('#fixedNumber').val() //固定列数
            fixedNumber: 4,
        });
    };
    //调用方法要在方法声明之后
    $scope.siteTableInit();

    $scope.siteTableInit1 = function() {
        $("#siteList1").bootstrapTable({
            columns: [{ title: '序号', formatter: function (value, row, index) { return index + 1; } },
                { title: '最新招标信息', formatter: showTitle, align: 'left' },
                { title: '地区', field: 'type' },
                { title: '类型', field: 'area' },
                { title: '发布时间', formatter: showCreateTime },
                { title: '123', formatter: showControl }

            ],
            contentType: "application/x-www-form-urlencoded",
            dataType: "json",
            url:BlankFactory.getPostName( 'Weather/GetNewWeatherList'),         //请求后台的URL（*）
            method: 'POST',                      //请求方式（*）
            // toolbar: '.toolbar',                //工具按钮用哪个容器
            striped: true,                      //是否显示行间隔色
            cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            pagination: true,                   //是否显示分页（*）
            sortable: false,                     //是否启用排序
            sortOrder: "desc",                   //排序方式
            queryParams: function queryParams(params) {


                return {

                    CityCode: '331121'

                }
            },//传递参数（*）
            sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
            pageNumber: 1,                       //初始化加载第一页，默认第一页
            pageSize: 10,                       //每页的记录行数（*）
            pageList: [10, 20, 50, 100],        //可供选择的每页的行数（*）
            search: false,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
            strictSearch: false,
            showColumns: false,                  //是否显示选择显示列的按钮
            //showRefresh: true,                  //是否显示刷新按钮
            minimumCountColumns: 3,             //最少允许的列数
            clickToSelect: false,                //是否启用点击选中行
            // height: 384,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
            uniqueId: "ID",                     //每一行的唯一标识，一般为主键列
            //showToggle: true,                    //是否显示详细视图和列表视图的切换按钮
            //cardView: false,                    //是否显示详细视图
            detailView: false,                   //是否显示父子表
            fixedColumns: false,                  //固定列
            // fixedNumber: +$('#fixedNumber').val() //固定列数
            fixedNumber: 4,
        });
    };
    //调用方法要在方法声明之后
    $scope.siteTableInit1();
});
