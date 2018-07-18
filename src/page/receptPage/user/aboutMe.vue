<template>
    <div class="aboutMe">
        <div class="header">
            <img src="http://localhost:3001/upFile/1531726764794.jpg" alt="">
        </div>
    </div>
</template>
<script type="text/javascript">
    import {ajax,storage} from 'utils';
    import common from 'common';
    import components from 'components';
    module.exports = {
        data() {
            return {

            }
        },
        methods: {
        },
        mounted() {
         },
        watch: {
        },
        mixins:[common.mixin],
        components
    }
</script>
<style lang="less">
.aboutMe{
    .header{
        padding: 40px 0;
        background-color: #f1f1f1;
        text-align: center;
    }
    .header img{
        width: 100px;
        height: 100px;
        border: 1px solid #eee;
        border-radius: 50px;
    }
}
</style>
