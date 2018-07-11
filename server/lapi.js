//前台台路由配置需要登录
import config from './config.js'
import mysql from 'mysql2/promise'
import bcrypt from 'bcryptjs'
import fs from "fs"
import jwt from 'jsonwebtoken'
import common from './common'
import nodemailer from 'nodemailer'

//新添
async function addpro(ctx) {
    const data = ctx.request.body.intro;
    const imglist = ctx.request.body.imglist;
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
    console.log(data)
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
        console.log(array)
        const [result] = await connection.execute('INSERT INTO `prolist` (name,img_path,area_prov,area_city,area_cou,address,read_type,create_time,user_id) VALUES (?,?,?,?,?,?,?,?,?)', array);
        console.log(result)
        err = result.affectedRows === 1 ? '' :'商品添加失败';
        var proid = result.insertId;
        var resp = {};
        if(result.affectedRows === 2){
            resp = {result:true,code:'000'}
        }
        await connection.end();
    }
    ctx.body = {
        success: !err,
        message: err,
        data: resp
    }
}

export default {
    addpro,
}
