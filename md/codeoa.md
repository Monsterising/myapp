    .factory('FileUtil',function($ionicLoading, $cordovaFileTransfer,BlankFactory,ImgUtil){
    return{
       'uploadFile':function(categoryCode,type,flowID,filSrc,divID,scope){
          console.log('filSrc:'+filSrc);
          $ionicLoading.show({
                template: '文件上传中...'
           });
           var options = {};
           if(type=='normalFile'){
              options = {
                          fileKey: "file",
                          fileName: filSrc
                         };
           }
           var uploadPath = BlankFactory.getUploadPath();

           uploadPath = uploadPath + "?Method=UpLoadFile&FileUploadType=" + type + "&FileCatalog=" + categoryCode + "&Object_ID=" + flowID;
           $cordovaFileTransfer.upload(uploadPath,filSrc,options)
            .then(function (str) {
                // Success!
                $ionicLoading.hide();
                result = JSON.parse(str.response);
                console.log(str.response);
                console.log('isOk'+result.isOK);

                if (result.isOK == true) {
                    console.log('type:'+type);

                      if(type == 'largeImage'){//上传图片
                        ImgUtil.createImg(result.message.imgThumbnail, result.message.fileUrl, result.message.fileCode,divID,false,scope);
                      }else{  //上传录音
                        ImgUtil.createVolImg(result.message.fileUrl,divID,result.message.fileCode,result.message.fileUrl,false);
                      }
                    console.log("上传成功");
                } else {
                    alert("上传失败");
                }
            }, function (err) {
                // Error
                $ionicLoading.hide();
                console.log("error:" + JSON.stringify(err));
                alert("上传失败");
            }, function (progress) {
                // constant progress updates
            });
       }
    }
    })
    //生成、删除图标
    .factory('ImgUtil',function($ionicLoading,$ionicActionSheet,BlankFactory,$http,AudioRecord,$ionicPlatform,$compile){
          var obj={};
          obj.createImg=function(path,largePath,fileCode,divID,hideDelIcon,scope){
               $ionicPlatform.ready(function () {
                    console.log("createImg");
                    var parent = document.getElementById(divID);
                    var div = document.createElement('div');
                    var image = document.createElement('img');
                    console.log('url:'+path);
                    image.src = path;
                    image.onclick = function () {
                        $ionicActionSheet.show({
                            buttons: [
                               { text: "<i class='icon ion-eye positive'></i>查看" },
                               { text: "<i class='icon ion-minus-circled assertive'></i>刪除" }
                            ],
                            titleText: '操作图片',
                            cancelText: '取消',
                            cancel: function () {
                            },
                            buttonClicked: function (index) {
                                if (index == 0) {
                                    window.open = cordova.InAppBrowser.open;
                                    cordova.InAppBrowser.open(largePath, '_blank', 'location=yes');
                                } else if (index == 1) {
                                    obj.deleteImg(div,fileCode,divID);
                                }
                                return true;
                            }
                        });
                    }
                    if(hideDelIcon){
                      image.onclick = function(){
                        window.open = cordova.InAppBrowser.open;
                        cordova.InAppBrowser.open(largePath, '_blank', 'location=yes');
                      }
                    }
                    console.log('begin appending ');
                    div.className = "col col-20 float_left";
                    div.appendChild(image);
                    parent.appendChild(div);
    //                $compile(parent)(scope);
                    console.log('end appending ');
                })
          }
          obj.deleteImg=function(div,fileCode,divID){
                    var path = BlankFactory.getUploadPath();
                    var method = "deleteFile";
                    $ionicLoading.show({
                        template: '图片删除中...'
                    });
                    $http({
                        url: path,
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        data: {
                            'Method': method, 'fileCode': fileCode
                        }
                    }).success(function (data) {
                        $ionicLoading.hide();
                        console.log(JSON.stringify(data))
                        if (data.isOK == true) {
                            console.log("刪除成功！");
                            var parent = document.getElementById(divID);
                            parent.removeChild(div);
                        }
                        else {
                            alert("刪除失敗！");
                        }
                    }).error(function () {
                        $ionicLoading.hide();
                        alert("刪除失敗！");
                    });
          }
          obj.getImages = function(flowID,categoryCode,divID,hideDelIcon,scope){
                    console.log('getImages');
                    $ionicLoading.show({
                        template: '数据加载中...'
                    });
                    var url = BlankFactory.getUploadPath()+"?Method=getFlowFiles&Flow_ID=" + flowID + "&Category_Code="+categoryCode;
                    console.log("URL:"+url);
                    $http({
                        url: url,
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }).success(function (data) {
                        $ionicLoading.hide();
                        if (data.isOK == true) {
                            $('#'+divID).empty();
                            for (var i = 0; i < data.message.length; i++) {
                                var fileCode = data.message[i].fileCode;
                                var path = data.message[i].imgThumbnail;
                                var largePath = data.message[i].fileUrl;
                                obj.createImg(path, largePath, fileCode,divID,hideDelIcon,scope);
                            }
                        }
                        else {
                            alert("请求失败");
                        }
                    }).error(function () {
                        $ionicLoading.hide();
                    });
          }
          obj.getVolImgs = function(flowID,categoryCode,divID,hideDelIcon){
                  console.log('getVolImgs');
                  $ionicLoading.show({
                      template: '数据加载中...'
                   });
                                  var url = BlankFactory.getUploadPath()+"?Method=getFlowFiles&Flow_ID=" + flowID + "&Category_Code="+categoryCode;
                                  console.log('URL:'+url);
                                  $http({
                                      url: url,
                                      method: "POST",
                                      headers: {
                                          'Content-Type': 'application/x-www-form-urlencoded'
                                      }
                                  }).success(function (data) {
                                      $ionicLoading.hide();
                                      if (data.isOK == true) {
                                          $('#'+divID).empty();
                                          for (var i = 0; i < data.message.length; i++) {
                                              var fileCode = data.message[i].fileCode;
                                              var path = data.message[i].imgThumbnail;
                                              var fileUrl = data.message[i].fileUrl;
                                              obj.createVolImg(fileUrl,divID,data.message[i].fileCode,fileUrl,hideDelIcon);
                                          }
                                      }
                                      else {
                                          alert("请求失败");
                                      }
                                  }).error(function () {
                                      $ionicLoading.hide();
                                  });
          }
          obj.createVolImg=function(src,divID,fileCode,url,hideDelIcon){
                        console.log("createVolImg");
                        /**<div class="col col-20 float_left"> <button class="icon ion-ios-mic vol-button"></button></div>**/
                        var parent = document.getElementById(divID);
                        var div = document.createElement('div');
                        var button = document.createElement('button');
                        var image = document.createElement('i');
                        image.className = "icon ion-ios-mic";
                        button.onclick = function () {
                            $ionicActionSheet.show({
                                buttons: [
                                   { text: "<i class='icon ion-eye positive'></i>播放" },
                                   { text: "<i class='icon ion-minus-circled assertive'></i>刪除" }
                                ],
                                titleText: '操作录音',
                                cancelText: '取消',
                                cancel: function () {
                                },
                                buttonClicked: function (index) {
                                    if (index == 0) {
                                      console.log("开始播放");
    //                                  var audio  = new Audio(url);
    //                                  audio.play();
                                      AudioRecord.play(src);
                                    } else if (index == 1) {
                                      console.log("执行删除");
                                      obj.deleteImg(div,fileCode,divID);
                                    }
                                    return true;
                                }
                            });
                        }
                        if(hideDelIcon){
                           button.onclick = function(){
                            AudioRecord.play(src);
                           }
                        }
                        div.className = "col col-20 float_left";
                        button.className = "icon ion-ios-mic vol-button";
                        div.appendChild(button);
                        parent.appendChild(div);
          }
          return obj;
        })
    //相册，摄像头操作
    .factory('CameraUtil',function(FileUtil,$cordovaCamera,$ionicActionSheet){
          var obj={};
          obj.chooseImgMenu = function(PhotoCategoryCode,flowID,divID,scope){
                                $ionicActionSheet.show({
                                buttons: [
                                   { text: "<i class='icon ion-camera positive'></i>拍照" },
                                   { text: "<i class='icon ion-images positive'></i>从相册选择" }
                                ],
                                titleText: '选择照片',
                                cancelText: '取消',
                                cancel: function () {
                                },
                                buttonClicked: function (index) {
                                    if (index == 0) {
                                        // type = 'camera';
                                        obj.takeImage(PhotoCategoryCode,flowID,divID,scope);
                                    } else if (index == 1) {
                                        // type = 'gallery';
                                        obj.chooseImage(PhotoCategoryCode,flowID,divID,scope);
                                    }
                                    return true;
                                }
                        });

      }
      obj.chooseImage=function(PhotoCategoryCode,flowID,divID,scope){
             var options = {
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
              };
               $cordovaCamera.getPicture(options).then(function (imageURI) {
                FileUtil.uploadFile(PhotoCategoryCode,'largeImage',flowID,imageURI,divID,scope);
               }, function (err) {
                // error
                console.log("getPicture error:" + err);
              });
          },
      obj.takeImage=function(PhotoCategoryCode,flowID,divID,scope){
            var options = {
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.CAMERA,
            }
            $cordovaCamera.getPicture(options).then(function (imageURI) {
                 FileUtil.uploadFile(PhotoCategoryCode,'largeImage',flowID,imageURI,divID,scope);
            }, function (err) {
                // error
               console.log("getPicture error:" + err);
            });
          }

      return obj;
    })
    //录音功能
    .factory('AudioRecord',function($cordovaMedia,$ionicActionSheet,isEmpty){
            var myMedia = null;
            var path;
            var obj={}
            obj.startRecording=function(src){
               path =src;
               myMedia = $cordovaMedia.newMedia(src);
               myMedia.startRecord();
               console.log("start recording ...");
            },
            obj.stopRecording=function(){
              myMedia.stopRecord();
    //          myMedia.release();
              console.log("stop recording ...");
              return path;
            },
            obj.play=function(src){
              if(!isEmpty.isOwnEmpty(myMedia)){
                myMedia.release();
              }
              myMedia = $cordovaMedia.newMedia(src);
              myMedia.play();
              console.log("play record");
            }
            return obj;
    })
    
    .factory('isEmpty',function(){
        return {
          isOwnEmpty:function(obj){
            for(var name in obj)
                {
                    if(obj.hasOwnProperty(name))
                    {
                        return false;
                    }
                }
                return true;
          }
        }
    })
    //地理位置监听
    .factory('Geo', function ($cordovaGeolocation) {
    
    var watchOptions = {
        timeout: 3000,
        enableHighAccuracy: true // may cause errors if true
    };

    var watch = $cordovaGeolocation.watchPosition(watchOptions);
    return {
        getWatch: function () {
            return watch;
        },
        clearWatch: function () {
            watch.clearWatch();
        }
    }
    })
    //百度定位
    .factory('$BaiduLocation', function ($ionicPlatform) {
        return {
            'getCurrentPosition': function (success, error) {
                $ionicPlatform.ready(function () {
                    if (ionic.Platform.isAndroid()) {
                        baidu_location.getCurrentPosition(success, error);
                    }
                })
            },
            'stopListen': function () {
                $ionicPlatform.ready(function () {
                    if (ionic.Platform.isAndroid()) {
                        baidu_location.stopListen();
                    }
                })
            },
             'setAliasAndTags':function(alias,tags){
                if (ionic.Platform.isAndroid()) {
                    baidu_location.setAliasAndTags(alias,tags);
                }
             },
             'setPushNull':function(){
               if (ionic.Platform.isAndroid()) {
                  baidu_location.setPushNull();
              }
             }
        }
    })