#### js
    $scope.userId = locals.get("userId", "");
    var Today = moment().format('L');
    //获取当前年份月份
    $scope.ThisYear = moment().format('YYYY');
    $scope.ThisMonth = moment().format('M');
    //获取事务列表
    http.post(BlankFactory.getPump(), { 't': 'GetDispatchSituation_Affairs', 'Category_Code': '45F876D7-D641-4CDD-BEBF-069CA6D49D26', 'tokenValue': '' }).then(function (data) {
        $scope.TrItems = data[0].message;
        $scope.Affair_ID = $scope.TrItems[0].Affair_ID;
       
        init()
    })
  
    function getdate(Today) {
        if ($scope.year == parseInt(moment(Today).format('YYYY')) || $scope.year == undefined) {
            $scope.year = parseInt(moment(Today).format('YYYY'));
            var month = parseInt(moment(Today).format('M'));
            $scope.time = { prevYear: $scope.year - 1, nowYear: $scope.year, nextYear: $scope.year + 1, prevMonth: month - 1 == 0 ? 12 : month - 1, nowMonth: month, nextMonth: month + 1 == 13 ? 1 : month + 1 };
            var Week = moment($scope.year + '-' + month + '-1').format('dddd');
            getWeek(Week)
        } else {
            $scope.year = parseInt(moment(Today).format('YYYY'));
        }
          
       
    }
   
    $scope.goPrevYear = function () {
        Today = moment(Today).add(-1, 'years').format('L');
        getdate(Today);
    }
    $scope.goNextYear = function () {
        Today = moment(Today).add(1, 'years').format('L');
        getdate(Today);
    }
    $scope.goPrevMonth = function () {
        Today = moment(Today).add(-1, 'months').format('L');
        getdate(Today);
    }
    $scope.goNextMonth = function () {
        Today = moment(Today).add(1, 'months').format('L');
        getdate(Today);
    }
    $scope.viewtitle = function (title) {
        ionicale.ale(title);
    }
    function getWeek(Week) {
        switch (Week) {
            case "星期日":
                calendar(0);
                break;
            case "星期一":
                calendar(1);
                break;
            case "星期二":
                calendar(2);
                break;
            case "星期三":
                calendar(3);
                break;
            case "星期四":
                calendar(4);
                break;
            case "星期五":
                calendar(5);
                break;
            case "星期六":
                calendar(6);
                break;

        }
    }
    $scope.$watch('year', function (newValue, oldValue) {
        if(oldValue!=undefined)
        init();
    })
    $scope.changeselect = function (id) {
        $scope.Affair_ID = id;
        init();
    }
   
    function calendar(p) {
        var num = 1;
        var date = 1 - p;
        $scope.result = [];
        var year = parseInt(moment(Today).format('YYYY'));
        var month = parseInt(moment(Today).format('M'));
        var totl = (moment(Today, "YYYY-MM").daysInMonth() + num);
        var count = parseInt((moment(Today, "YYYY-MM").daysInMonth()+p) / 7);
        var last = (moment(Today, "YYYY-MM").daysInMonth()) % 7;
        for (var i = 0; i < count + 1  ; i++) {
            $scope.result[i] = [];
            for (var j = 0; j < 7; j++) {
                if (date <= 0 || date >= totl) {
                    $scope.result[i].push({ key: '', className: '' });
                } else {

                   
                        if ($scope.results[moment(year + '-' + month + '-' + date).format('L')] == undefined) {

                            $scope.result[i].push({ key: date.toString(), className: '', title: '' });
                        }


                        else {
                            if ($scope.results[moment(year + '-' + month + '-' + date).format('L')].indexOf('已巡查') != -1)
                                $scope.result[i].push({ key: date.toString(), className: 'greencirle', title: $scope.results[moment(year + '-' + month + '-' + date).format('L')] });
                            else
                                $scope.result[i].push({ key: date.toString(), className: 'yellowcirle', title: $scope.results[moment(year + '-' + month + '-' + date).format('L')] });
                        }
                   
                   
                }
                date++;
            }
        }
     
    }
   
   
    function init() {
        http.post(BlankFactory.getFlo(), { 't': 'GetMonthPatrolInfos', affairID: $scope.Affair_ID, StartMonth: Today }).then(function (data) {
            if (data[0].success == "true") {
                $scope.GetToDoSteps = data[0].message;
                $scope.results = {}
                for (var i = 0; i < $scope.GetToDoSteps.length; i++) {
                    $scope.results[$scope.GetToDoSteps[i].start.substring(0, 10)] = "状态：" + $scope.GetToDoSteps[i].title + "，巡查员：" + ($scope.GetToDoSteps[i].True_Name == null ? '--' : $scope.GetToDoSteps[i].True_Name);
                }
            } else {
                $scope.results = {}
            }
           
            getdate(Today);
        })
    } 

