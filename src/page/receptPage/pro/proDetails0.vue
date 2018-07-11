<template>
  <div class="proDetails contbody" >
    <div class="titlenm">{{data.title}}</div>
    <div class="titledetail" v-for="item in data.detail.imglist" :key="item.id">
      <img :src="imgPath+item.imageUrl" alt="">
      <div>{{item.name}}</div>
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
      if(this.getCookie('proinfo1')){
        var proinfo1 = JSON.parse(this.getCookie('proinfo1'));
        this.data.title = proinfo1.name;
        this.data.detail = JSON.parse(this.getCookie('proinfo2'));
        console.log(this.data)
      }
        this.ajaxData();
    },
    components: {
    },
    data() {
      return {
        imgPath:Action.imgPath,
        data:{
          title:'',
          detail:[]
        },
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
      padding: 0 40px;
    }
    .titledetail img{
      width: 1040px;
      height: 500px;
    }
  }
  
</style>
