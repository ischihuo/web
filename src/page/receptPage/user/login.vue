<template>
    <div class="loginq">
        <el-form ref="form" :model="data" :rules="rules" label-width="80px">
            <el-form-item label="用户帐号" prop="user_name">
                <el-input  v-model="data.user_name"></el-input>
            </el-form-item>
            <el-form-item label="用户密码" prop="pass_word">
                <el-input type="password" v-model="data.pass_word"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" :disabled="grade.updateUser||loading" @click="saveUser">登录</el-button>
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
            const _this = this;
            return {
                page_grade:common.page_grade,
                grade:{
                    updateUser:!0,
                    upFile:!0,
                },
                user_type: common.user_type,
                loading:false,
                err:'',
                data: {
                    user_name: '',
                    pass_word:'',
                },
                rules: {
                    user_name: [{
                        required: true,
                        message: '用户帐号不能为空！',
                        trigger: 'change'
                    }, {
                        validator: (rule, value, callback) => {
                            if (!common.name_reg.test(value)) {
                                callback(new Error(common.name_txt));
                            } else if (_this.err.includes('帐号')) {
                                callback(new Error(_this.err));
                            } else {
                                callback();
                            }
                        },
                        trigger: 'change'
                    }],
                    pass_word: [{
                        required: true,
                        message: '密码不能为空！',
                        trigger: 'change'
                    }, {
                        pattern: common.pass_reg,
                        message: common.pass_txt,
                        trigger: 'change'
                    }],
                }
            }
        },
        methods: {
            saveUser(){
                this.$refs.form.validate(v => {
                    if (v) {
                        this.visible = true;
                        //this.data.article_extend = JSON.stringify({pic:this.data.pic});
                        ajax.call(this, Action.LOGIN, this.data, (data, err) => {
                            this.loading = false;
                            if (!err) {
                                this.$router.push('/');
                            }else{
                                this.err = err;
                                if (err.includes('帐号') || err.includes('邮箱')) {
                                    this.$refs.form.validateField(err.includes('帐号') ? 'user_name' : 'user_email');
                                }
                            }
                        })
                    }
                });
            },
            upImg(){
                this.$refs.upload.SelectFile();
            },
            backList(){
                this.$router.push('/backg/user/list');
            },
            successUpload(data){
                this.data.user_pic = data.filename;
            }
        },
        mounted() {
            let id = this.$route.params.id;
            if(id) {
                ajax.call(this, Action.LOGIN, {id}, (obj, err) => {
                    if (!err) {
                        Object.getOwnPropertyNames(this.data).forEach(key => {
                            if(key !== 'pass_word'){
                                this.data[key] = obj[key]+'';
                            }
                        });
                        this.data.pass_word = common.defaultPassword;
                    }
                })
            }
         },
        watch: {
            'data.user_name'(){
                if(this.err.includes('帐号'))this.err = '';
            },
            'data.user_email'(){
                if(this.err.includes('邮箱'))this.err = '';
            }
        },
        mixins:[common.mixin],
        components
    }
</script>
<style lang="less">

</style>
