// TODO 我的众筹  管理众筹商品
<template>
  <div>
    <y-shelf title="我的众筹">
      <div slot="content">
        <div class="content">
          <div class="funcZone">
            <el-button type="primary"
                       @click="newFunding()"> 发起众筹 </el-button>
          </div>
          <div class="fundingListZone">
            <!-- 审核未通过众筹 -->
            <div>
              <h1>审核未通过众筹</h1>
              <div class="bottomLine"></div>
              <div class="productBox">
                <mall-goods :canEdit="true"
                            :hideDetailBt="true"
                            v-for="(item,i) in VerifyFailProducts"
                            :key="i"
                            :msg="item"></mall-goods>
              </div>
            </div>

            <!-- 待提交众筹 -->
            <div class="typeZone">
              <h1>待提交众筹</h1>
              <div class="bottomLine"></div>
              <div class="productBox">
                <mall-goods v-for="(item,i) in VerifyUnsubmitProducts"
                            :key="i"
                            :hideDetailBt="true"
                            :canEdit="true"
                            :msg="item"></mall-goods>
              </div>
            </div>

            <!-- 待审核众筹 -->
            <div class="typeZone">
              <h1>待审核众筹</h1>
              <div class="bottomLine"></div>
              <div class="productBox">
                <mall-goods v-for="(item,i) in VerifyWaitProducts"
                            :key="i"
                            :hideDetailBt="true"
                            :canEdit="true"
                            :msg="item"></mall-goods>
              </div>
            </div>

            <!-- 进行中众筹 -->
            <div class="typeZone">
              <h1>进行中众筹</h1>
              <div class="bottomLine"></div>
              <div class="productBox">
                <mall-goods v-for="(item,i) in FundingIngProducts"
                            :key="i"
                            :msg="item"></mall-goods>
              </div>
            </div>

            <!-- 成功的众筹 -->
            <div class="typeZone">
              <h1>成功的众筹</h1>
              <div class="bottomLine"></div>
              <div class="productBox">
                <mall-goods v-for="(item,i) in FundingSuccessProducts"
                            :key="i"
                            :msg="item"></mall-goods>
              </div>
            </div>

            <!-- 失败的众筹 -->
            <div class="typeZone">
              <h1>失败的众筹</h1>
              <div class="bottomLine"></div>
              <div class="productBox">
                <mall-goods v-for="(item,i) in FundingFailProducts"
                            :key="i"
                            :msg="item"></mall-goods>
              </div>
            </div>

          </div>
        </div>
      </div>
    </y-shelf>
  </div>
</template>
<script>
  import YShelf from '/components/shelf'
  import mallGoods from '/components/mallGoods'

  import { allProductBySellerId } from '/api/goods'

  const FundingStatus_Success = 1 // 众筹成功
  const FundingStatus_Fail = 2 // 众筹失败
  const FundingStatus_Ing = 3 // 正在众筹

  // const Verify_All = 0 // 全部状态
  const Verify_Success = 1 // 已通过
  const Verify_Wait = 2 // 未审核
  const Verify_UnSubmit = 3 // 未提交审核
  const Verify_Fail = 4 // 未通过
  
  export default {
    components: {
      YShelf, mallGoods
    },
    data () {
      return {
        products: []
      }
    },
    computed: {
      converToProductId (product) {
        product.product_id = product.id
        return
      },
      VerifyFailProducts () {
        // 筛选
        let list = this.products.filter(function (product) {
          return product.verify_status === Verify_Fail
        })
        // 将 id 转成 product_id mallgood 组件才能正确处理
        list = list.map(function (product) {
          product.product_id = product.id
          product.verify_status = product.verify_status
          return product
        })

        return list
      },

      VerifyUnsubmitProducts () {
        let list = this.products.filter(function (product) {
          return product.verify_status === Verify_UnSubmit
        })
        list = list.map(function (product) {
          product.product_id = product.id
          return product
        })
        return list
      },
      VerifyWaitProducts () {
        let list = this.products.filter(function (product) {
          return product.verify_status === Verify_Wait
        })
        list = list.map(function (product) {
          product.product_id = product.id
          return product
        })
        return list
      },
      FundingIngProducts () {
        let list = this.products.filter(function (product) {
          return product.verify_status === Verify_Success &&
          product.funding_status === FundingStatus_Ing
        })
        list = list.map(function (product) {
          product.product_id = product.id
          return product
        })
        return list
      },
      FundingSuccessProducts () {
        let list = this.products.filter(function (product) {
          return product.verify_status === Verify_Success &&
          product.funding_status === FundingStatus_Success
        })
        list = list.map(function (product) {
          product.product_id = product.id
          return product
        })
        return list
      },
      FundingFailProducts () {
        let list = this.products.filter(function (product) {
          return product.verify_status === Verify_Success &&
          product.funding_status === FundingStatus_Fail
        })
        list = list.map(function (product) {
          product.product_id = product.id
          return product
        })
        return list
      }

    },
    methods: {
      messageSuccess (m) {
        this.$message({
          type: 'success',
          message: m
        })
      },
      messageError (m) {
        this.$message.error({
          message: m
        })
      },
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
      },
      _getAllProductBySellerId () {
        allProductBySellerId().then(res => {
          if (res.code === 200) {
            this.products = res.data
            this.messageSuccess('信息获取成功')
          } else {
            this.messageError('信息获取出错' + res.message)
          }
        }).catch(error => {
          this.messageError('信息获取出错' + error)
        })
      }
    },
  
    created () {
      this._getAllProductBySellerId()
    }
  }
</script>
<style lang="scss" scoped>
  .productBox{
    > div {
      float: left;
      border: 1px solid #efefef;
    }
  }
  .content{
    margin: 10px auto;
    width: 95%;
  }
  .typeZone{
    clear: both;
    margin-top: 20px
  }
  .bottomLine{
    clear: both;
    margin: 10px auto;   
    border-style: solid; 
    border-bottom: 5px;
    border-color: lightgray
  }
  .funcZone {
    margin: 10px;
  }
  .fundingListZone {
     clear: both;
      padding: 20px 0;
      text-align: left;
      h1 {
        clear: both;
        margin-top: 10px;
        text-align: left;
        font-size: 24px;
      }
  }
  .support {
    line-height: 2em;
    font-size: 22px;
    color: #999;
  }
</style>
