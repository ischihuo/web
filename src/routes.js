import common from 'common'
import Login from 'page/backgPage/Login.vue'
import NoFind from 'page/backgPage/NoFind.vue'
import Home from 'page/backgPage/Home.vue'
import ArticleList from 'page/backgPage/Article/list.vue'
import ArticleSort from 'page/backgPage/Article/sort.vue'
import ArticleAdd from 'page/backgPage/Article/add.vue'
import UpFileList from 'page/backgPage/UpFile/list.vue'
import userList from 'page/backgPage/User/list.vue'
import userAdd from 'page/backgPage/User/add.vue'
import ImgList from 'page/backgPage/Img/list.vue'
import ImgAdd from 'page/backgPage/Img/add.vue'
// 前台
import regist from 'page/receptPage/user/regist.vue'
import active from 'page/receptPage/user/active.vue'
import login from 'page/receptPage/user/login.vue'
import aboutMe from 'page/receptPage/user/aboutMe.vue'
import completeInfo from 'page/receptPage/user/completeInfo.vue'
import Index from 'page/receptPage/index/index.vue'
import IndexPage from 'page/receptPage/index/indexPage.vue'
import proDetails0 from 'page/receptPage/pro/proDetails0.vue'
import proAdd from 'page/receptPage/pro/proAdd.vue'
import proDetailsAdd from 'page/receptPage/pro/proDetailsAdd.vue'
import proAddSuccess from 'page/receptPage/pro/proAddSuccess.vue'
import cersonMsg from 'page/receptPage/personalCenter/cersonMsg.vue'

//todo 记录
/*
*
* */
export default {
    mode: 'history',
    base: __dirname,
    routes: [
        {
            path: '*',
            name:'/404',
            component: NoFind
        },{
            path: '/backg/login',
            name:'login',
            meta:{title:'登录'},
            component: Login
        },{
            path: '/backg/article',
            meta:{
                verify:true,
                title:'文章管理',
                icon:'fa fa-file-text-o'
            },
            component: Home,
            redirect:'/backg/article/list',
            children: [{
                path: 'sort',
                meta:{
                    verify:true,
                    grade:common.page_grade.listSort,
                    title: '分类管理',
                    icon:'fa fa-th-large'
                },
                component: ArticleSort
            },{
                path: 'list',
                meta:{
                    verify:true,
                    grade:common.page_grade.listArticle,
                    title: '文章列表',
                    icon:'fa fa-newspaper-o'
                },
                component: ArticleList
            },{
                path: 'add',
                meta:{
                    verify:true,
                    title: '添加文章',
                    icon:'fa fa-clone'
                },
                component: ArticleAdd
            },{
                path: 'edit/:id',
                meta:{
                    verify:true,
                    title: '编辑文章',
                    icon:'fa fa-clone'
                },
                component: ArticleAdd
            }]
        },{
            path: '/backg/user',
            meta:{
                verify:true,
                title:'用户管理',
                icon:'fa fa-user-o'
            },
            redirect:'/backg/user/list',
            component: Home,
            children: [{
                path: 'list',
                meta:{
                    verify:true,
                    grade:common.page_grade.userList,
                    title: '用户列表',
                    icon:'fa fa-address-card-o'
                },
                component: userList
            },{
                path: 'add',
                meta:{
                    verify:true,
                    grade:common.page_grade.updateUser,
                    title: '添加用户',
                    icon:'fa fa-user-plus'
                },
                component: userAdd
            },{
                path: 'edit/:id',
                meta:{
                    verify:true,
                    title: '编辑用户',
                    icon:'fa fa-user-times'
                },
                component: userAdd
            }]
        },{
            path: '/backg/img',
            meta:{
                verify:true,
                title:'图片管理',
                icon:'fa fa-user-o'
            },
            redirect:'/backg/img/list',
            component: Home,
            children: [{
                path: 'list',
                meta:{
                    verify:true,
                    grade:common.page_grade.userList,
                    title: '图片列表',
                    icon:'fa fa-address-card-o'
                },
                component: ImgList
            },{
                path: 'add',
                meta:{
                    verify:true,
                    grade:common.page_grade.updateUser,
                    title: '添加图片',
                    icon:'fa fa-user-plus'
                },
                component: ImgAdd
            },{
                path: 'edit/:id',
                meta:{
                    verify:true,
                    title: '编辑图片',
                    icon:'fa fa-user-times'
                },
                component: ImgAdd
            }]
        },{
            path: '/backg/upfile',
            meta:{
                verify:true,
                title:'上传管理',
                icon:'fa fa-upload'
            },
            component: Home,
            redirect:'/backg/upfile/list',
            children: [{
                path: 'list',
                meta:{
                    verify:true,
                    grade:common.page_grade.listUpFile,
                    title: '上传列表',
                    icon:'fa fa-files-o'
                },
                component: UpFileList
            }]
        },//後台相關接口結束
        {
            path: '/',
            name:'index',
            meta:{title:'首頁'},
            component: Index,
            children: [{
                path: '/',
                component: IndexPage
            },{
                path: '/proDetails',
                component: proDetails0,
            },{
                path:'/proAdd',
                component: proAdd,
            },{
                path:'/proDetailsAdd',
                component: proDetailsAdd,
            },{
                path:'/proAddSuccess',
                component: proAddSuccess,
            },{ 
                path: '/cersonMsg',
                component: cersonMsg 
            },{ path: '/aboutMe',
                name: '我的相关', 
                component: aboutMe }
            ],
        },{
            path:'/regist',
            component: regist
        },{
            path:'/active',
            component: active
        },{
            path:'/login',
            component: login
        },
        { path: '/completeInfo', name: '完善信息', component: completeInfo }
    ]
}
