//前台台路由配置需要登录
import config from './config.js'
import mysql from 'mysql2/promise'
import bcrypt from 'bcryptjs'
import fs from "fs"
import jwt from 'jsonwebtoken'
import common from './common'
import nodemailer from 'nodemailer'

//新添商品
async function addpro(ctx) {
    const data = ctx.request.body;
    const imglist = data.imglist;
    let err;
    const obj = {
        name:'商品名称',
        img_path:'图片地址',
        area_prov:'省级code',
        area_city:'市级code',
        area_cou:'区县级code',
        address:'详细地址',
        read_type:'阅读权限',
    };
    for(let key in obj){
        if (!data[key]) {
            err = obj[key]+'不能为空！';
            break;
        }
    } 
    const array = [
        data.name,
        data.img_path,
        data.area_prov,
        data.area_city,
        data.area_cou,
        data.address,
        data.read_type
    ];
    if(!err){
        const user = ctx.state.userInfo;//获取用户信息
        const connection = await mysql.createConnection(config.mysqlDB);
        //添加文章
        array.push(new Date().toLocaleString());//添加日期
        array.push(user.id);//用户信息
        const [result] = await connection.execute('INSERT INTO `prolist` (name,img_path,area_prov,area_city,area_cou,address,read_type,create_time,user_id) VALUES (?,?,?,?,?,?,?,?,?)', array);
        console.log(result.affectedRows)
        err = result.affectedRows === 1 ? '' :'商品添加失败';
        var proid = result.insertId;
        let arrayimg = '';
        var resp = {};
        imglist.forEach((v,index)=>{
            v = JSON.parse(v)
            arrayimg += '("'+v.imageUrl+'","'+v.name+'","'+new Date().toLocaleString()+'","'+proid+'")';
            if(index<imglist.length-1){
                arrayimg+=',';
            }
        })
        const [resultimg] = await connection.execute('INSERT INTO `proimglist` (img_path,img_title,create_time,pro_id) VALUES '+arrayimg);
        console.log(resultimg)
        err = resultimg.affectedRows === imglist.length ? '' :'商品添加失败';
        if(resultimg.affectedRows === imglist.length){
            resp = {'result':true,'code':'000'}
        }else{
            resp = {'result':false,'code':'001'}
        }
        await connection.end();
    }
    ctx.body = {
        success: !err,
        message: err,
        data: resp
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
    addpro,
    getProById,
}