#### html
       <div class="dc_time_api" style="padding-right:10px;margin-right:10px">
                <table class="table">
                    <tr>
                        <td class="noClick" colspan="2">{{time.prevYear}}</td>
                        <td class="noBorder" ><button ng-click="goPrevYear()" ng-disabled="time.nowYear<=2014" style="border:none;background-color:#f5f5f5"><i class="icon ion-arrow-left-b" ng-class="time.nowYear<=2014?'divdisaple':'divactive' " aria-hidden="true"></i></button></td>
                        <td class="noClick nowYear" colspan="10">{{time.nowYear}}</td>
                        <td class="noBorder"><button ng-click="goNextYear()" ng-disabled="time.nowYear>=ThisYear" style="border:none;background-color:#f5f5f5"><i class="icon ion-arrow-right-b" ng-class="time.nowYear>=ThisYear?'divdisaple':'divactive' " aria-hidden="true"></i></button></td>
                        <td class="noClick" colspan="2">{{time.nextYear}}</td>
                    </tr>
                    <tr>
                        <td class="noClick" colspan="2">{{time.prevMonth}}</td>
                        <td class="noBorder" ><button ng-click="goPrevMonth()" ng-disabled="(time.nowYear+'-'+time.nowMonth)<='2014-1'" style="border:none;background-color:#f5f5f5"><i class="icon ion-arrow-left-b" ng-class="(time.nowYear+'-'+time.nowMonth)<='2014-1'?'divdisaple':'divactive'" aria-hidden="true"></i></button></td>
                        <td class="noClick nowYear" colspan="10">{{time.nowMonth}}</td>
                        <td class="noBorder" ><button ng-click="goNextMonth()" ng-disabled="(time.nowYear+'-'+time.nowMonth)>=(ThisYear+'-'+ThisMonth)" style="border:none;background-color:#f5f5f5"><i class="icon ion-arrow-right-b" ng-class="(time.nowYear+'-'+time.nowMonth)>=(ThisYear+'-'+ThisMonth)?'divdisaple':'divactive'" aria-hidden="true"></i></button></td>
                        <td class="noClick" colspan="2">{{time.nextMonth}}</td>
                    </tr>
                </table>
                <table class="ionic_table">
                    <thead>
                        <tr>
                            <th style="width:14%;">
                                <div class="th-inner">周日</div>
                            </th>
                            <th style="width:15%;">
                                <div class="th-inner">周一</div>
                            </th>
                            <th style="width:14%;">
                                <div class="th-inner">周二</div>
                            </th>

                            <th style="width:15%;">
                                <div class="th-inner">周三</div>
                            </th>
                            <th style="width:14%;">
                                <div class="th-inner">周四</div>
                            </th>
                            <th style="width:15%;">
                                <div class="th-inner">周五</div>
                            </th>
                            <th style="width:15%;">
                                <div class="th-inner">周六</div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr ng-repeat="item in result">
                            <td ng-repeat="tr in item">
                                <div ng-class="tr.className" ng-click=viewtitle(tr.title)>
                                    <div style="    position: relative;   display: block;   bottom: 9px;">
                                        <a>{{tr.key}}</a>
                                    </div>
                                </div>                         
                            </td>                        
                        </tr>                     
                    </tbody>
                </table>
                <div style="margin-top:20px">
                    <div style="float:left;margin-left:30px">
                        <div class="greencirle" style="float:left"></div>  &nbsp;&nbsp;&nbsp;已巡查
                    </div>

                    <div style="float:left;margin-left:30px">
                        <div class="yellowcirle" style="float:left"></div> &nbsp;&nbsp;&nbsp; 未巡查
                    </div>

                </div>
            </div>