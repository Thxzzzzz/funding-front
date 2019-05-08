<!--商品详情-->
//TODO 待完善，商家信息，众筹结束或过期提示等
<template>
  <div class="w store-content">
    <div class="gray-box">
      <div class="gallery-wrapper">
        <div class="gallery">
          <div class="thumb">
            <div class="big">
              <img :src="product.big_img"
                   :alt="product.name">
            </div>
          </div>
        </div>
      </div>
      <!--右边-->
      <div class="banner">
        <div class="card horizontal-left text-left"
             :style="{'height':'100%'}">
          <p style="color:black;font-size:24px;margin:3px">{{product.name}}</p>
          <p style="color:black;font-size:16px;text-align:left;left:0;margin:15px 3px">已筹到</p>
          <p style="color:black;">
            <span style="font-size:24px;">￥</span>
            <span style="font-size:48px;">{{product.current_price}}</span>
          </p>
          <div>
            <el-progress :show-text="false"
                         :stroke-width="10"
                         :percentage="percentage"></el-progress>
          </div>
          <p style="font-size:14px; font-weight:700;margin-top:20px">
            <span style="float:left; color: rgb(161, 6, 224);">当前进度{{progressPercent}}%</span>
            <span style="float:right">{{product.backers}}名支持者</span>
          </p>
          <p style="margin-top:50px;">
            <span>此项目必须在</span>
            <span style="color:red">{{formatDate(product.end_time)}}</span>
            <span>前得到</span>
            <span>￥{{product.target_price}}</span>
            <span> 的支持才可成功！</span>
            <span v-if="dayLeft > 0">
              <span> 剩余</span>
              <span style="color:red"> {{dayLeft}} </span>
              <span> 天!</span>
            </span>

          </p>
          <p v-if="dayLeft <= 0"
             style="font-size:20px;margin-top:20px;">
            已结束！
          </p>
        </div>
      </div>
    </div>

    <!--产品信息 左侧大板块-->
    <div class="item-info">
      <y-shelf title="产品信息">
        <div slot="content">
          <div class="img-item"
               v-if="product.detail_html">
            <div v-html="product.detail_html">{{ product.detail_html }}</div>
          </div>
          <div class="no-info"
               v-else>
            <img src="/static/images/no-data.png">
            <br>
            该商品暂无内容数据
          </div>
        </div>
      </y-shelf>
    </div>

    <!-- 产品信息 右侧小卡片 -->
    <div class="right-zone">

      <!-- 项目发起人 -->
      <div class="info-card">
        <y-shelf title="项目发起人">
          <div slot="right">

          </div>
          <div slot="content">

          </div>
        </y-shelf>
      </div>

      <!-- 套餐信息-->
      <div v-for="(item,key) in product.product_packages"
           :key="key"
           class="info-card">
        <y-shelf :title="'￥'+item.price">
          <div slot="right">
            <span style="font-size:16px; color:gray;">{{item.backers}} 位支持者</span>
          </div>
          <div slot="content"
               class="info-des"
               style="padding:25px">
            <div class="left-label"
                 style="font-size:15px; 
                 font-weight:bold;">
              <span>限额{{item.total}}份</span>
              <span>&nbsp;|&nbsp;剩余{{item.stock}}份</span>
            </div>
            <div style="clear:both;text-align:left">{{item.description}}</div>
            <div>
              <img :src="item.image_url"
                   alt="图片"
                   style="width:70px;height:70px;margin:15px 0px;float:left;">
            </div>
            <div style="clear:both;text-align:left">
              <span>配送费用：</span>
              <span v-if="item.freight != 0">{{item.freight}}</span>
              <span v-else
                    style="font-weight:bold;">免运费</span>
            </div>
            <div style="clear:both;text-align:left">
              <span>预计回报发送时间：</span>
              <span style="font-weight:bold;">
                <span>项目众筹成功后</span>
                <span style="color:red;">{{item.delivery_day}}</span>
                <span>天内</span>
              </span>
            </div>
            <div align="left"
                 style="clear:both;">
              <el-button style="width:160px; margin-top:10px;margin-bottom:10px;"
                         type="success"
                         @click="buy(item)"
                         :disabled="item.stock === 0"
                         size="large">{{item.stock === 0 ? '已售罄' : '支持￥' + item.price }}</el-button>
            </div>
          </div>
        </y-shelf>
      </div>
    </div>

    <!-- 加入购物车弹框 -->
    <y-popup :open="popupOpen"
             @close='popupOpen=false'
             :title="product.name + '（档位￥' + selectedItem.price + '）'">
      <div slot="content"
           class="md"
           :data-id="selectedItem.id">
        <div class="num">
          <span class="params-name">回报内容</span>
          <span class="params-content">{{selectedItem.description}}</span>
        </div>
        <div class="num">
          <span class="params-name">数量</span>
          <span v-if="selectedItem.stock === 0"
                class="params-content">已售罄</span>
          <buy-num v-else
                   class="params-content"
                   @edit-num="editNum"
                   :limit="Number(selectedItem.stock)"></buy-num>
        </div>
        <y-button v-if="selectedItem.stock !== 0"
                  style="margin-right:80px"
                  @btnClick="addCart(selectedItem)"
                  text='加入购物车'>
        </y-button>
        <y-button v-if="selectedItem.stock !== 0"
                  @btnClick="checkout(selectedItem.product_id,selectedItem.id)"
                  text='立即支持'>
        </y-button>
      </div>
    </y-popup>

  </div>
