<template>
  <div class="home">
    <div v-loading="loading"
         element-loading-text="加载中..."
         style="min-height: 35vw;"
         v-if="!error">
      <!-- 轮播图 -->
      <div class="banner">
        <div class="bg"
             ref="bg"
             @mouseover="bgOver($refs.bg)"
             @mousemove="bgMove($refs.bg,$event)"
             @mouseout="bgOut($refs.bg)">
          <transition name="fade">
            <div v-for="(item, i) in banner"
                 v-if="i === mark"
                 :key="item.product_id"
                 style="position:absolute"
                 @click="openProduct(item)"
                 @mouseover="stopTimer"
                 @mouseout="startTimer">
              <img class="img1"
                   :src="item.big_img" />
            </div>
          </transition>
        </div>
        <div class="page">
          <ul class="dots">
            <li class="dot-active"
                v-for="(item, i) in banner"
                :class="{ 'dot':i!=mark }"
                :key="i"
                @click="change(i)"></li>
          </ul>
        </div>
      </div>

      <!-- 统计板块  -->
      <div class="activity-panel">
        <ul class="box"
            style="height:100px">
          <li class="content">
            <div class="countInfo">
              <p class="countInfoNum">￥{{productCountInfo.support_price_count}}</p>
              <p class="countInfoText">累计支持金额</p>
            </div>

            <a class="cover-link">
            </a>
          </li>
          <li class="content">
            <div class="countInfo">
              <p class="countInfoNum">￥{{productCountInfo.max_support_price}}</p>
              <p class="countInfoText"> 单项最高筹集金额</p>
            </div>
            <a class="cover-link">
            </a>
          </li>
          <li class="content">
            <div class="countInfo">
              <p class="countInfoNum">{{productCountInfo.backers_count}}</p>
              <p class="countInfoText">累计支持人数</p>
            </div>
            <a class="cover-link">
            </a>
          </li>
          <li class="content">
            <div class="countInfo">
              <p class="countInfoNum">{{productCountInfo.max_backers}}</p>
              <p class="countInfoText">单项最高支持人数</p>
            </div>
            <a class="cover-link">
            </a>
          </li>
        </ul>
      </div>

      <!-- 猜你喜欢 -->
      <el-card class="w mt30 clearfix"
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
                      v-for="(iitem,j) in recommendProducts"
                      :key="j+'key'"></mall-goods>
        </div>
      </el-card>

      <div v-for="(item,i) in home"
           :key="i">

        <!-- xx精选 -->
        <section class="w mt30 clearfix"
                 v-if="item.type === 3">
          <y-shelf :title="item.name">
            <div slot="content"
                 class="floors">
              <!-- 大图 -->
              <div class="imgbanner"
                   v-for="(iitem,j) in item.product_contents"
                   :key="j"
                   v-if="j === 0"
                   @click="openProduct(iitem)">
                <img v-lazy="iitem.big_img">
                <a class="cover-link"></a>
              </div>
              <!-- 小图 -->
              <mall-goods :msg="iitem"
                          class="product-item"
                          v-for="(iitem,j) in item.product_contents"
                          :key="j+'key'"
                          v-if="j !== 0"></mall-goods>
            </div>
          </y-shelf>
        </section>

      </div>
    </div>

    <div class="no-info"
         v-if="error">
      <div class="no-data">
        <img src="/static/images/error.png">
        <br> 抱歉！出错了...
      </div>
    </div>

  </div>
</template>
<script>
import { productHome, getProductCountInfo } from '/api/index.js'
import { getProductsRand } from '/api/goods.js'
import YShelf from '/components/shelf'
import mallGoods from '/components/mallGoods'
import { setStore, getStore } from '/utils/storage.js'
import { addRecommendCount, getRecommendType } from '/utils/storage'

