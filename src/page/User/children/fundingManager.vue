// TODO 我的众筹  管理众筹商品
<template>
  <div>
    <y-shelf title="我的众筹">
      <div slot="content">
        <div style="">
          <div class="funcZone">
            <el-button type="primary"
                       @click="newFunding()"> 发起众筹 </el-button>

          </div>
          <div class="fundingListZone">
            <span class="support">我的众筹</span>
          </div>
        </div>
      </div>
    </y-shelf>
  </div>
</template>
<script>
  import YShelf from '/components/shelf'
  export default {
    data () {
      return {
  
      }
    },
    methods: {
      newFunding () {
        this.$router.push({path: '/user/' + 'newFunding'})
      },
      editFunding (orderId) {
        this.$router.push({
          path: '/user/' + 'newFunding',
          query: {
            orderId: orderId
          }
        })
      }
    },
    created () {
  
    },
    components: {
      YShelf
    }
  }
</script>
<style lang="scss" scoped>
  .funcZone {
    float: right;
    margin: 10px;
  }
  .fundingListZone {
      padding: 100px 0;
      text-align: center;
  }
  .support {

    line-height: 2em;
    font-size: 22px;
    color: #999;
  }
</style>
