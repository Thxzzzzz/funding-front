// TODO 我的众筹  管理众筹商品
<template>
  <div>
    <y-shelf title="我的众筹">
      <div slot="content">
        <div style="padding: 100px 0;text-align: center">
          <span class="support">我的众筹</span>
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
