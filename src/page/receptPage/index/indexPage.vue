<template>
  <div class="indexpage" style="height: 100%;">
    <div class="block contbody">
      <el-carousel height="450px" class="indeximg">
        <el-carousel-item v-for="item in imglist" :key="item">
          <!-- <img :src="imgPath+item.img_path" alt="" style="width:1200;height:450"> -->
        </el-carousel-item>
      </el-carousel>
      <div class="prolist" v-for="item in prolist" :key="item">
        <div class="proli">
          <img :src="imgPath+item.art_img" :alt="item.title">
          <div>{{item.title}}</div>
        </div>
        
      </div>
    </div>
  </div>
</template>
<!--type="ecmascript-6"-->
<script>
  import {ajax,storage} from 'utils';
  export default {
    methods: {
      ajaxData(){
          ajax.call(this, Action.GETINDEXIMG, {}, (obj, err) => {
            console.log(obj)
              if (!err) {
                this.imglist = obj.data
              }
          });
          ajax.call(this, Action.GETLISTARTICLE, {}, (obj, err) => {
            console.log(obj)
              if (!err) {
                this.prolist = obj.data
              }
          });
          
      },
    },
    mounted() {
        this.ajaxData();
    },
    components: {
    },
    data() {
      return {
        imgPath:Action.imgPath,
        imglist:[],
        prolist:[],
      };
    },
  }

</script>

<style lang="less">
  .indexpage{
    .el-carousel__item h3 {
      color: #475669;
      font-size: 14px;
      opacity: 0.75;
      line-height: 150px;
      margin: 0;
    }

    .el-carousel__item:nth-child(2n) {
      background-color: #99a9bf;
    }
    
    .el-carousel__item:nth-child(2n+1) {
      background-color: #d3dce6;
    }
    .contbody{
      width: 1200px;
      border: none;
      margin: 0 auto;
    }
    .indeximg img{
      width: 1200px;
      height: 450px;
    }
    .proli{
      width: 280px;
      height: 80px;
    }
    .proli img{
      width: 280px;
      height: 60px;
    }
  }
  
</style>
