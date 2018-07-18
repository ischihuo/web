//前台台路由配置需要登录
import config from './config.js'
import mysql from 'mysql2/promise'
import bcrypt from 'bcryptjs'
import fs from "fs"
import jwt from 'jsonwebtoken'
import common from './common'
import nodemailer from 'nodemailer'

//查询用户信息
async function getUserInfo(ctx) {
    const user = ctx.state.userInfo;
    const connection = await mysql.createConnection(config.mysqlDB);
    const [result] = await connection.execute('SELECT * FROM `userinfo` where `user_id`=?', [user.id]);
    const obj = result[0];
    ctx.body = {
        success: true,
        message: '',
        data: {
            result:obj
        }
    }
}

//修改用户信息
async function updtUserInfo(ctx) {
    const data = ctx.request.body;
    let err;
    const user = ctx.state.userInfo;
    const obj = {
        user_name:'昵称',
        icon_path:'头像',
        birthday:'生日',
        sex:'性别',
        hobby:'爱好',
        userintro:'自我简介',
        age:'年龄',
    };
    for(let key in obj){
        if (!data[key]) {
            err = obj[key]+'不能为空！';
            break;
        }
    } 
    const userarray = [
        data.user_name,
        data.user_intro,
        data.icon_path,
        data.hobby,
        data.sex,
        data.age,
        new Date().toLocaleString(),
        user.id,
    ];
    console.log(userarray)
    const connection = await mysql.createConnection(config.mysqlDB);
    const [list] = await connection.execute('UPDATE `userinfo` SET `user_name`=?, `user_intro`=?, `icon_path`=?, `hobby`=?,  `sex`=?, `age`=?, `update_time`=? where `user_id`=?', userarray);
    const result = list[0];
    ctx.body = {
        success: true,
        message: '',
        data: {
            'result':result
        }
    }
}

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

export default {
    addpro,
    getUserInfo,
    updtUserInfo,
}
