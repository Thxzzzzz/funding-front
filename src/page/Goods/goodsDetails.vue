<!--商品详情-->
//TODO 众筹结束或过期提示等
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
          <div class="funding-status">
            {{fundingStatusStr}}
          </div>
          <!-- <p v-if="dayLeft <= 0"
             style="font-size:20px;margin-top:20px;">
            已结束！
          </p> -->
        </div>
      </div>
    </div>

    <!--产品信息 左侧大板块-->
    <div class="item-info">
      <y-shelf title="产品信息">
        <div slot="content">
          <el-tabs :value="tabsName"
                   style="margin:0px 10px">
            <el-tab-pane label="产品详情"
                         name="productDetail">
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
            </el-tab-pane>
            <el-tab-pane label="产品讨论"
                         name="comments">

              <div class="comment">
                <div class="title">评论</div>
                <input-component :show="true"
                                 v-model="commentContent"
                                 :login="login"
                                 @cancel="cancelInputComment"
                                 @confirm="commitComment"
                                 type="end">
                </input-component>
                <!-- @cancel="cancelInput"
                       @confirm="commitComment"> -->
                <div class="comment-num">{{commentData.length}} 条评论</div>
                <div class="comment-content">
                  <comment :comments="commentData"
                           :userInfo="userInfo"
                           :seller_id="product.user_id"></comment>
                </div>
              </div>

            </el-tab-pane>
          </el-tabs>

        </div>
      </y-shelf>
    </div>

    <!-- 产品信息 右侧小卡片 -->
    <div class="right-zone">

      <!-- 项目发起人 -->
      <div class="info-card">
        <y-shelf title="项目发起人">
          <!-- <div slot="right">
          </div> -->
          <div slot="content"
               class="sellerInfo"
               style="padding:25px; ">
            <el-row>
              <el-col :span="8">
                <img :src="IconUrlConvert(seller_info.icon_url)"
                     style="width:80px;height:80px;"
                     alt="">
              </el-col>
              <el-col :span="16">
                <div class="sellerInfo-text">
                  <p style="font-size:18px;">
                    {{seller_info.nickname}}
                  </p>
                  <p>
                    {{seller_info.email}}
                  </p>
                  <p>
                    {{seller_license.description}}
                  </p>
                </div>
              </el-col>
            </el-row>
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
                         type="normal"
                         :disabled="true"
                         v-if="dayLeft<=0">众筹已结束</el-button>
              <el-button style="width:160px; margin-top:10px;margin-bottom:10px;"
                         type="normal"
                         :disabled="true"
                         v-else-if="!isBuyerOrNotLogin">商家账户不能购买</el-button>
              <el-button style="width:160px; margin-top:10px;margin-bottom:10px;"
                         type="success"
                         @click="buy(item)"
                         v-else
                         :disabled="item.stock === 0"
                         size="large">{{item.stock === 0 ? '已售罄' : '支持￥' + item.price }}</el-button>
            </div>
          </div>
        </y-shelf>

      </div>
      <div class="info-card">
        <y-shelf title="联系我们">
          <div slot="content"
               class="licenseInfo"
               style="padding:25px">
            <el-row>

              <div class="sellerInfo-text">
                <p>
                  公司名称: {{seller_license.company_name}}
                </p>
                <p>
                  联系地址: {{seller_license.address}}
                </p>
                <p>
                  官方电话: {{seller_license.phone}}
                </p>
              </div>

            </el-row>
          </div>
        </y-shelf>
      </div>

      <div class="info-card">
        <y-shelf title="风险说明">
          <div slot="content"
               style="padding:25px">
            <p>1. 众筹不是商品交易。支持者根据自己的判断选择、支持众筹项目，与发起人共同实现梦想并获得发起人承诺的回报，众筹存在一定风险。</p>
            <p>
              2. 本众筹系统只提供平台网络空间、技术服务和支持等中介服务。本系统作为居间方，并不是发起人或支持者中的任何一方，众筹仅存在于发起人和支持者之间，使用本众筹系统产生的法律后果由发起人与支持者自行承担。
            </p>
            <p>
              3. 众筹项目的回报发放、发票开具及其他后续服务事项均由发起人负责。如果发生发起人无法发放回报、延迟发放回报、不提供回报后续服务等情形，您需要直接和发起人协商解决，本众筹系统对此不承担任何责任。
            </p>
            <p>
              4. 由于发起人能力和经验不足、市场风险、法律风险等各种因素，众筹可能失败。众筹期限届满前失败或募集失败的，您支持的款项会全部原路退还给您；其他情况下，您需要直接和发起人协商解决，本众筹系统对此不承担任何责任。
            </p>
            <p>
              5. 支持纯抽奖档位、无私支持档位及公益众筹项目档位，一旦支付成功将不予退款，众筹失败的除外。
            </p>
          </div>
        </y-shelf>
      </div>
    </div>

    <!-- 猜你喜欢 -->
    <el-card class="w clearfix"
             body-style="padding:0px;"
             v-if="recommendProducts">
      <div slot="header"
           class="clearfix">
        <span style="font-size:18px;color:gray">猜你喜欢</span>
        <el-button style="float: right; padding: 3px 0"
                   icon="el-icon-refresh"
                   @click="getRecommendProducts()"
                   type="text">刷新推荐</el-button>
      </div>
      <div class="floors"
           style="margin:0px;">
        <!-- 小图 -->
        <mall-goods :msg="iitem"
                    class="product-item"
                    style="margin:0 11px;"
                    v-for="(iitem,j) in recommendProducts"
                    :key="j+'key'"></mall-goods>
      </div>
    </el-card>

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
                  @btnClick="addToCart(selectedItem)"
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
  import { productDet, addCart, getCommentInfoByProductId, saveCommentsInfo, getProductsRand } from '/api/goods'
  import { getInfoById, getLicenseByUserId } from '/api/index'
  import { getFundingStatusStr } from '/utils/consts'

  // import { recommend } from '/api/index.js'

  import { mapMutations, mapState } from 'vuex'
  import YShelf from '/components/shelf'
  import YPopup from '/components/popup'
  import BuyNum from '/components/buynum'
  import YButton from '/components/YButton'
  import comment from '/components/Comment'
  import InputComponent from '/components/InputComponent'
  import mallGoods from '/components/mallGoods'

  import { getStore, getRecommendType } from '/utils/storage'
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
        userId: 0,
        // 评论
        commentData: [],
        commentContent: '',
        // 选项卡
        tabsName: 'productDetail',
        // 卖家信息
        seller_info: {},
        // 卖家执照信息
        seller_license: {},
        // 猜你喜欢列表
        recommendProducts: []
  
      }
    },
    computed: {
      ...mapState(['login', 'showMoveImg', 'showCart', 'userInfo']),
      // 是否显示购买按钮 是买家或者未登录则显示购买按钮
      isBuyerOrNotLogin () {
        if (!this.userInfo) return true
        return this.userInfo.info.role_id === 0
      },
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
      },
  
          // 众筹状态文字
      fundingStatusStr: function () {
        // 1：已通过 2：待审核 3: 待提交 4: 未通过
        if (this.product.verify_status === 1) {
        // 1：众筹成功 2：众筹失败 3：正在众筹
          return getFundingStatusStr(this.product.funding_status)
        } else if (this.product.verify_status === 2) {
          return '待审核'
        } else if (this.product.verify_status === 3) {
          return '待提交审核'
        } else if (this.product.verify_status === 3) {
          return '未通过审核'
        }
      }
    },
    methods: {
      ...mapMutations(['ADD_CART', 'ADD_ANIMATION', 'SHOW_CART']),
      formatDate (date) {
        return dayjs(date).format('YYYY年MM月DD日') // 展示
      },
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
      buy (item) {
        this.popupOpen = true
        this.selectedItem = item
      },
      // 空白头像转换成默认头像链接
      IconUrlConvert (url) {
        if (!url) {
          url = 'static/images/defaultIcon.png'
        }
        return url
      },
      // 获取产品信息
      _productDet (id) {
        productDet({params: {id}}).then(res => {
          if (res.code === 200) {
            let result = res.data
            this.product = result
            this._getInfoById(result.user_id)
            this._getLicenseByUserId(result.user_id)
          } else {
            this.messageError('产品信息获取失败' + res.message)
          }
        }).catch(error => {
          this.messageError('产品信息获取失败' + error)
        })
      },
      // 获取卖家信息（获取产品信息成功后获取）
      _getInfoById (seller_id) {
        getInfoById({params: {id: seller_id}}).then(res => {
          if (res.code === 200) {
            this.seller_info = res.data
          }
        })
      },
      // 获取执照信息 （获取产品信息成功后获取）
      _getLicenseByUserId (seller_id) {
        getLicenseByUserId({params: {user_id: seller_id}}).then(res => {
          if (res.code === 200) {
            this.seller_license = res.data
          }
        })
      },
      addToCart (item) {
        let product_package_id = item.id
        if (!this.showMoveImg) {     // 动画是否在运动
          if (this.login) { // 登录了 直接存在用户名下
            addCart({userId: this.userInfo.info.userId,
              product_package_id: product_package_id,
              nums: this.nums,
              checked: true}).then(res => {
                // if(res.code===200){
  
                // }
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
      },
      // 获取产品评论信息
      _getCommentInfoByProductId (productId) {
        getCommentInfoByProductId({params: {product_id: productId}}).then(res => {
          if (res.code === 200) {
            this.commentData = res.data
          }
        })
      },
      // 取消评论操作
      cancelInputComment () {
        this.commentContent = ''
      },
      // 提交评论操作
      commitComment (content) {
        this.commentContent = content
        if (this.commentContent.length < 4) {
          console.log(this.commentContent)
          console.log(this.commentContent.length)
          this.messageError('评论至少4个字')
          return
        }
        let commentInfo = {
          product_id: this.product.id,
          content: this.commentContent
        }
        this._submitCommentInfo(commentInfo)
      },
      // 提交评论请求
      _submitCommentInfo (commentInfo) {
        saveCommentsInfo(commentInfo).then(res => {
          if (res.code === 200) {
            this.commentContent = ''
            let newComment = res.data
            let userInfo = this.userInfo.info
            newComment.user_id = userInfo.id
            newComment.username = userInfo.username
            newComment.nickname = userInfo.nickname
            newComment.icon_url = userInfo.icon_url
            newComment.created_at = Date.now()
            if (this.product.seller_id === userInfo.id) {
              newComment.is_seller = true
            }
            console.log(newComment)
            this.commentData.unshift(newComment)
          } else {
            this.messageError('评论提交失败' + res.message)
          }
        }
        ).catch(error => {
          this.messageError('评论提交失败' + error)
        })
      },
      // 获取推荐商品列表（猜你喜欢）
      getRecommendProducts () {
      // 从Local Storage 获取统计到的商品类型
        let type = getRecommendType()
        let params = {product_type: type, num: 4}
        getProductsRand({params: params}).then(res => {
          if (res.code === 200) {
            this.recommendProducts = res.data
          }
        })
      }
    },
    components: {
      YShelf, BuyNum, YButton, YPopup, comment, InputComponent, mallGoods
    },
    created () {
      let id = this.$route.query.productId
      this._productDet(id)
      this._getCommentInfoByProductId(id)
      this.userId = getStore('userId')
      // 获取猜你喜欢列表
      this.getRecommendProducts()
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../assets/style/mixin";
  @import "../../assets/style/comment.scss";

  .funding-status{
    margin: 40px auto;
    font-size: 26px;
    font-weight: bold;
    border: rgb(236, 103, 103);
    border-width: 3px;
    width: 150px;
    height: 50px;
    text-align: center;
    line-height: 45px;
    border-style: solid;
    color: rgb(236, 103, 103);
  }
  .mt30 {
    margin-top: 30px;
  }
  .floors {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: center;

  }

  .sellerInfo-text{
    p {
      margin-bottom: 6px;
    }
  }

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

.comment {
    width: 100%;
    margin-top: 10px;
    padding-bottom: 10px;
    background-color: white;
    .title {
      font-size: 16px;
      color: $text-main;
      font-weight: 700;
      padding: 10px;
      border-bottom: 1px solid $border-third;
    }
    .comment-num {
      font-size: 16px;
      color: $text-main;
      font-weight: 600;
      margin: 0 20px;
      padding: 10px 0;
    }
  }
</style>
