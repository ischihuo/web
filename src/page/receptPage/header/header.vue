<template>
    <div class="headers">
        <el-menu
        :default-active="activeIndex2"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b">
        <el-menu-item index="0"><img src="" alt=""></el-menu-item>
        <el-menu-item index="1">首页</el-menu-item>
        <el-submenu index="2">
            <template slot="title">我的工作台</template>
            <el-menu-item index="2-1">选项1</el-menu-item>
            <el-menu-item index="2-2">选项2</el-menu-item>
            <el-menu-item index="2-3">选项3</el-menu-item>
            <el-submenu index="2-4">
            <template slot="title">选项4</template>
            <el-menu-item index="2-4-1">选项1</el-menu-item>
            <el-menu-item index="2-4-2">选项2</el-menu-item>
            <el-menu-item index="2-4-3">选项3</el-menu-item>
            </el-submenu>
        </el-submenu>
        <el-menu-item index="3" disabled>我的组织</el-menu-item>
        <el-menu-item index="4"><a href="" target="_blank">联系我们</a></el-menu-item>
        <el-menu-item index="5"><a href="" target="_blank">个人中心</a></el-menu-item>
        </el-menu>
    </div>
</template>

<script>
    import Vue from "vue";
    // import {delCookie} from '../../../static/js/cookie.js'
    // import {setCookie} from '../../../static/js/cookie.js'
    export default{
        data() {
            return {
              activeIndex: '1',
              activeIndex2: '1'
            }
        },
        methods: {
            handleSelect(key, keyPath) {
                console.log(key, keyPath);
            },
            logout() {
                let loading = Vue.prototype.$loading({text:"退出中..."});
                var roleName = this.getCookie("roleName");
                delCookie('userInfo');
                var _this = this;
                // this.Axios({
                //   url:Action.SECURITY_LOGOUT,
                //   method:'post',
                //   data:{}
                // }).then((res) => {
                //   loading.close();
                //   if(res.data.code=="000"){
                //       console.log(roleName)
                //     if(roleName=="ROLE_med_inst"){
                //         window.location.href = '/loginPage/login.html'
                //     }else{
                //         this.$router.push("/login")
                //     }
                //   }else{
                //     this.$alert(res.data.msg || '系统错误...','错误提示',{
                //         cofirmButtonText:'确定',
                //         type:'error'
                //     })
                //   }
                  
                // }).catch((err) => {
                //   loading.close();
                //   console.log(err);
                // })
            },
            init(){
                var _this = this;
            }
        },
        mounted() {
            this.init();
        }
    }
</script>

<style lang="less">
    .headers{
        min-width: 1200px;
        width: 100%;
        height: 60px;
        background: #545C64;
        position: absolute;
        ul.el-menu-demo.el-menu--horizontal.el-menu{
            width: 600px;
            float: right;
        }
        .el-menu--horizontal{
            border-bottom: none;
        }
    }
</style>
