<template>
  <div class="proadd contbody" style="height: 100%;">
    <div class="proname">发布产品</div>
    <div class="formcont">
      <el-steps :active="1">
        <el-step title="产品简介" icon="el-icon-edit"></el-step>
        <el-step title="产品详情" icon="el-icon-upload"></el-step>
        <el-step title="完成填报" icon="el-icon-picture"></el-step>
      </el-steps>
      <!-- <div @click="dialogVisible=true">新增定位信息:{{address}}</div> -->
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="产品名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="展示图片" prop="region">
          <el-upload
            class="avatar-uploader"
            :action="imgurl"
            :headers="hders"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imgPath+imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">下一步</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
    </el-form>
    </div>
    <el-dialog
      title="选择定位"
      :visible.sync="dialogVisible">
        <baidu-map class="bm-view" :center="center" :zoom="zoom" @ready="handler">
          <bm-map-type :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_LEFT"></bm-map-type>
        </baidu-map>
    </el-dialog>
  </div>
</template>
<!--type="ecmascript-6"-->
<script>
  import {ajax,storage} from 'utils';
  export default {
    methods: {
      handleAvatarSuccess(res, file) {
        this.imageUrl = file.response.data.filename;
      },
      beforeAvatarUploadimg(file){
        this.imageFileName.push(file.name);
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
      handler ({BMap, map}) {
        console.log(BMap, map)
        var _this = this;
        // var point = new BMap.Point(116.417854,39.921988);
        // var marker = new BMap.Marker(point);  // 创建标注
        // map.addOverlay(marker);   
        // map.enableScrollWheelZoom(true); 
        // map.centerAndZoom(point, 15);
        map.enableScrollWheelZoom();
        map.enableInertialDragging();

        map.enableContinuousZoom();

        map.addControl(new BMap.CityListControl({
            // 切换城市之间事件
            // onChangeBefore: function(){
            //    alert('before');
            // },
            // 切换城市之后事件
            // onChangeAfter:function(){
            //   alert('after');
            // }
        }));
        map.addEventListener("click",function(e){
          var infoWindow = new BMap.InfoWindow ("地址：北京市东城区王府井大街88号乐天银泰百货八层", opts);  // 创建信息窗口对象 
          var opts = {
            width : 200,     // 信息窗口宽度
            height: 100,     // 信息窗口高度
            title : "海底捞王府井店" , // 信息窗口标题
            enableMessage:true,//设置允许信息窗发送短息
            message:"亲耐滴，晚上一起吃个饭吧？戳下面的链接看下地址喔~"
          }
          if(_this.marker){
            map.removeOverlay(_this.marker);
          }
          _this.lng = e.point.lng;
          _this.lat = e.point.lat;
          var point = new BMap.Point(_this.lng,_this.lat);
          _this.marker = new BMap.Marker(point);  // 创建标注
          map.addOverlay(_this.marker);   
          map.enableScrollWheelZoom(true); 
          map.centerAndZoom(point, 15);
          //新增标注
          var pt = e.point;
          var geoc = new BMap.Geocoder();   
          geoc.getLocation(pt, function(rs){
            var addComp = rs.addressComponents;
            // alert(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
            _this.ruleForm.address = addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber;
          });   
          //定位信息
        });
        // marker.addEventListener("click", function(){          
        //   map.openInfoWindow(infoWindow,point); //开启信息窗口
        // });
        
      },
      provchange(value,type){
        let obj = {};
        obj = this.provoptions.find((item)=>{
            return item.code === value;
        });
        this.cityoptions = obj.children;
        if(type!==1){
          this.ruleForm.areaCity = "";
          this.ruleForm.areaCou = "";
        }
        // this.form.areaProv = obj.name
        //this.couoptions = [];
      },
      citychange(value,type){
        let obj = {};
        obj = this.cityoptions.find((item)=>{
            return item.code === value;
        });
        if(type!==1){
          this.ruleForm.areaCou = "";
        }
        // this.form.areaCity = obj.name
        this.couoptions = obj.children;
        //this.areaCity = false;
      },
      couchange(value){
        let obj = {};
        obj = this.couoptions.find((item)=>{
            return item.code === value;
        });
        //this.ruleForm = false;
        // this.form.areaCou = obj.name;
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.imageUrl = ""
      }
    },
    mounted() {
        console.log(this.dataStore.getType("SubAreas"))
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
        provoptions:[],
        cityoptions:[],
        couoptions:[],
        center: '北京',
        zoom: 11,
        dialogVisible:false,
        address:'',
        ruleForm: {
          name: '',
          region: '',
          type: [],
          resource: '',
          desc: '',
          areaProv:'',
          areaCity:'',
          areaCou:'',
          address:''
        },
        rules: {
          name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          region: [
            { required: true, message: '请选择活动区域', trigger: 'change' }
          ],
          date1: [
            { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
          ],
          date2: [
            { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
          ],
          type: [
            { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
          ],
          resource: [
            { required: true, message: '请选择活动资源', trigger: 'change' }
          ],
          desc: [
            { required: true, message: '请填写活动形式', trigger: 'blur' }
          ],
          areaProv: [
            { required: true, message: ' ', trigger: 'change'}
          ],
          areaCity: [
            { required: true, message: ' ', trigger: 'change' }
          ],
          areaCou: [
            { required: true, message: ' ', trigger: 'change' }
          ],
        }
      };
    },
  }

</script>

<style lang="less">
  .proadd{
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
    }
    .address.el-form-item{
      width: 240px;
      float: left;
    }
    .addressx img{
      width: 30px;
      position: absolute;
      right: 5px;
      margin-top: -35px;
      cursor: pointer;
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
    // dialog地图样式
    .bm-view{
      width: 100%;
      height: 500px;
    }
    .anchorBL {
      display:none
    }
    .el-dialog{
      min-width: 800px !important;
      height: 600px;
    }
    .el-dialog__body{
      padding-top: 0px;
    }
  }
  
</style>
