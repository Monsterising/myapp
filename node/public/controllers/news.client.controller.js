angular.module('webapp').controller('NewsController', ['$scope', 'NewsService', NewsController]).filter("range", function ($filter) {
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
  .filter("titlefiter",function(){
   return function(data){
    if(!data)
      return data;
    if(data.length>50)
      return data.substring(0,50)+'...';
    else
      return data;}
  });

function NewsController($scope, NewsService){
  $scope.list = [];
  $scope.current = {};
  $scope.new = {};

  $scope.openNewsDetail = function(id){
    // $scope.loadDetail(id);
    // $("#modal-detail").modal('show');
    window.open(id);
  };

  $scope.formatTime = function(time1,time2){
      if(time1!=null)
          return "截止时间："+moment(time1).format('LL');
      else
          return "发布时间："+moment(time2).format('LL');
  };

  $scope.loadNews = function(req){
    NewsService.list(req).then(
      function(data){
        $scope.list = data.data.rows;
        $(".opacity").hide();
      },
      function(err){}
    );

  };

  var reqs={source:'浙江政府采购',area:"",type:"",st:"2014-2-1",et:"2018-12-1"}
  // var reqs={source:'杭州市政府采购网',st:"2014-2-1",et:"2018-12-1"}
  $scope.page_pos={pageNo:1,pageSize:20};
  $scope.source=[ {"value":"浙江政府采购","text":"浙江政府采购"},{"value":"杭州市政府采购网","text":"杭州市政府采购网"}  ];
  $scope.loadNews(reqs);
  NewsService.types().then(
        function(data){
            $scope.type=[];
            for(var i=0;i<data.data.length;i++){
                $scope.type.push({"value":data.data[i],"text":data.data[i]});
            }
        },
        function(err){}
    );
    NewsService.areas().then(
        function(data){
            $scope.area=[];
            for(var i=0;i<data.data.length;i++){
                $scope.area.push({"value":data.data[i],"text":data.data[i]});
            }
        },
        function(err){}
    );
}