(function () {
    if (typeof angular === 'undefined') {
        return;
    }
    angular.module('bsTable', []).directive('bsTableControl', ['$compile', function ($compile) {
        var CONTAINER_SELECTOR = '.bootstrap-table';
        var SCROLLABLE_SELECTOR = '.fixed-table-body';
        var SEARCH_SELECTOR = '.search input';
        var bsTables = {};
        function getBsTable(el) {
            var result;
            $.each(bsTables, function (id, bsTable) {
                if (!bsTable.$el.closest(CONTAINER_SELECTOR).has(el).length) return;
                result = bsTable;
                return true;
            });
            return result;
        }

        $(window).resize(function () {
            $.each(bsTables, function (id, bsTable) {
                bsTable.$el.bootstrapTable('resetView');
            });
        });
        function onScroll() {
            var bsTable = this;
            var state = bsTable.$s.bsTableControl.state;
            bsTable.$s.$applyAsync(function () {
                state.scroll = bsTable.$el.bootstrapTable('getScrollPosition');
            });
        }
        $(document)
          .on('post-header.bs.table', CONTAINER_SELECTOR + ' table', function (evt) { // bootstrap-table calls .off('scroll') in initHeader so reattach here
              var bsTable = getBsTable(evt.target);
              if (!bsTable) return;
              bsTable.$el
                .closest(CONTAINER_SELECTOR)
                .find(SCROLLABLE_SELECTOR)
                .on('scroll', onScroll.bind(bsTable));
          })
          .on('sort.bs.table', CONTAINER_SELECTOR + ' table', function (evt, sortName, sortOrder) {
              var bsTable = getBsTable(evt.target);
              if (!bsTable) return;
              var state = bsTable.$s.bsTableControl.state;
              bsTable.$s.$applyAsync(function () {
                  state.sortName = sortName;
                  state.sortOrder = sortOrder;
              });
          })
          .on('page-change.bs.table', CONTAINER_SELECTOR + ' table', function (evt, pageNumber, pageSize) {
              var bsTable = getBsTable(evt.target);
              if (!bsTable) return;
              var state = bsTable.$s.bsTableControl.state;
              bsTable.$s.$applyAsync(function () {
                  state.pageNumber = pageNumber;
                  state.pageSize = pageSize;
              });
          })
          .on('search.bs.table', CONTAINER_SELECTOR + ' table', function (evt, searchText) {
              var bsTable = getBsTable(evt.target);
              if (!bsTable) return;
              var state = bsTable.$s.bsTableControl.state;
              bsTable.$s.$applyAsync(function () {
                  state.searchText = searchText;
              });
          })
          .on('focus blur', CONTAINER_SELECTOR + ' ' + SEARCH_SELECTOR, function (evt) {
              var bsTable = getBsTable(evt.target);
              if (!bsTable) return;
              var state = bsTable.$s.bsTableControl.state;
              bsTable.$s.$applyAsync(function () {
                  state.searchHasFocus = $(evt.target).is(':focus');
              });
          });

        return {
            restrict: 'EA',
            scope: { bsTableControl: '=' },
            link: function ($s, $el) {
                var bsTable = bsTables[$s.$id] = { $s: $s, $el: $el };
                $s.instantiated = false;
                $s.$watch('bsTableControl.options', function (options) {
                    if (!options) options = $s.bsTableControl.options = {};
                    var state = $s.bsTableControl.state || {};

                    if ($s.instantiated) $el.bootstrapTable('destroy');
                    $el.bootstrapTable(angular.extend(angular.copy(options), state));
                    $s.instantiated = true;

                    // Update the UI for state that isn't settable via options
                    if ('scroll' in state) $el.bootstrapTable('scrollTo', state.scroll);
                    if ('searchHasFocus' in state) $el.closest(CONTAINER_SELECTOR).find(SEARCH_SELECTOR).focus(); // $el gets detached so have to recompute whole chain
                }, true);
                $s.$watch('bsTableControl.state', function (state) {
                    if (!state) state = $s.bsTableControl.state = {};
                    $el.trigger('directive-updated.bs.table', [state]);

                }, true);
                $el.bind('post-body.bs.table', function () {
                    $compile($el.contents())($s);
                });
                $s.$on('$destroy', function () {
                    delete bsTables[$s.$id];
                });
            }
        };
    }]).directive('select2', function (select2Query) {
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
})();