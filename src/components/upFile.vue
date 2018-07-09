<template>
   <input style="display: none" type="file" name="file"  ref="input" />
</template>

<script>
    import {ajax} from 'utils';
    import common from 'common';
    import ElButton from "../../node_modules/element-ui/packages/button/src/button";
    export default {
        components: {ElButton},
        name: 'upFile',
        props: {
            
        },
        methods:{
            
        }
    }
</script>
