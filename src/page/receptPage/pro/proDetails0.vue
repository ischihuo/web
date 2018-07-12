<template>
  <div class="proDetails contbody" >
    <div class="titlenm">{{data.name}}</div>
    <div class="titledetail" v-for="item in data.imglist" :key="item.id">
      <img :src="imgPath+item.img_path" alt="">
      <div>{{item.img_title}}</div>
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
          this.data = proinfo1.name;
          this.data.imglist = JSON.parse(this.getCookie('proinfo2'));
          console.log(this.data)
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
