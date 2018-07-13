//后台路由配置
import jwt from 'jsonwebtoken'
import config from './config.js'
import api from './api'
import qapi from './qapi'
import lapi from './lapi'
import common from './common'
import koa_router from 'koa-router'
import multer from 'koa-multer';
import fs from "fs"
const routes = koa_router();
// userType:需要的用户权限  0:游客 1:超级管理员 2:普通管理员 3:VIP用户 4:普通用户
//后台接口
const urls = {
    'saveXML'   : {userType: 0},	//保存xml（游客）
    'login'   : {userType: 0},	//用户登录（游客）
    'register': {userType: 0},	//用户注册（游客）
    'retrieve': {userType: 0},	//找回密码（游客）
	'findPassword': {userType: 0,method:'get',url:'/:email/:code'},//激活找回密码（游客）
    'active': {userType: 0,method:'get',url:'/:name/:code'},//帐号激活（游客）
    'changePassword' : {},
    'listSort': {},
    'updateSort': {},
    'deleteSort': {},
    'batchDelSort': {},
    'upFile': {},
    'listUpFile': {},
    'delFile': {},
    'listUser': {},
    'updateUser' : {},
    'getUserById': {userType: common.page_grade.updateUser},
    'passedUser': {},
    'deleteUser': {},
    'upUserPic': {userType: 4},//用户上传头像
    'listArticle': {},
    'updateArticle': {},
    'passedArticle': {},
    'deleteArticle': {},
    'getArticleById': {userType: 4},//获取文章详情
    'listImg':{},
    'getImgById':{},
    'updateImg':{},
    'deleteImg':{}
};
//前台接口
const qurls = {
    'register':{},//注册新用户
    'active':{},//激活
    'getIndexImg': {userType:0},	//获取首页的轮播图
    'getListArticle':{},// 获取首页推荐信息
};
//前台接口需私有
const lurls = {
    'addpro':{},//新增商品
    'getProById':{},//查看商品
};
//前台接口公开
Object.getOwnPropertyNames(qurls).forEach(key=>{
    if(common.page_grade.hasOwnProperty(key)){
        qurls[key].userType = common.page_grade[key];//覆盖访问权限
    }
    if(key !== 'upFile'){
        let obj = qurls[key];
        let url = '/repect/' + key + (obj.url || '');
        routes[obj.method ? obj.method : 'post'](url, qapi[key]);
    }
});
//前台接口私有
Object.getOwnPropertyNames(lurls).forEach(key=>{
    if(common.page_grade.hasOwnProperty(key)){
        lurls[key].userType = common.page_grade[key];//覆盖访问权限
    }
    if(key !== 'upFile'){
        let obj = lurls[key];
        let url = '/lead/' + key + (obj.url || '');
        routes[obj.method ? obj.method : 'post'](url, lapi[key]);
    }
});
//后台接口
Object.getOwnPropertyNames(urls).forEach(key=>{
    if(common.page_grade.hasOwnProperty(key)){
        urls[key].userType = common.page_grade[key];//覆盖访问权限
    }
    if(key !== 'upFile'){
        let obj = urls[key];
        let url = '/backg/' + key + (obj.url || '');
        routes[obj.method ? obj.method : 'post'](url, api[key]);
    }
});


//文件上传配置
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(req.body)
        if (!fs.existsSync(config.upPath)) {
            fs.mkdirSync(config.upPath);
        }
        cb(null, config.upPath);
    },
    filename: function (req, file, cb) {
        let fileFormat = (file.originalname).split(".");
        if(file.originalname!=="blob"){
            cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]);
        }else{
            cb(null,Date.now() + ".png");
        }
        
    }
});
//上传文件
routes.post('/backg/upFile', multer({storage}).single('file'), async ctx => {
    const {originalname,mimetype,filename,path,size} = ctx.req.file;
    console.log(ctx.req.file)
    let msg,is_del = 0;
    // let fullPath = common.web_domain + config.upPath.replace('dist/','/') + filename;
    let fullPath = filename;
    if(size > common.upFile_maxSize || !common.upFile_accept.test(mimetype)) {
        msg = size > common.upFile_maxSize?'上传文件大小超出':'非法上传文件格式';
        is_del = 1;
        fs.unlinkSync(path);//同步删除文件
    }
    await api.saveUpFile([ctx.state.userInfo.id,originalname,path,mimetype,size,is_del,new Date().toLocaleString()]);
    ctx.body = {
        success: !msg,
        message:msg,
        data: {
            filename: fullPath
        }
    }
});


//验证权限函数
async function verify(ctx) {
    return new Promise((resolve, reject) => {
        let urllist ;
        let arr ;
		// if(ctx.url.substring(0,11) !== '/api/repect'){
		// 	resolve({});//非后端接口请求
        // }else 
        if(ctx.url.substring(0,10) == '/api/backg'){
            urllist = urls;
            arr = /\/api\/backg\/([a-zA-Z]+)/.exec(ctx.url);
        }else if(ctx.url.substring(0,9) == '/api/lead'){
            urllist = lurls;
            arr = /\/api\/lead\/([a-zA-Z]+)/.exec(ctx.url);
        }else{
            // urllist = qurls;
            // arr = /\/api\/repect\/([a-zA-Z]+)/.exec(ctx.url);
            resolve({}); //不需要验证token
        }
        let key = arr ? arr[1]:'';
        let obj = urllist[key];
        if (!urllist.hasOwnProperty(key)) {
            resolve('非法请求链接：' + ctx.url);
        }else if (ctx.method !== (obj.method ? obj.method : 'post').toUpperCase()) {
            resolve('非法请求方式：' + ctx.method);
        }
        //异步验证token
		const userType = obj.userType;
		if (userType === 0) {
            resolve({}); //不需要验证token
        }
        jwt.verify(ctx.request.header.authorization, config.JWTs.secret, (err, decoded) => {
            if (err) {
                resolve('token验证错误！');
            } else {
                if (config.getClientIP(ctx) !== decoded.ip || !Number.isInteger(decoded.id)) {
                    resolve('token无效！');
                } else if (decoded.user_type > userType) {
                    resolve('对不起您无权操作！');
                }
            }
            resolve(decoded);//把用户信息带上
        });
    })
}

export default {
    verify,
    routes
}
