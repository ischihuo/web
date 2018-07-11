//前台台路由配置
import config from './config.js'
import mysql from 'mysql2/promise'
import bcrypt from 'bcryptjs'
import fs from "fs"
import jwt from 'jsonwebtoken'
import common from './common'
import nodemailer from 'nodemailer'

// 首页部门
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

//获取文章详情（管理员获取所有；会员获取自己的或者是审核通过的）
async function getArticleById(ctx) {
    const data = ctx.request.body;
    let id = data.id >> 0;
    let msg;
    const connection = await mysql.createConnection(config.mysqlDB);
    const [list] = await connection.execute("SELECT a.*,u.`user_name`,s.`sort_name` FROM article as a LEFT JOIN user as u on a.user_id = u.id LEFT JOIN sort as s on a.sort_id = s.id where a.id=?", [id]);
    const obj = list[0];
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
    getIndexImg,
    getListArticle,
    getArticleById,
}
