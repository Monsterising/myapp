#### 1、ajax
    $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        data：{},
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        success: function (data) { }

    })
#### 2、时间选择框
    //JQuery：
    $(function () {
            $('#FromDate').datetimepicker({
                language: 'zh-CN',
                autoclose: true,
                startView: 2,
                maxView: 'year',
                minView: 'month',
                timepicker: false,
                viewSelect: 'decade'
            });
    });
     
    //HTML
    <div class="input-group date" id="FromDate" style="float:left;width:45%;" data-date-format="yyyy-mm-dd">
                <span class="input-group-addon">时间</span>
                <input type="text" class="form-control" size="13" placeholder="" ng-model="contents.starttime">
                <div class="input-group-addon">
                <span class="glyphicon glyphicon-calendar"></span>
                 </div>
    </div>
#### 3、bootstripttable
    function initMyList() {
    $('#table').bootstrapTable('destroy').bootstrapTable({
        method: 'post',
        url: "/DataHandler/Backlog/Backlog.ashx",
        dataType: "json",
        pagination: true,
        pageSize: 10,
        pageNumber: 1,
        queryParamsType: "normal",
        queryParams: queryParams,
        sidePagination: "server",
        contentType: "application/x-www-form-urlencoded",
        columns: [
            { field: 'ProcessName', title: '流程名称' },
            { field: 'AppName', title: '实例名称' },
            { field: 'CreatedDateTime', title: '创建时间', formatter: timeFormatter },
            { field: 'ProcessState', title: '运行状态', formatter: processFormatter },
            { field: 'CurrentActivityText', title: '当前步骤' },
            {
                field: 'op', title: '操作', formatter: function (value, row, index) {
                    return '<a href="#" onclick="showFlowDetail(\'' + row["AppInstanceID"] + '\')">流程信息</a>&nbsp;|&nbsp;<a href="#" onclick="showFlowCanvas(\'' + row["ProcessGUID"] + '\',\'' + row["AppInstanceID"] + '\',\'' + row["Version"] + '\')">流程步骤</a>';
                }
            }
        ]
    });
    }
#### 4、轮播图
       <!--图片滚动-->
        <div class="ban" id="demo1">
            <div class="ban2" id="ban_pic1">
                <div class="prev1" id="prev1">
                    <i class="fa fa-angle-left ban_left" aria-hidden="true"></i>
                </div>
                <div class="next1" id="next1">
                    <i class="fa fa-angle-right ban_right" aria-hidden="true"></i>
                </div>
                <ul id="ul1">
                   
                </ul>
            </div>
        </div>

     for (var i = 0; i < data.message.length; i++) {
                        $("#ul1").append('<li name="picli"><a href="javascript:;"><img src="' + data.message[i].fileUrl + '" width="860" height="400" /> </a></li>');
                    }
    jq(function () {
        jq('#demo1').banqh({
            box: "#demo1",//总框架
            pic: "#ban_pic1",//大图框架
            pnum: "#ban_num1",//小图框架
            prev_btn: "#prev_btn1",//小图左箭头
            next_btn: "#next_btn1",//小图右箭头
            pop_prev: "#prev2",//弹出框左箭头
            pop_next: "#next2",//弹出框右箭头
            prev: "#prev1",//大图左箭头
            next: "#next1",//大图右箭头
            pop_div: "#demo2",//弹出框框架
            pop_pic: "#ban_pic2",//弹出框图片框架
            pop_xx: ".pop_up_xx",//关闭弹出框按钮
            mhc: ".mhc",//朦灰层
            autoplay: true,//是否自动播放
            interTime: 3000,//图片自动切换间隔
            delayTime: 400,//切换一张图片时间
            pop_delayTime: 400,//弹出框切换一张图片时间
            order: 0,//当前显示的图片（从0开始）
            picdire: true,//大图滚动方向（true为水平方向滚动）
            mindire: true,//小图滚动方向（true为水平方向滚动）
            min_picnum: 6,//小图显示数量
            pop_up: true//大图是否有弹出框
        })
    })  	
