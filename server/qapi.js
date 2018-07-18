//前台台路由配置
import config from './config.js'
import mysql from 'mysql2/promise'
import bcrypt from 'bcryptjs'
import fs from "fs"
import jwt from 'jsonwebtoken'
import common from './common'
import nodemailer from 'nodemailer'
import uuid from 'node-uuid';

// 首页部门
//用户激活
async function active(ctx) {
    const data = ctx.request.body;
    let code = 'succeed';
    if(data.name && data.code){
        const connection = await mysql.createConnection(config.mysqlDB);
        const [rows] = await connection.execute('SELECT id,code FROM `user` where `user_name`=? and `user_type`=?', [data.name,0]);
        if (rows.length) {
            let userinfo = rows[0]
            if(userinfo.code.replace(/\//g,'') !== data.code){
                code = 'errCode';
            }else{
                const [list] = await connection.execute('UPDATE `user` SET `user_type`=? where `id`=?', [4,userinfo.id]);
                code = list.affectedRows === 1 ? '007' :'001';
                var userarray =['','','','','','','','','','',new Date().toLocaleString(),userinfo.id]
                const [rows] = await connection.execute('INSERT INTO `userinfo` (user_name,user_intro,icon_path,hobby,integral,attention,fans,sex,age,vip_leave,create_time,user_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)', userarray);
            }
        }else{
            code = 'nobody';
        }
        await connection.end();
    }else{
        code = 'lack';
    }
    ctx.body = {
        success: code,
        data:{'code':code},
        message: ''
    }
}

//公用：发送邮件
function sendEmail(email, title, body) {   
    return new Promise(resolve => {
        let transporter = nodemailer.createTransport(config.emailServer);
        let mailOptions = {
            from: common.web_name+'<' + config.emailServer.auth.user + '>',
            to: email,
            subject: title,
            html: body
        };
        transporter.sendMail(mailOptions, err => {
            console.log(mailOptions,err)
            resolve(err ? err : null);
        });
    })
}
//用户注册
async function register(ctx) {
    const data = ctx.request.body;
    let msg, success = false;
    if (!common.name_reg.test(data.user_name)) {
        msg = common.name_txt;
    } else if (!common.pass_reg.test(data.pass_word)) {
        msg = common.pass_txt;
    } else if (!common.email_reg.test(data.user_email)) {
        msg = common.email_txt;
    }else{
        //先检查是否占用帐号
        const connection = await mysql.createConnection(config.mysqlDB);
        const [rows] = await connection.execute('SELECT id FROM `user` where `user_name`=?', [data.user_name]);
        if(rows.length > 0){
            msg = '帐号已经被占用！';
        }else{
            const [rows] = await connection.execute('SELECT id FROM `user` where `user_email`=?', [data.user_email]);
            if(rows.length > 0){
                msg = '邮箱已经被占用！';
            }else{
                console.log(uuid)
                let uuids = uuid.v1()
                data.pass_word = bcrypt.hashSync(data.pass_word, bcrypt.genSaltSync(10));
                const result = await connection.execute('INSERT INTO `user` (user_name,pass_word,create_time,login_ip,user_email,mobile,user_type,code) VALUES (?,?,?,?,?,?,?,?)', [data.user_name, data.pass_word, new Date().toLocaleString(), config.getClientIP(ctx),data.user_email,data.mobile,0,uuids]);
                success = result[0].affectedRows === 1;
                msg = success ? '' : '写入数据库失败';
                if(success){
                    //发送激活邮件
                    let link = `${common.web_path}/active?name=${data.user_name}&&code=${uuids}`;
                    let body = `您好：${data.user_name} <br/>欢迎注册【${common.web_name}】网站，请点击<a href="${link}" target="_blank">激活账户</a>链接进行激活您的帐号！<p></p>`;
                    if(await sendEmail(data.user_email, common.web_name+'【帐号激活】', body)){
						await connection.end();
                        return ctx.body = {
                            success: true,
                            data:{emailErr:true},
                            message: ''
                        }
                    }
                }
            }
        }
        await connection.end();
    }
    ctx.body = {
        success: success,
        data:{},
        message: msg
    }
}

// 获取首页轮播图
async function getIndexImg(ctx) {
    const data = ctx.request.body;
    let pageSize = Math.abs(data.pageSize >> 0)||10;//分页率
    let page = Math.abs(data.page >> 0)||1;//当前页码
    const arr = [];
    let querying = '';
    const user = ctx.state.userInfo;
    if(user.user_type > 2){
        //querying += " and user_id=?";
        //arr.push(user.id >> 0);
    }
    const connection = await mysql.createConnection(config.mysqlDB);
    const [rows] = await connection.execute("SELECT SQL_NO_CACHE COUNT(*) as total FROM `img`"+querying.replace('and','where'), arr);
    const total = rows[0].total;//总数量
    const pages = Math.ceil(total/pageSize);
    if(page > pages){
        page = Math.max(1,pages);//以防没数据
    }
    arr.push((page - 1) * pageSize,pageSize);
    const [list] = await connection.execute("SELECT a.id,a.img_title,a.img_description,a.img_path,a.img_href,a.create_time,a.update_time,a.article_extend FROM img as a "+querying.replace('and','where'), arr);
    await connection.end();
    ctx.body = {
        success: true,
        message: '',
        data: {
            page,total,data:list
        }
    }
}

// 获取首页推荐信息
async function getListArticle(ctx) {
    const data = ctx.request.body;
    let pageSize = Math.abs(data.pageSize >> 0)||10;//分页率
    let page = Math.abs(data.page >> 0)||1;//当前页码
    const arr = [];
    let querying = '';
    if(data.title){
        querying += " and title like ?";
        arr.push('%' + data.title + '%');
    }
    if(/^\d+$/.test(data.sort_id)){
        querying += ' and sort_id=?';
        arr.push(data.sort_id >> 0);
    }
    if(/^[1-4]$/.test(data.read_type)){
        querying += " and read_type=?";
        arr.push(data.read_type >> 0);
    }
    //会员只能查看自己的文章(暂关闭)
    const user = ctx.state.userInfo;
    if(user.user_type > 2){
        //querying += " and user_id=?";
        //arr.push(user.id >> 0);
    }
    const connection = await mysql.createConnection(config.mysqlDB);
    const [rows] = await connection.execute("SELECT SQL_NO_CACHE COUNT(*) as total FROM `article`"+querying.replace('and','where'), arr);
    const total = rows[0].total;//总数量
    const pages = Math.ceil(total/pageSize);
    if(page > pages){
        page = Math.max(1,pages);//以防没数据
    }
    querying += " order by a.id desc LIMIT ?";
    arr.push(4);
    const [list] = await connection.execute("SELECT a.id,a.title,a.sort_id,a.art_img,a.user_id,a.passed,a.read_type,a.create_time,u.`user_name`,s.`sort_name` FROM article as a LEFT JOIN user as u on a.user_id = u.id LEFT JOIN sort as s on a.sort_id = s.id"+querying.replace('and','where'), arr);
    await connection.end();
    ctx.body = {
        success: true,
        message: '',
        data: {
            page,total,data:list
        }
    }
}

//获取商品详情（管理员获取所有；会员获取自己的或者是审核通过的）
async function getProById(ctx) {
    const data = ctx.request.body;
    let id = data.id >> 0;
    let msg;
    const connection = await mysql.createConnection(config.mysqlDB);
    const [list] = await connection.execute("SELECT a.* FROM prolist as a  where a.id=?", [id]);
    const obj = list[0];
    const [imglist] = await connection.execute("SELECT * FROM proimglist where pro_id=?", [id]);
    obj.imglist = imglist;
    if(list.length === 1){
        const user = ctx.state.userInfo;
		obj.xx = JSON.stringify(user);
        if(user.user_type > 2 && user.id !== obj.user_id){
            if(obj.passed === 0){
				obj.content = '<div class="no_access">文章仍在审核中<d>';
            }else if(user.user_type > obj.read_type){
                obj.content = '<div class="no_access">您无权查看此内容<d>';
            }
        }
    }else{
        msg = '查无此文章';
    }
    //扩展上一条下一条数据
    let [prev] = await connection.execute("SELECT `id`,`title` FROM article where id<? order by id desc limit 1", [id]);
    let [next] = await connection.execute("SELECT `id`,`title` FROM article where id>? order by id asc limit 1", [id]);
    obj.prev = prev.length?prev[0]:{};
    obj.next = next.length?next[0]:{};
    await connection.end();
    ctx.body = {
        success: !msg,
        message: msg,
        data: !msg ? obj : {}
    }
}


export default {
    register,
    active,
    getIndexImg,
    getListArticle,
    getProById,
}
