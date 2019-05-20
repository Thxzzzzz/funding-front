<template>
  <div class="goods">
    <div class="nav">
      <!-- 排序先暂时注释掉，做好了再另外写 -->
      <!-- <div class="w">
        <a href="javascript:;"
           :class="{active:sortType===1}"
           @click="reset()">综合排序</a>
        <a href="javascript:;"
           @click="sortByPrice(1)"
           :class="{active:sortType===2}">价格从低到高</a>
        <a href="javascript:;"
           @click="sortByPrice(-1)"
           :class="{active:sortType===3}">价格从高到低</a>
        <div class="price-interval">
          <input type="number"
                 class="input"
                 placeholder="价格"
                 v-model="min">
          <span style="margin: 0 5px"> - </span>
          <input type="number"
                 placeholder="价格"
                 v-model="max">
          <y-button text="确定"
                    classStyle="main-btn"
                    @btnClick="reset"
                    style="margin-left: 10px;"></y-button>
        </div>
      </div> -->
    </div>

    <div v-loading="loading"
         element-loading-text="加载中..."
         style="min-height: 35vw;">
      <div class="img-item"
           v-if="!noResult">
        <!--商品-->
        <div class="goods-box w">
          <mall-goods v-for="(item,i) in goods"
                      class="product-item"
                      :key="i"
                      :msg="item"></mall-goods>
        </div>

        <el-pagination v-if="!noResult&&!error"
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="currentPage"
                       :page-sizes="[8, 20, 40, 80]"
                       :page-size="pageSize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="total">
        </el-pagination>
      </div>
      <div class="no-info"
           v-if="noResult">
        <div class="no-data">
          <img src="/static/images/no-search.png">
          <br> 抱歉！暂时还没有商品
        </div>
        <section class="section">
          <y-shelf :title="recommendPanel.name">
            <div slot="content"
                 class="recommend">
              <mall-goods :msg="item"
                          v-for="(item,i) in recommendPanel.panelContents"
                          :key="i"></mall-goods>
            </div>
          </y-shelf>
        </section>
      </div>
      <div class="no-info"
           v-if="error">
        <div class="no-data">
          <img src="/static/images/error.png">
          <br> 抱歉！出错了...
        </div>
        <section class="section">
          <y-shelf :title="recommendPanel.name">
            <div slot="content"
                 class="recommend">
              <mall-goods :msg="item"
                          v-for="(item,i) in recommendPanel.panelContents"
                          :key="i"></mall-goods>
            </div>
          </y-shelf>
        </section>
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

    </div>
  </div>
</template>
<script>
  import { productList, getProductsRand } from '/api/goods.js'
  // import { recommend } from '/api/index.js'
  import mallGoods from '/components/mallGoods'
  import YButton from '/components/YButton'
  import YShelf from '/components/shelf'
  import { getRecommendType } from '/utils/storage'
  export default {
    data () {
      return {
        goods: [],
        noResult: false,
        error: false,
        min: '',
        max: '',
        loading: true,
        timer: null,
        sortType: 1,
        windowHeight: null,
        windowWidth: null,
        recommendPanel: [],
        sort: '',
        currentPage: 1,
        total: 0,
        pageSize: 20,
        queryName: '',
        queryType: 0,
        // 猜你喜欢列表
        recommendProducts: []
      }
    },
    methods: {
      handleSizeChange (val) {
        this.pageSize = val
        this._getAllGoods()
        this.loading = true
      },
      handleCurrentChange (val) {
        this.currentPage = val
        this._getAllGoods()
        this.loading = true
      },
      _getAllGoods () {
        // let cid = this.$route.query.cid
        if (this.min !== '') {
          this.min = Math.floor(this.min)
        }
        if (this.max !== '') {
          this.max = Math.floor(this.max)
        }
        let params = {
          params: {
            page: this.currentPage,
            page_size: this.pageSize,
            name: this.queryName,
            type: this.queryType,
            sort: this.sort,
            price_gt: this.min,
            price_lt: this.max
          }
        }
        productList(params).then(res => {
          if (res.code === 200) {
            this.total = res.data.total
            this.goods = res.data.product_contents
            this.noResult = false
            if (this.total === 0) {
              this.noResult = true
            }
            this.error = false
          } else {
            this.error = true
          }
          this.loading = false
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
    watch: {
      $route (to, from) {
        if (to.fullPath.indexOf('/goods?cid=') >= 0) {
          this.cId = to.query.cid
          this._getAllGoods()
        }
      }
    },
    created () {
    },
    mounted () {
      this.windowHeight = window.innerHeight
      this.windowWidth = window.innerWidth
      // 从路由获取商品名
      this.queryName = this.$route.query.name
      this.queryType = this.$route.query.type
      this._getAllGoods()
       // 获取猜你喜欢列表
      this.getRecommendProducts()
    },
    components: {
      mallGoods,
      YButton,
      YShelf
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/style/mixin";
  @import "../../assets/style/theme";

  .mt30 {
    margin-top: 30px;
  }
  .floors {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: center;

  }

  .product-item {
    width: 25%;
  }
  .nav {
    height: 60px;
    line-height: 60px;
    > div {
      display: flex;
      align-items: center;
      a {
        padding: 0 15px;
        height: 100%;
        @extend %block-center;
        font-size: 12px;
        color: #999;
        &.active {
          color: #5683EA;
        }
        &:hover {
          color: #5683EA;
        }
      }
      input {
        @include wh(80px, 30px);
        border: 1px solid #ccc;
      }
      input + input {
        margin-left: 10px;
      }
    }
    .price-interval {
      padding: 0 15px;
      @extend %block-center;
      input[type=number] {
        border: 1px solid #ccc;
        text-align: center;
        background: none;
        border-radius: 5px;
      }
    }
  }

  .goods-box {
    > div {
      float: left;
      border: 1px solid #efefef;
    }
  }

  .no-info {
    padding: 100px 0;
    text-align: center;
    font-size: 30px;
    display: flex;
    flex-direction: column;
    .no-data{
      align-self: center;
    }
  }

  .img-item{
    display: flex;
    flex-direction: column;
  }

  .el-pagination{
    align-self: flex-end;
    margin: 3vw 10vw 2vw;
  }

  .section {
    padding-top: 8vw;
    margin-bottom: -5vw;
    width: 1218px;
    align-self: center;
  }

  .recommend {
    display: flex;
    > div {
      flex: 1;
      width: 25%;
    }
  }



</style>