</template>
<script>
  import { productDet, addCart } from '/api/goods'
  import { mapMutations, mapState } from 'vuex'
  import YShelf from '/components/shelf'
  import YPopup from '/components/popup'
  import BuyNum from '/components/buynum'
  import YButton from '/components/YButton'
  import { getStore } from '/utils/storage'
  import { calcDayBetween } from '/utils/dateUtil'
  import dayjs from 'dayjs'

  export default {
    data () {
      return {
        popupOpen: false,
        selectedItem: {},
        product: {},
        nums: 1,
        cartItem: {
          product_id: 0,
          product_package_id: 0,
          nums: 0,
          unit_price: 0
        },
        userId: 0
      }
    },
    computed: {
      ...mapState(['login', 'showMoveImg', 'showCart', 'userInfo']),
      progressPercent: function () {
        return Number(this.product.current_price / this.product.target_price * 100).toFixed(0)
      },
      percentage: function () {
        let percent = this.progressPercent
        if (percent > 100) percent = 100
        return Number(percent)
      },
      dayLeft: function () {
        let date1 = new Date()
        let date2 = new Date(this.product.end_time)
        return calcDayBetween(date1, date2)
      }
    },
    methods: {
      ...mapMutations(['ADD_CART', 'ADD_ANIMATION', 'SHOW_CART']),
      formatDate (date) {
        return dayjs(date).format('YYYY年MM月DD日') // 展示
      },
      buy (item) {
        this.popupOpen = true
        this.selectedItem = item
      },
      _productDet (id) {
        productDet({params: {id}}).then(res => {
          let result = res.data
          this.product = result
        })
      },
      addCart (item) {
        let product_package_id = item.id
        console.log(product_package_id)
        if (!this.showMoveImg) {     // 动画是否在运动
          if (this.login) { // 登录了 直接存在用户名下
            addCart({userId: this.userInfo.info.userId,
              product_package_id: product_package_id,
              nums: this.nums,
              checked: true}).then(res => {
              // 并不重新请求数据
                this.ADD_CART({
                  product_package_id: product_package_id,
                  product_id: item.product_id,
                  price: item.price,
                  product_name: this.product.name,
                  description: item.description,
                  image_url: item.image_url,
                  nums: this.nums,
                  checked: true
                })
              })
          } else { // 未登录 vuex
            this.ADD_CART({
              product_package_id: product_package_id,
              product_id: item.product_id,
              price: item.price,
              product_name: this.product.name,
              description: item.description,
              image_url: item.image_url,
              nums: this.nums,
              checked: true
            })
          }
          this.popupOpen = false
          // 加入购物车动画
          var dom = event.target
          // 获取点击的坐标
          let elLeft = dom.getBoundingClientRect().left + (dom.offsetWidth / 2)
          let elTop = dom.getBoundingClientRect().top + (dom.offsetHeight / 2)
          // 需要触发
          this.ADD_ANIMATION({moveShow: true, elLeft: elLeft, elTop: elTop, img: item.image_url})
          if (!this.showCart) {
            this.SHOW_CART({showCart: true})
          }
        }
      },
      checkout (product_id, product_package_id) {
        console.log(product_id + ' ' + product_package_id)
        let nums = this.nums
        this.$router.push(
          {
            path: '/checkout',
            query: {
              product_id: product_id,
              product_package_id: product_package_id,
              nums: nums}
          })
      },
      editNum (num) {
        this.nums = num
      }
    },
    components: {
      YShelf, BuyNum, YButton, YPopup
    },
    created () {
      let id = this.$route.query.productId
      this._productDet(id)
      this.userId = getStore('userId')
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../assets/style/mixin";

  .store-content {
    clear: both;
    width: 1220px;
    min-height: 600px;
    padding: 0 0 25px;
    margin: 0 auto;
  }

  .gray-box {
    display: flex;
    padding: 10px 10px 10px 0px;
    margin: 0px 0px 20px 0px;
    .gallery-wrapper {
      .gallery {
        display: flex;
        width: 64%;
        .thumbnail {
          li:first-child {
            margin-top: 0px;
          }
          li {
            @include wh(80px);
            margin-top: 10px;
            padding: 12px;
            border: 1px solid #f0f0f0;
            border: 1px solid rgba(0, 0, 0, .06);
            border-radius: 5px;
            cursor: pointer;
            &.on {
              padding: 10px;
              border: 3px solid #ccc;
              border: 3px solid rgba(0, 0, 0, .2);
            }
            img {
              display: block;
              @include wh(100%);
            }
          }
        }
        .thumb {
          .big {
            margin-left: 10px;
          }
          img {
            display: block;
            height: 400px;
          }
        }
      }
    }
    // 右边
    .banner {
      width: 34%;
      margin-left: 10px;
      h4 {
        font-size: 24px;
        line-height: 1.25;
        color: #000;
        margin-bottom: 13px;
      }
      h6 {
        font-size: 14px;
        line-height: 1.5;
        color: #bdbdbd;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .sku-custom-title {
        overflow: hidden;
        padding: 8px 8px 18px 10px;
        position: relative;
      }

      .buy {
        position: relative;
        border-top: 1px solid #ebebeb;
        padding: 30px 0 0 10px;
      }
    }
  }

  .params-name {
    padding-right: 20px;
    text-align: right;
    width: 100px;
    font-size: 14px;
    color: #8d8d8d;
    line-height: 36px;
  }

  .params-content {
    padding-right: 20px;
    text-align: left;
    font-size: 14px;
    max-width:400px;
    color: #8d8d8d;
    line-height: 36px;
    align-items: top;
  }
  .num {
    padding: 0px 0 8px 10px;
    display: flex;
    align-items: top;
  }

  // 详情右边
  .right-zone{
    float: left;
    width: 32%;
    margin: 0px 0px 0px 2%;
   
  }

  .info-card{
    width:100%;
    .gray-box {
      padding: 0;
      display: block;
    }
    .left-label {
      text-align: left;
      float: left;
      height: 30px;
      font-size: 20px;
      margin: 0 0 10px;
    }

    .right-label {
      text-align: right;
      float: right;
      height: 30px;
      font-size: 20px;
      margin: 0 0 10px;
    }
    .info-des span{
      margin: 10px 0px
    }
  }

  // 详情
  .item-info {
    float: left;
    width: 66%;
    .gray-box {
      padding: 0;
      display: block;
    }
    .img-item {
      width: 100%;
      // padding: 1vw;
      text-align: center;
      img {
        width: 100%;
        height: auto;
        display: block;
      }
    }
  }

  .no-info {
    padding: 200px 0;
    text-align: center;
    font-size: 30px;
  }

  .price {
    display: block;
    color: #d44d44;
    font-weight: 700;
    font-size: 16px;
    line-height: 20px;
    text-align: right;
    i {
      padding-left: 2px;
      font-size: 24px;
    }
  }
</style>
