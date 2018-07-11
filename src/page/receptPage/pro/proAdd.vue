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
        <el-form-item label="展示图片" prop="img_path">
          <el-upload
            class="avatar-uploader"
            :action="imgurl"
            :headers="hders"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="img_path" :src="imgPath+img_path" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <el-input type="hidden" v-model="ruleForm.img_path"></el-input>
        </el-form-item>
        <!-- <el-form-item label="活动时间" required>
          <el-col :span="11">
            <el-form-item prop="date1">
              <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.date1" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-form-item prop="date2">
              <el-time-picker type="fixed-time" placeholder="选择时间" v-model="ruleForm.date2" style="width: 100%;"></el-time-picker>
            </el-form-item>
          </el-col>
        </el-form-item> -->
        <!-- <el-form-item label="即时配送" prop="delivery">
          <el-switch v-model="ruleForm.delivery"></el-switch>
        </el-form-item> -->
        <el-form-item  class="addresslist" label="行政区划">
          <el-form-item class="address" prop="area_prov">
            <el-select v-model="ruleForm.area_prov" placeholder="请选择省份" @change="provchange">
              <el-option
                v-for="item in provoptions"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="address" prop="area_city">
            <el-select v-model="ruleForm.area_city" placeholder="请选择市" @change="citychange">
              <el-option
                v-for="item in cityoptions"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="address"  prop="area_cou">
            <el-select v-model="ruleForm.area_cou" placeholder="请选择县/区" @change="couchange">
              <el-option
                v-for="item in couoptions"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form-item>
        <el-form-item label="详细地址" class="addressx" prop="address">
          <el-input v-model="ruleForm.address"></el-input>
          <img src="../../../../static/image/addres.jpg" alt="点击定位" @click="dialogVisible=true">
        </el-form-item>
        <el-form-item label="开放权限" prop="read_type">
          <el-radio-group v-model="ruleForm.read_type">
            <el-radio label="0">公开</el-radio>
            <el-radio label="1">粉丝可看</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item label="活动形式" prop="desc">
          <el-input type="textarea" v-model="ruleForm.desc"></el-input>
        </el-form-item> -->
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
          <bm-map-type  anchor="BMAP_ANCHOR_TOP_LEFT"></bm-map-type>
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
        this.img_path = file.response.data.filename;
        this.ruleForm.img_path = file.response.data.filename;
      },
      beforeAvatarUpload(file){
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
          //map.centerAndZoom(point, 15);
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
          this.ruleForm.area_city = "";
          this.ruleForm.area_cou = "";
        }
        // this.form.area_prov = obj.name
        //this.couoptions = [];
      },
      citychange(value,type){
        let obj = {};
        obj = this.cityoptions.find((item)=>{
            return item.code === value;
        });
        if(type!==1){
          this.ruleForm.area_cou = "";
        }
        // this.form.area_city = obj.name
        this.couoptions = obj.children;
        //this.area_city = false;
      },
      couchange(value){
        let obj = {};
        obj = this.couoptions.find((item)=>{
            return item.code === value;
        });
        //this.ruleForm = false;
        // this.form.area_cou = obj.name;
      },
      submitForm(formName) {
        var _this = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // alert('submit!');
            // ajax.call(this, Action.ADDPRO, this.ruleForm, (obj, err) => {
            //   console.log(obj)
            //     if (!err) {
            //       this.$router.push('/proDetailsAdd');
            //     }
            // });
            _this.setCookie("proinfo1",JSON.stringify(this.ruleForm))
            this.$router.push('/proDetailsAdd');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.img_path = ""
      }
    },
    mounted() {
        console.log(this.dataStore.getType("SubAreas"))
        this.provoptions = this.dataStore.getType("SubAreas")[0].children;
        if(this.getCookie("proinfo1")){
          this.ruleForm = JSON.parse(this.getCookie("proinfo1"))
          this.img_path = this.ruleForm.img_path;
          console.log(this.img_path)
        }
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
        img_path: '',
        provoptions:[],
        cityoptions:[],
        couoptions:[],
        center: '北京',
        zoom: 11,
        dialogVisible:false,
        address:'',
        ruleForm: {
          name: '',
          img_path: '',
          type: [],
          read_type: '0',
          desc: '',
          area_prov:'',
          area_city:'',
          area_cou:'',
          address:''
        },
        rules: {
          name: [
            { required: true, message: '请输入商品名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          img_path: [
            { required: true, message: '请上传展示图片', trigger: 'change' }
          ],
          read_type: [
            { required: true, message: '请选择查看权限', trigger: 'change' }
          ],
          area_prov: [
            { required: true, message: ' ', trigger: 'change'}
          ],
          area_city: [
            { required: true, message: ' ', trigger: 'change' }
          ],
          area_cou: [
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