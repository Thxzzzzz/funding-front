<template>
  <div>
    <y-shelf title="售后服务">
      <div slot="content">
        <div style="padding: 100px 0;text-align: center">
          <img src="/static/images/support.png">
          <br>
          <span class="support">请联系产品对应的供应商~</span>
        </div>
      </div>
    </y-shelf>
  </div>
</template>
<script>
  import YShelf from '/components/shelf'
  export default {
    components: {
      YShelf
    }
  }
</script>
<style lang="scss" scoped>
  .support {
    line-height: 2em;
    font-size: 22px;
    color: #999;
  }
</style>
