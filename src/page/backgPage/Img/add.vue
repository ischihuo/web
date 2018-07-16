<template>
    <div class="add-img">
        <el-form ref="form" :model="data" :rules="rules" label-width="80px">
            <el-form-item label="图片名称" prop="img_title">
                <el-input v-model="data.img_title"></el-input>
            </el-form-item>
            <el-form-item  label="图片上传" class="upfile">
                <div class="imgdiv">
                    <img v-show="data.img_path" :src="imgPath+data.img_path">
                </div>
                <el-upload
                    class="upload-demo"
                    drag
                    :action="imgurl"
                    :headers="hders"
                    :on-success="handleAvatarSuccess"
                    :show-file-list="false"
                    :class="{ 'opct':data.img_path }"
                    multiple>
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                </el-upload>
            </el-form-item>
            <el-form-item label="图片描述" prop="img_description">
                <el-input type="textarea" v-model="data.img_description"></el-input>
            </el-form-item>
            <el-form-item label="跳转页面" prop="img_href">
                <el-input v-model="data.img_href"></el-input>
            </el-form-item>
            <el-form-item style="text-align: right">
                <el-button @click="backList">返回列表</el-button>
                <el-button type="primary" :disabled="grade.updateArticle||loading" @click="saveArticle">保存图片</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script type="text/javascript">
    import {ajax,storage} from 'utils';
    import common from 'common';
    import components from 'components';
    module.exports = {
        name: 'list',
        data() {
            return {
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
                userInfo:{},
                read_type: common.user_type,
                loading:false,
                sort_id:[],
                sort_data:[],
                data: {
                    id:0,
                    img_title: '',
                    img_description:'',
                    img_path:'',
                    img_href:'',
                },
                rules: {
                    sort_id:{required: true, message: '分类不能为空'},
                    img_title:[{
                        required: true, message: '图片名称不能为空', trigger: 'change'
                    },{
                        pattern:/^.{1,100}$/, message: '请输入1-100个字符的图片名称', trigger: 'blur'
                    }],
                    img_description:[{
                        required: true, message: '图片简介概要不能为空', trigger: 'change'
                    },{
                        pattern:/^.{5,255}$/, message: '请输入5-255个字符的图片简介', trigger: 'blur'
                    }],
                    img_path: {
                        required: true, message: '跳转页面配置不能为空'
                    }
                },
                defaultProps: {
                    children: 'children',
                    label: 'sort_name',
                    value: 'id'
                }
            }
        },
        methods: {
            handleAvatarSuccess(res, file) {
                this.data.img_path = res.data.filename;
            },
            saveArticle(){
                this.$refs.form.validate(v => {
                    if (v) {
                        this.visible = true;
                        ajax.call(this, Action.UPDATEIMG, this.data, (data, err) => {
                            this.loading = false;
                            if (!err) {
                                this.$message({
                                    message: '保存成功',
                                    type: 'success'
                                });
                                this.$router.push('/backg/img/list');
                            }
                        })
                    }
                });
            },
            formatTooltip(v){
                return common.user_type[v];
            },
            changeContent(v){
                this.data.content = v;
                this.$refs.form.validateField('content');
            },
            upImg(){
                this.$refs.upload.SelectFile();
            },
            backList(){
                this.$router.push('/backg/img/list');
            },
            successUpload(data){
                this.data.pic = data.filename;
                this.data.content += '<img src="'+data.filename+'" />';
            }
        },
        mounted() {
            storage.get('userInfo',obj=>{
                this.data.user_name = obj.userInfo.user_name;
            });
            ajax.call(this, Action.LISTSORT, {}, (data, err) => {
                if (!err) {
                    let arr = data.data;
                    arr.sort((a, b) => a.parent_id > b.parent_id ? 1 : -1);
                    for (let i = arr.length; i--;) {
                        if (arr[i].parent_id) {
                            let obj = arr.pop();
                            arr.forEach(item => {
                                if (item.id === obj.parent_id) {
                                    item.children = item.children||[];
                                    item.children.push(obj);
                                }
                            })
                        }
                    }
                    this.sort_data = arr;
                    let id = this.$route.params.id;
                    if(id){
                        ajax.call(this, Action.GETIMGBYID, {id}, (obj, err) => {
                            console.log(obj)
                            if (!err) {
                                if(this.userInfo.user_type > 2 && obj.user_id !== this.userInfo.id){
                                    return this.$router.back();
                                }
                                Object.getOwnPropertyNames(this.data).forEach(key => {
                                    this.data[key] = obj[key];
                                });
                                console.log(this.data)
                                try{
                                    this.data.pic = JSON.parse(obj.article_extend).pic;
                                }catch (e){
                                    this.data.pic = '';
                                }
                                //显示分类
                                const cid = obj.sort_id;
                                let hasFind = false;
                                let cb = (array,a)=>{
                                    !hasFind && array && array.forEach(item=>{
                                        a = a||[];
                                        let _a = [].concat(a);
                                        _a.push(item.id);
                                        if(item.id === cid){
                                            hasFind = true;
                                            this.sort_id = _a;
                                        }else{
                                            cb(item.children,_a);
                                        }
                                    })
                                };
                                cb(arr);
                            }
                        })
                    }
                }
            })
        },
        watch: {
            sort_id(val) {
                this.data.sort_id = val.length?val.slice(-1)[0]:'';
            }
        },
        mixins:[common.mixin],
        components
    }
</script>
<style lang="less">
    .add-img {
        .el-input,.el-textarea__inner,.el-slider {
            max-width:60%
        }
        .el-cascader{
            width:100%;
            max-width:60%;
            .el-input{
                width:100%
            }
        }
        .upfile img{
            width: 360px;
            height: 180px;
        }
        .upfile .imgdiv{
            width: 360px;
            height: 200px;
        }
        .upload-demo{
            position: absolute;
            margin-top: -200px;
        }
        .opct{
            opacity: 0;
        }
        .upload-demo{
            z-index: 999;
        }
    }
</style>
