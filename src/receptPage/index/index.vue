<template>
  <div style="height: 100%;">
    <v-header></v-header>
    <div class="midcontent clearfloat">
      <div class="contont clearfloat">
          <router-view></router-view>
      </div>
    </div>
    <v-footer></v-footer>
  </div>
</template>
<!--type="ecmascript-6"-->
<script>
  import header from '../header/header'
  import footer from '../footer/footer'

  export default {
    methods: {
    },
    components: {
      'v-header': header,
      'v-footer': footer
    },
    data() {
      return {};
    },
  }

</script>

<style type="text/css">
  html,
  body {
    margin: 0
  }

  #app {
    background: #f2f2f2
  }

  .midcontent {
    padding-top: 68px;
  }

</style>
