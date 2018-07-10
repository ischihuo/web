import 'babel-polyfill';
import Vue from 'vue';
import App from './App';
import ElementUI from 'element-ui';
import '../static/style.css';
import 'element-ui/lib/theme-chalk/index.css';
import '../static/js/jquery-2.0.0.min.js'
import '../static/js/OstPaths.js'
import '../static/js/SubAreas.js'
import '../static/js/DataStore.min.js'
import VueRouter from 'vue-router';
import Vuex from 'vuex';

Vue.use(Vuex);
import store from './store/';//本地存储
import {storage} from 'utils';
import BaiduMap from 'vue-baidu-map'

Vue.use(BaiduMap, {
  ak: 'qvEBjYRcHmpZCDXR849MnC73QGstenOE'
})
Vue.use(ElementUI);
Vue.use(VueRouter);

import routes from './routes.js';
// import storage from './utils/storage.js';

//页面顶部进度条
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

import {getCookie} from '../static/js/cookie.js'
import {setCookie} from '../static/js/cookie.js'

const router = new VueRouter(routes);

router.beforeEach((to, from, next) => {
    window.scroll(0,0);
    NProgress.start();
    if (to.meta.verify) {
        storage.get('userInfo',obj=>{
            if (!obj.token) {
                Vue.prototype.$message({
                    'message': '无权访问，请先登录！', 'type': 'warning'
                });
                next({path: '/backg/login', query: {url: to.fullPath}});// 无权访问
            }else if(to.meta.grade && to.meta.grade < obj.userInfo.user_type){
                Vue.prototype.$message({
                    'message': '无权访问此页面！', 'type': 'warning'
                });
                NProgress.done();
            } else {
                next(); // 如果有token就正常转向
            }
        });
    } else {
        next();
    }
});

router.afterEach(() => {
    NProgress.done();
});

new Vue({
    router,
    store,
    methods: {
      urljudge:function(){
        var locationUrl = window.location.pathname;
        var locationUrl = locationUrl.substring(0,5);
        storage.get('userInfo',obj=>{
            if (!obj.token) {
                if(locationUrl=="/backg"){
                    this.$router.push("/backg/login")
                }
            }else{
                if(locationUrl =="/backg/login"){
                    this.$router.push("/backg")
                }
            }
        });
      }
    },
    mounted() {
        this.urljudge();
    },
    watch:{
      '$route':function(){
        this.urljudge(); 
      }
    },
    'render': h => h(App)
}).$mount('#app');
