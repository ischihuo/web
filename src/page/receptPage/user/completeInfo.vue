<template>
    <div class="contbody completeInfo">
        <el-form ref="form" :model="data" label-width="80px">
            <el-form-item label="用户昵称" prop="user_name">
                <el-input  v-model="data.user_name" placeholder="请输入用户昵称"></el-input>
            </el-form-item>
            <el-form-item  label="用户头像" class="upfile">
                <!-- <div class="imgdiv">
                    <img v-show="data.icon_path" :src="imgPath+data.icon_path">
                </div>  -->
                <el-upload
                    class="upload-demo"
                    drag
                    :action="imgurl"
                    :headers="hders"
                    :on-success="handleAvatarSuccess"
                    :show-file-list="false"
                    multiple>
                    <div v-if="!data.icon_path" class="el-upload__text">自定义上传</div>
                    <img v-if="data.icon_path" :src="imgPath+data.icon_path" class="avatar">
                </el-upload>
                <div @click="dialogVisible=true" class="choosetx">选择系统头像</div>
                <input type="hidden" v-model="data.icon_path">
            </el-form-item>
            <el-form-item label="出生日期">
                <el-date-picker
                v-model="data.birthday"
                align="right"
                type="date"
                placeholder="选择出生日期"
                :picker-options="pickerOptions">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="性别">
                <el-select v-model="data.sex" placeholder="请选择性别">
                    <el-option
                    v-for="item in sexlist"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="爱好">
                <el-checkbox-group 
                    v-model="hobby"
                >
                    <el-checkbox v-for="hobby in hobbylist" :label="hobby.value" :key="hobby.label">{{hobby.label}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="自我描述">
                <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入自我描述"
                v-model="data.user_intro">
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" :disabled="grade.updateUser" @click="updtuser">注册</el-button>
            </el-form-item>
        </el-form>
        <!-- 头像选择 -->
        <el-dialog
            title="系统头像"
            :visible.sync="dialogVisible"
            width="560px">
            <div class="imglist clearfloat">
                <div class="imgli fl" v-for="item in imglist" :key="item.id">
                    <img :src="imgPath+item.src" :data-src="item.src" alt="" @click="choosetx($event)">
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="affirmtx">确 定</el-button>
            </div>
            </el-dialog>
    </div>
</template>
<script type="text/javascript">
    import {ajax,storage} from 'utils';
    import common from 'common';
    import components from 'components';
    module.exports = {
        name: 'list',
        data() {
            const _this = this;
            return {
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    }
                },
                dialogVisible:false,
                imgPath:Action.imgPath,
                page_grade:common.page_grade,
                hders:{
                    Authorization:storage.get('userInfo').token || '',
                    },
                imgurl:Action.UPFILE,
                grade:{
                    updateArticle: !0,
                    upFile: !0
                },
                imglist:[{
                    'name':'系统头像0',
                    'src':'/icon/tx0.jpg'
                },{
                    'name':'系统头像1',
                    'src':'/icon/tx1.jpg'
                },{
                    'name':'系统头像2',
                    'src':'/icon/tx2.jpg'
                },{
                    'name':'系统头像3',
                    'src':'/icon/tx3.jpg'
                },{
                    'name':'系统头像4',
                    'src':'/icon/tx4.jpg'
                }],
                sexlist:[{
                    'label':'男',
                    'value':'1'
                },{
                    'label':'女',
                    'value':'2'
                },{
                    'label':'其他',
                    'value':'9'
                },{
                    'label':'未知',
                    'value':'0'
                }],
                data: {
                    user_name:'',
                    icon_path:'',
                    birthday:'',
                    sex:'',
                    hobby:[],
                    user_intro:'',
                    age:'',
                },
                hobby:[],
                hobbylist:[{
                    'value':'0',
                    'label':'垂垂老矣'
                },{
                    'value':'1',
                    'label':'风华正茂'
                }],
                rules: {
                    user_name: [{
                        required: true,
                        message: '用户帐号不能为空！',
                        trigger: 'change'
                    }]
                }
            }
        },
        methods: {
            handleAvatarSuccess(res, file) {
                this.data.icon_path = res.data.filename;
            },
            affirmtx(){
                this.data.icon_path = this.txsrc;
                this.dialogVisible = false;
            },
            choosetx(eve){
                this.txsrc = $(eve.target).attr('data-src');
                $(".imgli").removeClass("txborder");
                $(eve.target).closest('.imgli').addClass('txborder');
            },
            updtuser(){
                this.data.hobby = this.hobby.join('-');
                ajax.call(this, Action.UPDTUSERINFO, this.data, (obj, err) => {
                    if (!err) {
                        console.log(obj)
                    }
                })
            },
        },
        mounted() {
                ajax.call(this, Action.GETUSERINFO, {}, (obj, err) => {
                    if (!err) {
                        this.data = obj.result;
                        if(this.data.hobby){
                            this.hobby = this.data.hobby.split("-")
                        }
                    }
                })
         },
        watch: {
        },
        mixins:[common.mixin],
        components
    }
</script>
<style lang="less">
    .completeInfo{
        .imglist img{
            width:100px;
            height: 100px;;
            border-radius: 50px;
        }
        .imglist .imgli{
            width:110px;
            height: 110px;
            margin: 0 10px 10px;
            padding: 5px;
            overflow: hidden;
            border: 1px solid #fff;
        }
        .el-upload-dragger {
            width: 100px;
            height: 100px;
            border-radius: 50px;
        }
        .el-upload-dragger .el-upload__text{
            line-height: 100px;
        }
        .el-upload-dragger img{
            width: 100px;
            height: 100px;
            border-radius: 50px;
        }
        .choosetx{
            width: 100px;
            cursor: pointer;
        }
        .imgdiv img{
            width: 100px;
            height: 100px;
            border-radius: 50px;
        }
        .txborder{
            border: 1px solid #c6e2ff !important;
        }
    }
</style>
