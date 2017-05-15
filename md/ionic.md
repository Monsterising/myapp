#### 1、提示框
     ionicale.ale("提交成功！").then(function (res) {$state.go(BlankFactory.stepurl(), { "sid": userId }, { isCache: false });});
    .factory('ionicale', function ($ionicPopup) {
        return {
               ale: function (data) {
                   return $ionicPopup.alert({ title: '提示', template: data }).then(function (res) { return res });
            }
        }
       
    })
#### 2、缓存
    cache: false,
        params: {
            isCache: true
        }
    $state.go("tabsController.quit", {}, { isCache: false });
    cache-view="false"