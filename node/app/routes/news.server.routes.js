var NewsController = require('../controllers/news.server.controller');

module.exports = function(app){
  //获取列表
  app.route('/news')
    .get(NewsController.list)
    .post(NewsController.create);
  //获取详情
  app.route('/news/:nid')
    .get(NewsController.get);
  //获取地区
  app.route('/types')
      .get(NewsController.types);
  //获取类型
  app.route('/areas')
      .get(NewsController.areas);
  //获取最新更新时间（得到的结果需要加8小时）
  app.route('/nearlyGetTime')
      .get(NewsController.nearlyGetTime);
  app.param('nid', NewsController.getById);
};