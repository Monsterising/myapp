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