export default {
  data () {
    return {
      error: false,
      banner: [],
      mark: 0,
      bgOpt: {
        px: 0,
        py: 0,
        w: 0,
        h: 0
      },
      home: [],
      // 统计信息
      productCountInfo: {},
      // 猜你喜欢列表
      recommendProducts: [],
      loading: true,
      notify: '1',
      dialogVisible: false,
      timer: ''
    }
  },
  methods: {
    autoPlay () {
      this.mark++
      if (this.mark > this.banner.length - 1) {
        // 当遍历到最后一张图片置零
        this.mark = 0
      }
    },
    play () {
      // 每2.5s自动切换
      this.timer = setInterval(this.autoPlay, 2500)
    },
    change (i) {
      this.mark = i
    },
    startTimer () {
      this.timer = setInterval(this.autoPlay, 2500)
    },
    stopTimer () {
      clearInterval(this.timer)
    },
    // 打开商品详情
    openProduct (item) {
      // 打开了产品，对应类型推荐计数累加 1
      addRecommendCount(item.product_type, 1)
      // 关联商品
      this.$router.push({
        path: '/goodsDetails',
        query: {
          productId: item.product_id
        }
      })
    },
    bgOver (e) {
      // 获取轮播图控件的坐标和长宽信息
      this.bgOpt.px = e.offsetLeft
      this.bgOpt.py = e.offsetTop
      this.bgOpt.w = e.offsetWidth
      this.bgOpt.h = e.offsetHeight
    },
    bgMove (dom, eve) {
      let bgOpt = this.bgOpt
      let X, Y
      let mouseX = eve.pageX - bgOpt.px
      let mouseY = eve.pageY - bgOpt.py
      if (mouseX > bgOpt.w / 2) {
        X = mouseX - bgOpt.w / 2
      } else {
        X = mouseX - bgOpt.w / 2
      }
      if (mouseY > bgOpt.h / 2) {
        Y = bgOpt.h / 2 - mouseY
      } else {
        Y = bgOpt.h / 2 - mouseY
      }
      dom.style['transform'] = `rotateY(${X / 50}deg) rotateX(${Y / 50}deg)`
      dom.style.transform = `rotateY(${X / 50}deg) rotateX(${Y / 50}deg)`
    },
    bgOut (dom) {
      dom.style['transform'] = 'rotateY(0deg) rotateX(0deg)'
      dom.style.transform = 'rotateY(0deg) rotateX(0deg)'
    },
    showNotify () {
      var value = getStore('notify')
      if (this.notify !== value) {
        this.dialogVisible = true
        setStore('notify', this.notify)
      }
    },
    // 获取推荐商品列表（猜你喜欢）
    getRecommendProducts () {
      //  从Local Storage 获取统计到的商品类型
      let type = getRecommendType()
      let params = {product_type: type, num: 4}
      getProductsRand({params: params}).then(res => {
        if (res.code === 200) {
          this.recommendProducts = res.data
        }
      })
    }
  },
  mounted () {
    productHome().then(res => {
      if (res.code !== 200) {
        this.error = true
        return
      }
      let data = res.data
      this.home = data
      this.loading = false
      for (let i = 0; i < data.length; i++) {
        if (data[i].type === 0) {
          this.banner = data[i].product_contents
        }
      }
    })
    getProductCountInfo().then(res => {
      if (res.code === 200) {
        this.productCountInfo = res.data
      }
    })
    // 获取猜你喜欢列表
    this.getRecommendProducts()
    this.showNotify()
  },
  created () {
    this.play()
  },
  components: {
    YShelf,
    mallGoods
  }
}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.product-item {
  width: 25%;
}
.home {
  display: flex;
  flex-direction: column;

}

