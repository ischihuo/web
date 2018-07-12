<template>
  <div class="proDetailsAdd contbody" style="height: 100%;">
    <div class="proname">发布产品</div>
    <div class="formcont clearfloat">
    <el-steps :active="2">
      <el-step title="产品简介" icon="el-icon-edit"></el-step>
      <el-step title="产品详情" icon="el-icon-upload"></el-step>
      <el-step title="完成填报" icon="el-icon-picture"></el-step>
    </el-steps>
    <div tabindex="0" class="fl prolistadd">
      <div class="prolist" v-if="imglist" v-for="(item,index) in imglist" :key="item.id">
        <img :src="imgPath+item.imageUrl" :alt="item.imageUrl" :title="item.name" @click="imgsee(index)">
      </div>
      <i class="el-icon-plus avatar-uploader-icon" @click="resetForm()"></i>
      <el-button type="primary" @click="seeprohtml()">预览</el-button>
      <el-button type="primary" @click="submit">保存</el-button>
    </div>
    <div class="fl addimgmsg">
      <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="展示图片" prop="region">
          <el-upload
            class="avatar-uploader"
            :action="imgurl"
            :headers="hders"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUploadimg">
            <img v-if="imageUrl" :src="imgPath+imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <el-input type="hidden" v-model="ruleForm.imageUrl"></el-input>
        </el-form-item>
        <el-form-item label="图片介绍" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
          <el-button type="primary" v-if="imglist.length&&flag" @click="deleteimg">删除</el-button>
          <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
        </el-form-item>
    </el-form>
    </div>
    </div>
  </div>
</template>
<!--type="ecmascript-6"-->
<script>
  import {ajax,storage} from 'utils';
  export default {
    methods: {
      handleAvatarSuccess(res, file) {
        this.imageUrl = file.response.data.filename;
        this.ruleForm.imageUrl = file.response.data.filename;
      },
      beforeAvatarUploadimg(file){
        const isJPG = file.type === 'image/jpeg';
        const isGIF = file.type === 'image/gif';
        const isPNG = file.type === 'image/png';
        const isBMP = file.type === 'image/bmp';
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isJPG && !isGIF && !isPNG && !isBMP&& !isJPEG) {
            this.$alert('上传图片必须是JPG/GIF/PNG/BMP/jpeg 格式!');
        }
        if (!isLt10M) {
            this.$alert('上传图片大小不能超过 10MB!');
        }
        return (isJPG || isBMP || isGIF || isPNG) && isLt10M;
      },
      ajaxData(){
      },
      resetForm(formName) {
        if(!this.imglist.length){
          this.$alert("请保存后新增其它图片信息")
        }else{
          this.imftype = false;
          this.flag = false;
          this.ruleForm={
            name: '',
            imageUrl: '',
          }         
          this.imageUrl = "";
        }
       
      },
      imgsee(eve){
        this.index = eve;
        //this.ruleForm.name = this.imglist[eve].name;
        //console.log(this.ruleForm.name)
        //this.imageUrl = this.ruleForm.imageUrl = this.imglist[eve].imageUrl;
        this.ruleForm = {
          name: this.imglist[eve].name,
          imageUrl: this.imglist[eve].imageUrl,
        }
        this.imageUrl = this.imglist[eve].imageUrl;
        this.flag = true;
        this.imftype = true;
      },
      deleteimg(){
        this.imglist.splice(this.imglist.findIndex(item => item.imageUrl === this.ruleForm.imageUrl), 1)
        this.flag = false;
        this.ruleForm={
          name: '',
          imageUrl: '',
        }         
        this.imageUrl = "";
      },
      submitForm(){
        if(!this.imftype&&!this.index){
          this.imglist.push(this.ruleForm)
        }else{
          this.imglist[this.index] = this.ruleForm;
        }
        this.index = '';
      },
      seeprohtml(){
        this.setCookie('proinfo2',JSON.stringify({'imglist':this.imglist}))
        window.open('/proDetails');
      },
      submit(){
        var _this = this;
        this.data = JSON.parse(this.getCookie("proinfo1"));
        this.data.imglist = [];
        this.imglist.forEach(function(v,k){
          _this.data.imglist.push(JSON.stringify(v))
        })
        //this.data.imglist.join('-')
        //this.data.imglist = this.imglist;
        console.log(this.data)
        console.log(JSON.stringify(this.data.imglist).split('-'))
        ajax.call(this, Action.ADDPRO, this.data, (obj, err) => {
          console.log(obj)
            if (!err) {
              this.setCookie('proinfo1','')
              this.setCookie('proinfo2','')
              this.$router.push('/proAddSuccess');
            }
        });
      }
    },
    mounted() {
        this.provoptions = this.dataStore.getType("SubAreas")[0].children;
        this.ajaxData();
    },
    components: {
    },
    data() {
      return {
        dataStore:$(window).DataStore(),
        imgPath:Action.imgPath,
        imgurl:Action.UPFILE, 
        hders:{
            Authorization:storage.get('userInfo').token || '',
            },
        imageUrl: '',
        data:{
          imglist:[]
        },
        ruleForm: {
          name: '',
          imageUrl: '',
        },
        imftype:false,
        imglist:[],
        flag:false,
        index:'',
      };
    },
  }

</script>

<style lang="less">
  .proDetailsAdd{
    .proname{
      height: 60px;
      line-height: 60px
    }
    .formcont{
      padding: 0 100px
    }
    .el-steps--horizontal{
      width: 800px;
      margin: 30px auto 0;
    }
    .el-step__main{
      margin-left: -13px;
    }
    //表单样式
    .demo-ruleForm{
      margin-top: 40px;
      width: 280px;
      float: left;
    }
    // 上传部分样式
    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
      border-color: #409EFF;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .addimgmsg{
      width: 600px;
      min-height: 400px;
      height: auto;
      border-left: 1px solid #eee;
      border-bottom: 1px solid #eee;
      margin-left: 20px;
    }
    .prolistadd{
      width: 178px;
    }
    .prolistadd:focus{
      outline: none;
    }
    .prolistadd i{
      border: 1px dashed #d9d9d9;
      cursor: pointer;
    }
    .prolist img{
      width: 178px;
      height: 178px;
      border: 1px dashed #d9d9d9;
      cursor: pointer;
    }
  }
  
</style>
