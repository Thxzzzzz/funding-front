// TODO 众筹结束或过期提示等
<template>
  <div class="good-item">
    <div style="">
      <!-- 图片 -->
      <div class="good-img">
        <a @click="openProduct(msg.product_id)">
          <img v-lazy="msg.small_img"
               :alt="msg.name"
               :key="msg.small_img">
        </a>
      </div>
      <!-- 标题 （产品名） -->
      <h6 class="good-title"
          v-html="msg.name">{{msg.name}}</h6>

      <!-- 副标题 （简介，暂时没有）  -->
      <h3 class="sub-title ellipsis">{{msg.name}}</h3>

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
            <p v-if="dayLeft>=0">{{dayLeft}} 天 </p>
            <p v-else-if="dayLeft<0">已结束 </p>
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
const template = {
  product_id: 11118,
  name: '鑫乐迪运动手环蓝牙耳机二合一7',
  big_img:
    'https://img30.360buyimg.com/cf/jfs/t1/21081/18/6891/106614/5c6639a2E4d110821/c5802dca70419338.jpg',
  small_img:
    'https://img30.360buyimg.com/cf/jfs/t1/28544/16/6906/44121/5c66399bE78db06bd/0b919fb33eaccc26.jpg',
  product_type: 2,
  current_price: 1098900,
  target_price: 100000,
  backers: 2897,
  current_time: '2019-04-10T21:20:06.0493347+08:00',
  end_time: '2019-04-09T19:43:04+08:00'
}

export default {
  props: {
    msg: template,
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
      window.open(
        '//' + window.location.host + '/#/goodsDetails?productId=' + id
      )
    },
    editProduct (productId) {
      console.log('edit:' + productId)
      this.$router.push(
        {
          path: '/user/newFunding',
          query: {
            productId: productId
          }
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

.good-item {
  background: #fff;
  border: none;
  border-right: 1px solid #efefef;
  border-bottom: 1px solid #efefef;
  width: 25%;
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