.no-info {
  padding: 100px 0;
  text-align: center;
  font-size: 30px;
  display: flex;
  flex-direction: column;
  .no-data {
    align-self: center;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.page {
  position: absolute;
  width: 100%;
  top: 470px;
  z-index: 30;
  .dots {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    .dot-active {
      display: inline-block;
      width: 15px;
      height: 15px;
      background-color: whitesmoke;
      border-radius: 8px;
      margin-right: 10px;
      cursor: pointer;
    }
    .dot {
      opacity: 0.2;
    }
  }
}
.countInfo{
  text-align: center;
  vertical-align: middle;
}
.countInfoNum{
  margin-top: 10px;
  font-size: 38px;
  font-weight: bold;
  color: black;
}
.countInfoText{
  font-size: 16px;
  font-weight: bold;
}

.activity-panel {
  width: 1220px;
  margin: 0 auto;
  .box {
    overflow: hidden;
    position: relative;
    z-index: 0;
    margin-top: 25px;
    box-sizing: border-box;
    border: 1px solid rgba(0, 0, 0, 0.14);
    border-radius: 8px;
    background: #fff;
    box-shadow: 0 3px 8px -6px rgba(0, 0, 0, 0.1);
  }

  .content {
    float: left;
    position: relative;
    box-sizing: border-box;
    width: 25%;
    height: 200px;
    text-align: center;
  }
  .content ::before {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    box-sizing: border-box;
    border-left: 1px solid #f2f2f2;
    border-left: 1px solid rgba(0, 0, 0, 0.1);
    width: 100%;
    height: 100%;
    content: "";
    pointer-events: none;
  }
  .i {
    width: 305px;
    height: 200px;
  }
  .cover-link {
    cursor: pointer;
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 4;
    background: url(data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEHAAEALAAAAAABAAEAAAICTAEAOw==)
      repeat;
  }
  a {
    color: #5079d9;
    cursor: pointer;
    transition: all 0.15s ease-out;
    text-decoration: none;
  }
  a:hover {
    box-shadow: inset 0 0 38px rgba(0, 0, 0, 0.08);
    transition: all 0.15s ease;
  }
}

.banner,
.banner span,
.banner div {
  font-family: "Microsoft YaHei";
  transition: all 0.3s;
  transition-timing-function: linear;
}

.banner {
  cursor: pointer;
  perspective: 3000px;
  position: relative;
  z-index: 19;
  margin: 0 auto;
  width: 1220px;
}

.bg {
  position: relative;
  width: 1220px;
  height: 500px;
  margin: 20px auto;
  background-size: 100% 100%;
  border-radius: 10px;
  transform-style: preserve-3d;
  transform-origin: 50% 50%;
  transform: rotateY(0deg) rotateX(0deg);
  & div {
    position: relative;
    height: 100%;
    width: 100%;
  }
}

.img1 {
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  border-radius: 10px;
}

.img2 {
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  bottom: 5px;
  left: 0;
  background-size: 95% 100%;
  border-radius: 10px;
}

.img3 {
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  border-radius: 10px;
}

.a {
  z-index: 20;
  transform: translateZ(40px);
}

.b {
  z-index: 20;
  transform: translateZ(30px);
}

.c {
  transform: translateZ(0px);
}

.sk_item {
  width: 170px;
  height: 225px;
  padding: 0 14px 0 15px;
  > div {
    width: 100%;
  }
  a {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transition: all 0.3s;
    &:hover {
      transform: translateY(-5px);
    }
  }
  img {
    width: 130px;
    height: 130px;
    margin: 17px 0;
  }
  .sk_item_name {
    color: #999;
    display: block;
    max-width: 100%;
    _width: 100%;
    overflow: hidden;
    font-size: 12px;
    text-align: left;
    height: 32px;
    line-height: 16px;
    word-wrap: break-word;
    word-break: break-all;
  }
  .sk_item_price {
    padding: 3px 0;
    height: 25px;
  }
  .price_new {
    font-size: 18px;
    font-weight: 700;
    margin-right: 8px;
    color: #f10214;
  }
  .price_origin {
    color: #999;
    font-size: 12px;
  }
}

.box {
  overflow: hidden;
  position: relative;
  z-index: 0;
  margin-top: 29px;
  box-sizing: border-box;
  border: 1px solid rgba(0, 0, 0, 0.14);
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 3px 8px -6px rgba(0, 0, 0, 0.1);
}

ul.box {
  display: flex;
  li {
    flex: 1;
    img {
      display: block;
      width: 305px;
      height: 200px;
    }
  }
}

.mt30 {
  margin-top: 30px;
}

.hot {
  display: flex;
  > div {
    flex: 1;
    width: 25%;
  }
}

.floors {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  .imgbanner {
    border-right: 1px solid #efefef;
    border-bottom: 1px solid #efefef;
    width: 50%;
    height: 430px;
    transition: all 0.5s;
    &:hover {
      transform: translateY(-5px);
      box-shadow: 1px 1px 10px #999;
      .good-price .price {
        display: none;
      }
      .ds {
        display: flex;
      }
    }
    .cover-link {
      cursor: pointer;
      display: block;
      position: absolute;
      top: 60px;
      left: 0;
      width: 50%;
      height: 430px;
      z-index: 4;
      background: url(data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEHAAEALAAAAAABAAEAAAICTAEAOw==)
        repeat;
    }
    .cover-link:hover {
      box-shadow: inset 0 0 38px rgba(0, 0, 0, 0.08);
      transition: all 0.15s ease;
    }
  }
  img {
    display: block;
    width: 100%;
    height: 100%;
  }
}
</style>
