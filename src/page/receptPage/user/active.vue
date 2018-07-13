<template>
    <div class="active">
        {{msg}}
        <a href="/login">去登陆</a>
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
                msg:'',
                data:{
                    name:'',
                    code:''
                }
            }
        },
        methods: {
            
        },
        mounted() {
            this.data.name = this.$route.query.name;
            this.data.code = this.$route.query.code;
            if(this.data.name&&this.data.code){
                ajax.call(this, Action.ACTIVE, this.data, (obj, err) => {
                    console.log(obj)
                    if (!err) {
                        if(obj.code=="000"){
                            this.msg = "账户已激活成功"
                        }else{
                            this.msg = "该账户已激活"
                        }
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
