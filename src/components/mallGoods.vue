<template>
  <div class="good-item">
    <div style="">
      <!-- 图片 -->
      <div class="good-img">

        <!-- 左上角标签 -->
        <div style=" position: relative;">
          <div class="left-top-tag">{{productTypeStr}}</div>
        </div>
        <a @click="openProduct(msg.product_id)">
          <img v-lazy="msg.small_img"
               :alt="msg.name"
               :key="msg.small_img">
        </a>

      </div>
      <!-- 标题 （产品名） -->
      <h6 class="good-title"
          v-html="msg.name">{{msg.name}}</h6>

      <!-- 副标题 （简介，暂时没有） {{msg.name}} -->
      <h3 class="sub-title ellipsis"></h3>

      <!-- 查看详情按钮  -->
      <div class="good-price pr">
        <div class="ds pa"
             style="margin-top:35px;">
          <a @click="openProduct(msg.product_id)">
            <y-button text="查看详情"
                      v-if="!hideDetailBt"
                      style="margin: 0 5px"></y-button>
          </a>
          <y-button text="编辑"
                    v-if="canEdit"
                    style="margin: 0 5px"
                    @btnClick="editProduct(msg.product_id)"
                    classStyle="main-btn"></y-button>
        </div>

        <!-- 金额筹集信息 -->
        <div class="price-info">
          <!-- 进度条 -->
          <div class="price-progressbar">
            <el-progress :show-text="false"
                         :stroke-width="10"
                         :percentage="percentage"></el-progress>
          </div>
          <!-- 已筹金额与目标金额百分比 -->
          <div class="price price-percent">
            <p>{{progressPercent}}%</p>
            <p class="price-des-text">已达</p>
          </div>
          <!-- 已筹金额 -->
          <div class="price price-current">
            <p>￥{{Number(msg.current_price).toFixed(0)}} </p>
            <p class="price-des-text">已筹</p>
          </div>
          <!-- 众筹剩余时间 -->
          <div class="price price-left">
            <p v-if="dayLeft>0">{{dayLeft}} 天 </p>
            <p v-else-if="dayLeft<=0">已结束 </p>
            <p class="price-des-text">剩余时间</p>
          </div>

        </div>

      </div>

    </div>

  </div>

</template>
<script>
import YButton from '/components/YButton'
// import { addCart } from '/api/goods.js'
import { mapMutations, mapState } from 'vuex'
// import { getStore } from '/utils/storage'
import { calcDayBetween } from '/utils/dateUtil'
import { addRecommendCount } from '/utils/storage'
import { getFundingStatusStr } from '/utils/consts'

export default {
  props: {
    msg: {
      name: '',
      big_img: '',
      small_img: '',
      product_type: 0,
      current_price: 0,
      target_price: 0,
      backers: 0,
      current_time: '',
      end_time: ''
    },
    canEdit: false,
    hideDetailBt: false
  },
  data () {
    return {}
  },
  methods: {
    ...mapMutations(['ADD_CART', 'ADD_ANIMATION', 'SHOW_CART']),
    goodsDetails (id) {
      this.$router.push({ path: 'goodsDetails/productId=' + id })
    },
    openProduct (id) {
      if (this.hideDetailBt) return
      // 打开了产品，对应类型推荐计数累加 1
      addRecommendCount(this.msg.product_type, 1)
      // console.log('Type: ' + getRecommendType())
      window.open(
        '//' + window.location.host + '/#/goodsDetails?productId=' + id
      )
    },
    editProduct (productId) {
      console.log('edit:' + productId)
      let query = {
        productId: productId
      }
      if (this.msg.verify_status && this.msg.verify_status === 4) {
        query.step = 4
      }
      this.$router.push(
        {
          path: '/user/newFunding',
          query
        })
    }
  },
  computed: {
    ...mapState(['login', 'showMoveImg', 'showCart']),
    dayLeft: function () {
      let date1 = new Date()
      let date2 = new Date(this.msg.end_time)
      return calcDayBetween(date1, date2)
    },
    progressPercent: function () {
      return Number(this.msg.current_price / this.msg.target_price * 100).toFixed(0)
    },
    percentage: function () {
      let percent = this.progressPercent
      if (percent > 100) percent = 100
      return Number(percent)
    },
        // 产品类型文字
    productTypeStr: function () {
      if (this.msg.product_type === 1) {
        return '数码'
      } else if (this.msg.product_type === 2) {
        return '生活'
      } else if (this.msg.product_type === 3) {
        return '运动'
      } else if (this.msg.product_type === 99) {
        return '其他'
      }
    },
    // 众筹状态文字
    fundingStatusStr: function () {
      // 1：已通过 2：待审核 3: 待提交 4: 未通过
      if (this.msg.verify_status === 1) {
        // 1：众筹成功 2：众筹失败 3：正在众筹
        return getFundingStatusStr(this.msg.funding_status)
      } else if (this.msg.verify_status === 2) {
        return '待审核'
      } else if (this.msg.verify_status === 3) {
        return '待提交审核'
      } else if (this.msg.verify_status === 4) {
        return '未通过审核'
      }
    }
  },
  mounted () {},
  components: {
    YButton
  }
}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
@import "../assets/style/mixin";
@import "../assets/style/theme";


.left-top-tag  {
    position: absolute;
    background: #92b7bd;
    // z-index: 999;
    border-radius: 3px;
    position: absolute;
    width: 100px;
    height: 30px;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    text-align: center;
    line-height: 30px;
    // transform: rotate(-40deg);
    top: 6px;
    left: 5px;
}
 
.good-item {
  background: #fff;
  border: none;
  border-right: 1px solid #efefef;
  border-bottom: 1px solid #efefef;
  transition: all 0.5s;
  height: 430px;
  &:hover {
    transform: translateY(-3px);
    box-shadow: 1px 1px 20px #999;
    .good-price .price {
      display: none;
    }
    .ds {
      display: flex;
    }
  }
  .ds {
    @extend %block-center;
    width: 100%;
    display: none;
  }

  .good-img {
    img {
      margin: auto auto 30px;
      width: 99%;
      // @include wh(303px);
      display: block;
    }
  }
  .good-price {
    margin: 15px 0;
    height: 30px;
    text-align: center;
    line-height: 30px;
    color: gray; //#d44d44
    font-family: Arial;
    font-size: 18px;
    font-weight: 500;
  }
  .good-title {
    line-height: 1.2;
    font-size: 16px;
    color: #424242;
    margin: 0 auto;
    padding: 0 14px;
    text-align: center;
    overflow: hidden;
  }
  .price-info {
    margin: 0 auto;
    width: 90%;
  }
  .price {
    text-align: left;
    font-size: 16px;
    color: #5e5e5e;
    padding-left: 10px;
    float: left;
  }
  .price-progressbar{
    clear: both;
    margin: 10px;
  }
  .price-des-text {
    color: #a5a5a5;
    font-size: 12px;
  }
  .price-percent {
    width: 30%; //22.5%;
    border-right: 1px solid #e7e7e7;
  }
  .price-current {
    width: 43%; //37.5%;
    border-right: 1px solid #e7e7e7;
  }
  .price-left {
    width: 25%; //22.5%;
  }

  h3 {
    text-align: center;
    line-height: 1.2;
    font-size: 12px;
    color: #d0d0d0;
    padding: 10px;
  }
}
</style>
