<template>
  <div class="propage contbody" style="height: 100%;">
    <div class="block" v-html="data.content">
      
    </div>
  </div>
</template>
<!--type="ecmascript-6"-->
<script>
  import {ajax,storage} from 'utils';
  export default {
    methods: {
      ajaxData(){
          console.log(1)
        let id = this.$route.query.id;
        if(id){
            ajax.call(this, Action.GETARTICLEBYID, {id}, (obj, err) => {
                console.log(obj)
                if (!err) {
                    this.data = obj;
                }
            })
        }
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
        data:'',
      };
    },
  }

</script>

<style lang="less">
  .indexpage{
  }
  
</style>
