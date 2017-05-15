'use strict';


var app=angular.module('app', [


    'bsTable'

]);
app.config(function ($httpProvider) {

    $httpProvider.defaults.transformRequest = function (obj) {
        var str = [];
        for (var p in obj) {

            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));

        }
        return str.join("&");
    }
});
app.controller('ControlTemplatePageCtrl', function ($scope, $window, $timeout, selectfun, CCT) {
    //以下为tab切换时请求数据示例~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    $scope.$emit("basic", '0');
    //select示例
    $scope.exampleLists = [{name: '全部', id: '01'}, {name: '选项一', id: '02'}, {name: '选项二', id: '03'}];

    $scope.exampleLists.selected = $scope.exampleLists[0];

    //单选选中
    $scope.Listcode = '02';
    //多选事例
    var mulListsdata = [{name: '全部', code: '01'}, {name: '选项一', code: '02'}, {name: '选项二', code: '03'}];
    $scope.mulLists = {
        //data默认为id，text键值对，如果不是则需要转换
        data: selectfun.getselectsdata(mulListsdata, 'code', 'name'),
    };
    $scope.Listcodes = [{text: '全部', id: '01'}, {text: '选项一', id: '02'}]
    //行政区划初始化
    CCT.getcitydata();
    //根据最小行政编码进行绑定数据
    $scope.bindCCT = function () {
        if ($scope.CCTCode != null)
            CCT.GetAdminSelect($scope.CCTCode);
    }
    //获取最小行政编码
    $scope.getCCT = function () {
        $scope.CCTCode = CCT.GetMinSelect();
    }
    //清空行政区划下拉框
    $scope.clearCCT=function () {
        CCT.clearselect();
    }
    //数据示例
    $scope.lists = [{listClass: 'active', name: '支出统计', liShow: true, detail: '第一个容器', id: 'p1'}, {
        listClass: '',
        name: '外托支出',
        liShow: false,
        detail: '第二个容器',
        id: 'p2'
    }, {listClass: '', name: '差旅支出', liShow: false, detail: '第三个容器', id: 'p3'}];
    //tab标签的点击事件,可以根据当前ID再去请求，写几个假数据先示例一下
    var columns = [{field: 'field0', title: '项目名称', align: 'left'}, {field: 'field1', title: '项目名称', align: 'left'},
        {field: 'field2', title: '操作栏', formatter: linkFor, align: 'left'}];
    var data =  [ {field0: '海塘一期', field1: '海塘一期', field2: 'url', field3: 'label-success', field4: 'button'},
        {field0: '海塘二期', field1: '海塘二期', field2: 'url', field3: 'label-warning', field4: 'button'},
        {field0: '海塘三期', field1: '海塘三期', field2: 'url', field3: 'label-success', field4: 'button'}]
    bulidTable(columns, data);
    $scope.chooseLi = function (id) {

        for (var i = 0; i < $scope.lists.length; i++) {
            $scope.lists[i].listClass = '';
            if ($scope.lists[i].id == id) {
                $scope.lists[i].listClass = 'active';
            } else {
                $scope.lists[i].listClass = '';
            }
        }

        //给生成表格传递参数，做一个筛选
        switch (id) {
            case 'p1':
                var columns = [{field: 'field0', title: '项目名称', align: 'left'},
                    {field: 'field1', title: '项目名称', align: 'left'},
                    {field: 'field2', title: '跳转操作', formatter: linkFor, align: 'left'}];
                var data = [ {field0: '海塘一期', field1: '海塘一期', field2: 'url', field3: 'label-success', field4: 'button'},
                    {field0: '海塘二期', field1: '海塘二期', field2: 'url', field3: 'label-warning', field4: 'button'},
                    {field0: '海塘三期', field1: '海塘三期', field2: 'url', field3: 'label-success', field4: 'button'}]
                break;
            case 'p2':
                var columns = [{field: 'field0', title: '第二个', align: 'left', formatter: showHow3},
                    {field: 'field1', title: '第二个', align: 'left', formatter: showHow2},
                    {field: 'field2', title: '第二个', formatter: showHow, align: 'left'}];
                var data = [ {field0: '海塘一期', field1: '海塘一期', field2: 'url', field3: 'label-success', field4: 'button'},
                    {field0: '海塘二期', field1: '海塘二期', field2: 'url', field3: 'label-warning', field4: 'button'},
                    {field0: '海塘三期', field1: '海塘三期', field2: 'url', field3: 'label-success', field4: 'button'}]
                break;
            case 'p3':
                var columns = [{field: 'field0', title: '第三个', align: 'left'},
                    {field: 'field1', title: '第三个', align: 'left'},
                    {field: 'field2', title: '第三个', formatter: stepSref, align: 'left'}];
                var data = [ {field0: '海塘一期', field1: '海塘一期', field2: 'url', field3: 'label-success', field4: 'button'},
                    {field0: '海塘二期', field1: '海塘二期', field2: 'url', field3: 'label-warning', field4: 'button'},
                    {field0: '海塘三期', field1: '海塘三期', field2: 'url', field3: 'label-success', field4: 'button'}]
                break;
            default:
                var columns = [];
                var data = [];
        }
        bulidTable(columns, data);
    }
    //表格生成的方法封装
    function bulidTable(columns, data) {
        $scope.bsTableControl = {
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
                // height: 433,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
                uniqueId: "ID",                     //每一行的唯一标识，一般为主键列
                //showToggle: true,                    //是否显示详细视图和列表视图的切换按钮
                //cardView: false,                    //是否显示详细视图
                detailView: false,                   //是否显示父子表
                fixedColumns: false,                  //固定列
                // fixedNumber: +$('#fixedNumber').val() //固定列数
                fixedNumber: 4
            }

        };
    }

    function linkFor(value, row, index) {
        console.log(row);
        if (value == undefined || value == null) {
            return "--";
        } else {
            return '<a class="fa fa-eye icon_step text-success-dker" ng-click="$parent.EditBtn(&apos;' + row.field0 + '&apos;)"></a><a class="fa fa-pencil-square-o dc_edit_icon icon_step"></a><a class="fa fa-trash-o dc_del_icon icon_step"></a>'
        }
    };
    $scope.EditBtn=function (id) {
        alert(id);
    }
    function showHow(value, row, index) {
        return '<label class="label label-success">已完成<label/>';
    }

    function showHow2(value, row, index) {
        return '<label class="label label-warning">已完成<label/>';
    }

    function showHow3(value, row, index) {
        return '<label class="label label-default">未知<label/>';
    }

    function stepSref(value, row, index) {
        return '<a class="text text-custom"><strong>管理</strong></a>';
    }

    //加载完成
    $scope.load = function () {
        bulidTimePicker('#SDate');
        bulidTimePicker('#ADate');
        bulidTimePicker('#BDate');
        bulidTimePicker('#CDate');
        bulidTimePicker('#DDate');
        bulidTimePicker('#FromDate');
    }
    //时间选择器封装
    function bulidTimePicker(name) {
        $(name).datetimepicker({
            language: 'zh-CN',
            autoclose: true,
            startView: 4,
            maxView: 'year',
            minView: 'month',
            viewSelect: 'decade',
            todayBtn: 'true'
        });
    }

    $scope.items = [{title: "三个月", lineClass: ""}, {title: "两个月", lineClass: ""}, {
        title: "一个月",
        lineClass: ""
    }, {title: "更多", lineClass: "timeTransparent"}];
    $scope.items[0].class = 'time_active';
    $scope.lineShow = true;
    $scope.timeShow = false;
    // $scope.doIt = function () {
    //     $('.dc_timeRoll').last().find('.dc_timeline').addClass('timeTransparent');
    // };
    //点击圆圈时
    $scope.move = function (item, $event) {
        for (var i = 0; i < $scope.items.length; i++) {
            $scope.items[i].class = '';
        }
        //alert($event.target);
        if (item.title == "更多") {
            $scope.lineShow = false;
            $scope.timeShow = true;

        } else {

        }
        item.class = 'time_active';
        console.log(item);
    }
    //点击文字
    $scope.titleMove = function (item, $event) {
        for (var i = 0; i < $scope.items.length; i++) {
            $scope.items[i].class = '';
        }
        //alert($event.target);
        if (item.title == "更多") {
            $scope.lineShow = false;
            $scope.timeShow = true;

        }
        item.class = 'time_active';
    }
    //点击返回、确定按钮
    $scope.back = function () {
        $scope.lineShow = true;
        $scope.timeShow = false;
    }
    $scope.sure = function () {
        $scope.lineShow = true;
        $scope.timeShow = false;
    }
    // 树形控件内容
    $scope.clean_search = function () {
        $scope.treeSearch = '';
        bulidTree('treeDemo', 'key');
    }
    $scope.clean_search1 = function () {
        $scope.treeSearch1 = '';
        bulidTree('treeDemo1', 'key1');
    }
    bulidTree('treeDemo', 'key');
    bulidTree('treeDemo1', 'key1');


    function bulidTree(id, keyId) {
        var setting = {
            data: {
                key: {
                    title: "t"
                },
                simpleData: {
                    enable: true
                }
            },
            view: {
                fontCss: getFontCss
            },
            check: {
                enable: true,
                // chkStyle: "radio",
                // radioType: "all"
            },
            callback: {
                onCheck: zTreeOnCheck,
                onClick: function (e, treeId, treeNode) {
                    zTree.checkNode(treeNode, !treeNode.checked, true);
                }
            }
        };

        var zNodes = [
            {id: 1, pId: 0, name: "节点搜索演示 1", t: "id=1"},
            {id: 11, pId: 1, name: "关键字可以是名字", t: "id=11"},
            {id: 12, pId: 1, name: "关键字可以是level", t: "id=12"},
            {id: 13, pId: 1, name: "关键字可以是id", t: "id=13"},
            {id: 14, pId: 1, name: "关键字可以是各种属性", t: "id=14"},
            {id: 2, pId: 0, name: "节点搜索演示 2", t: "id=2", open: true},
            {id: 21, pId: 2, name: "可以只搜索一个节点", t: "id=21"},
            {id: 22, pId: 2, name: "可以搜索节点集合", t: "id=22"},
            {id: 23, pId: 2, name: "搜我吧", t: "id=23"},
            {id: 3, pId: 0, name: "节点搜索演示 3", t: "id=3", open: true},
            {id: 31, pId: 3, name: "我的 id 是: 31", t: "id=31"},
            {id: 32, pId: 31, name: "我的 id 是: 32", t: "id=32"},
            {id: 33, pId: 32, name: "我的 id 是: 33", t: "id=33"}
        ];
        var zTree = $.fn.zTree.init($('#' + id), setting, zNodes);

        function focusKey(e) {
            if (key.hasClass("empty")) {
                key.removeClass("empty");
            }
        }

        function blurKey(e) {
            if (key.get(0).value === "") {
                key.addClass("empty");
            }
        }

        var lastValue = "", nodeList = [], fontCss = {};

        function clickRadio(e) {
            lastValue = "";
            searchNode(e);
        }

        function zTreeOnCheck(event, treeId, treeNode) {
            // alert(treeNode.tId + ", " + treeNode.name);
        };
        function searchNode(e) {
            var zTree = $.fn.zTree.getZTreeObj(id);
            zTree.expandAll(true);
            if (!$("#getNodesByFilter").attr("checked")) {
                var value = $.trim(key.get(0).value);
                //可以定义搜索参数
                var keyType = "name";
                if (key.hasClass("empty")) {
                    value = "";
                }
                if (lastValue === value) return;
                lastValue = value;
                if (value === "") return;
                updateNodes(false);

                if ($("#getNodeByParam").attr("checked")) {
                    var node = zTree.getNodeByParam(keyType, value);
                    if (node === null) {
                        nodeList = [];
                    } else {
                        nodeList = [node];
                    }
                } else if ($("#getNodesByParam").attr("checked")) {
                    nodeList = zTree.getNodesByParam(keyType, value);
                } else if ($("#getNodesByParamFuzzy").attr("checked")) {
                    nodeList = zTree.getNodesByParamFuzzy(keyType, value);
                }
            } else {
                updateNodes(false);
                nodeList = zTree.getNodesByFilter(filter);
            }
            nodeList = zTree.getNodesByParamFuzzy(keyType, value);
            updateNodes(true);

        }

        function updateNodes(highlight) {
            var zTree = $.fn.zTree.getZTreeObj(id);
            for (var i = 0, l = nodeList.length; i < l; i++) {
                nodeList[i].highlight = highlight;
                zTree.updateNode(nodeList[i]);
            }
        }

        function getFontCss(treeId, treeNode) {
            return (!!treeNode.highlight) ? {color: "#A60000", "font-weight": "bold"} : {
                color: "#333",
                "font-weight": "normal"
            };
        }

        function filter(node) {
            return !node.isParent && node.isFirstNode;
        }

        var key;
        $(document).ready(function () {
            $.fn.zTree.init($('#' + id), setting, zNodes);
            key = $('#' + keyId);
            key.bind("focus", focusKey)
                .bind("blur", blurKey)
                .bind("propertychange", searchNode)
                .bind("input", searchNode);
            //$("#name").bind("change", clickRadio);
            //$("#level").bind("change", clickRadio);
            //$("#id").bind("change", clickRadio);
            //$("#getNodeByParam").bind("change", clickRadio);
            //$("#getNodesByParam").bind("change", clickRadio);
            //$("#getNodesByParamFuzzy").bind("change", clickRadio);
            //$("#getNodesByFilter").bind("change", clickRadio);
        });
    }
});