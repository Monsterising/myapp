#### html
    <div class="col-md-12 row_top_10">
        <div class="col-md-4 without_left_padding">
            <div class="input-group input-group-sm">
                <span class="input-group-addon ">单选</span>
                <select select2 ng-model="Listcode" class="form-control" placeholder="请选择">
                    <option value="{{ item.id }}" ng-repeat="item in exampleLists">{{ item.name }}
                    </option>
                </select>
            </div>
        </div>
        <div class="col-md-4 without_left_padding">
            <div class="input-group input-group-sm">
                <span class="input-group-addon">多选</span>
                <input select2="" select2-model="Listcodes"
                       config="mulLists" multiple="" placeholder="请选择"
                       class="form-control ng-isolate-scope ng-valid select2-offscreen ng-dirty"
                       type="text" tabindex="-1">
            </div>
        </div>
    </div>
#### js
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
#### 对象
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
    .directive('select2', function (select2Query) {
        return {
            restrict: 'A',
            scope: {
                config: '=',
                ngModel: '=',
                select2Model: '='
            },
            link: function (scope, element, attrs) {
                // 初始化
                var tagName = element[0].tagName,
                    config = {
                        allowClear: true,
                        multiple: !!attrs.multiple,
                        placeholder: attrs.placeholder || ' '   // 修复不出现删除按钮的情况
                    };

                // 生成select
                if(tagName === 'SELECT') {
                    // 初始化
                    var $element = $(element);
                    delete config.multiple;

                    $element
                        .prepend('<option value=""></option>')
                        .val('')
                        .select2(config);

                    // model - view
                    scope.$watch('ngModel', function (newVal) {
                        setTimeout(function () {
                            $element.find('[value^="?"]').remove();    // 清除错误的数据
                            $element.select2('val', newVal);
                        },0);
                    }, true);
                    return false;
                }

                // 处理input
                if(tagName === 'INPUT') {
                    // 初始化
                    var $element = $(element);

                    // 获取内置配置
                    if(attrs.query) {
                        scope.config = select2Query[attrs.query]();
                    }

                    // 动态生成select2
                    scope.$watch('config', function () {
                        angular.extend(config, scope.config);
                        $element.select2('destroy').select2(config);
                    }, true);

                    // view - model
                    $element.on('change', function () {
                        scope.$apply(function () {
                            scope.select2Model = $element.select2('data');
                        });
                    });

                    // model - view
                    scope.$watch('select2Model', function (newVal) {
                        $element.select2('data', newVal);
                    }, true);

                    // model - view
                    scope.$watch('ngModel', function (newVal) {
                        // 跳过ajax方式以及多选情况
                        if(config.ajax || config.multiple) { return false }

                        $element.select2('val', newVal);
                    }, true);
                }
            }
        }
    })