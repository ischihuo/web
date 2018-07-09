/**
 * 接口配置列表
 *
 */
;
(function(window, $, undefined) {
  // 取得工程目录
  var localObj = window.location;
  var hasSubDomain = false;
  // 是否只有主域名
  var isRootDomain = true;
  var paths = localObj.pathname.split("/");
  var path = "";
  if (paths.length >= 3) {
    path = localObj.pathname.split("/")[1];
    if (paths[3]) {
      hasSubDomain = true;
    }
    if (path) {
      isRootDomain = false;
    }
  }
  var wangzhiheng = "";
  var liangzhiyong = "";
  var basePath = '';
  var rootDomain = localObj.protocol + "//" + localObj.host;

  var ospath = "http://localhost:3000/api";
  var ospathrep = "http://localhost:3000/api/repect";
  var ospathbak = "http://localhost:3000/api/backg";
//   if(process.env.BUILD_FLAG === 'devBuild') {//本地部署环境
//   } else if(process.env.BUILD_FLAG === 'test') {//测试部署环境
//   } else if(process.env.BUILD_FLAG === 'online') {//线上部署环境
//   } else {//本地环境
//   };


  // 接口调用
  var Action = {
    // 登录
    'LOGIN':ospathbak+'/login', //分类管理

    'LISTSORT':ospathbak+'/listSort', //分类管理
    'UPDATESORT':ospathbak+'/updateSort', //修改分类
    'LISTARTICLE':ospathbak+'/listArticle', //文章列表数据
    'UPDATEARTICLE':ospathbak+'/updateArticle', //修改文章
    'GETARTICLEBYID':ospathbak+'/getArticleById', //获取文章信息
    'BATCHDELSORT':ospathbak+'/batchDelSort', //删除分类
    'PASSEDARTICLE':ospathbak+'/passedArticle', //审批文章
    
    //用户管理
    'LISTUSER':ospathbak+'/listUser', //用户列表数据
    'GETUSERBYID':ospathbak+'/getUserById', //获取用户信息
    'UPDATEUSER':ospathbak+'/updateUser', //修改或新建用户信息
    

    // 图片列表
    'LISTIMG':ospathbak+'/listImg', //图片列表
    'UPDATEIMG':ospathbak+'/updateImg', //修改文章
    'GETIMGBYID':ospathbak+'/getImgById', //获取图片信息
    'DELETEIMG':ospathbak+'/deleteImg', //删除图片
    
    //文件上传
    
    'LISTUPFILE':ospathbak+'/listUpFile', //上传文件列表
    'DELFILE':ospathbak+'/delFile', //删除文件
    'UPFILE':ospathbak+'/upFile', //上传文件
    'imgPath':"http://localhost:3001/upFile/",



    // 前台接口
    'GETINDEXIMG':ospathrep+'/getIndexImg', //上传文件列表
    'GETLISTARTICLE':ospathrep+'/getListArticle', //获取首页推荐信息
    'GETARTICLEBYID':ospathrep+'/getArticleById', //获取首页推荐信息
    
    
  };

  // 设置给全局
  window.Action = Action;
  /*window.basePath = basePath;*/
  window.hasSubDomain = hasSubDomain;
  window.isRootDomain = isRootDomain;
})(window, window.jQuery);
