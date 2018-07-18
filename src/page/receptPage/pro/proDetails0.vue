<template>
  <div class="proDetails contbody" >
    <div class="titlenm">{{data.name}}</div>
    <div class="titledetail" v-for="item in data.imglist" :key="item.id">
      <img :src="imgPath+item.img_path" alt="">
      <div class="imgtitle">{{item.img_title}}</div>
    </div>
    <div class="collect">
      <i :class="collect"></i>
      <span>已收藏</span>
    </div>
  </div>
</template>
<!--type="ecmascript-6"-->
<script>
  import {ajax,storage} from 'utils';
  export default {
    methods: {
      ajaxData(){
        
      },
    },
    mounted() {
      let id = this.$route.query.id;
      if(id){
        ajax.call(this, Action.GETPROBYID, {id}, (obj, err) => {
          console.log(obj)
            if (!err) {
              this.data = obj;
              console.log(this.data)
            }
        });
      }else{
        if(this.getCookie('proinfo1')){
          var proinfo1 = JSON.parse(this.getCookie('proinfo1'));
          this.data = proinfo1;
          this.data.imglist = JSON.parse(this.getCookie('proinfo2')).imglist;
          console.log(JSON.parse(this.getCookie('proinfo2')))
        }
      }
        this.ajaxData();
    },
    components: {
    },
    data() {
      return {
        imgPath:Action.imgPath,
        data:{
          name:'',
          imglist:[]
        },
        collect:'el-icon-star-off'
      };
    },
  }

</script>

<style lang="less">
  .proDetails{
    .titlenm{
      text-align: center;
      font-size: 24px;
      height: 30px;
      line-height: 30px;
      margin-bottom: 20px;
    }
    .titledetail{
      font-family: 'KaiTi';
      padding: 0 140px;
      margin: 10px 0;
    }
    .titledetail .imgtitle{
      padding: 10px;
      background: #f1f1f1;
      color: #000;
    }
    .titledetail img{
      width: 840px;
      height: 400px;
    }
    .collect{
      width: 60px;
      margin: 0 auto;
      text-align: center;
      cursor: pointer;
    }
    .collect i{
      width: 60px;
      font-size: 25px;
    }
  }
  
</style>
