<template>
  <div>
    <y-shelf title="我的订单">
      <div slot="content">
        <div class="flitter">
          <!-- 筛选订单状态 -->
          <el-select v-model="order_status"
                     clearable
                     @change="_orderList()"
                     placeholder="订单状态">
            <el-option v-for="item in order_status_op"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>

          <!-- 筛选众筹状态 -->
          <el-select v-model="funding_status"
                     clearable
                     @change="_orderList()"
                     placeholder="众筹状态">
            <el-option v-for="item in funding_status_op"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div v-loading="loading"
             element-loading-text="加载中..."
             v-if="orderList.length"
             style="min-height: 10vw;">
          <div v-for="(item,i) in orderList"
               :key="i">
            <div class="gray-sub-title cart-title">
              <div class="first">
                <div>
                  <span class="date"
                        v-text="formatDate(item.created_at)"></span>
                  <span class="order-id"> 订单号： <a @click="orderDetail(item.order_id)">{{item.order_id}}</a></span>
                </div>
                <div class="f-bc">
                  <span class="price">单价</span>
                  <span class="num">数量</span>
                  <span class="operation">商品操作</span>
                </div>
              </div>
              <div class="last">
                <span class="sub-total">实付金额</span>
                <span class="order-detail"> <a @click="orderDetail(item.order_id)">查看详情 ><em class="icon-font"></em></a> </span>
              </div>
            </div>
            <div class="pr">
              <!-- v-for="(good,j) in item.goodsList" :key="j" -->
              <div class="cart">
                <div class="cart-l"
                     :class="{bt:true}">
                  <div class="car-l-l">
                    <div class="img-box"><a @click="goodsDetails(item.product_id)"><img :src="item.image_url"
                             alt=""></a></div>
                    <div class="info">
                      <p> <a style="color: #626262;"
                           @click="goodsDetails(item.product_id)">{{item.product_name}}</a> </p>
                      <p class="attribute">{{item.description}}</p>
                    </div>

                  </div>
                  <div class="cart-l-r">
                    <div>¥ {{Number(item.unit_price).toFixed(2)}}</div>
                    <div class="num">{{item.nums}}</div>
                    <div class="type">
                      <el-button style="margin-left:20px"
                                 @click="_delOrder(item.order_id,i)"
                                 type="danger"
                                 size="small"
                                 class="del-order">删除此订单</el-button>
                      <!-- <a @click="_delOrder(item.orderId,i)"
                         href="javascript:;"
                         class="del-order">删除此订单</a> -->
                    </div>
                  </div>
                </div>
                <div class="cart-r">
                  <span></span>
                  <span></span>
                </div>
              </div>
              <div class="prod-operation pa"
                   style="right: 0;top: 0;">
                <div class="total">¥ {{item.total_price}}</div>
                <!-- 未付款才会显示 -->
                <div v-if="item.order_status === 1">
                  <!-- 进行中的众筹才能付款 funding_status === 3 -->
                  <el-button @click="orderPayment(item.order_id)"
                             v-if="item.funding_status === 3"
                             type="primary"
                             size="small">现在付款</el-button>
                  <div style="margin-left:15px"
                       v-if="item.order_status === 1 && item.funding_status !== 3">
                    <p>未支付</p>
                    <p>众筹已结束</p>
                  </div>
                </div>
                <div class="status"
                     v-if="item.order_status !== 1"> {{getOrderStatus(item.order_status)}} </div>
              </div>
            </div>
          </div>
        </div>
        <div v-loading="loading"
             element-loading-text="加载中..."
             class="no-info"
             v-else>
          <div style="padding: 100px 0;text-align: center">
            未查询到相关订单
          </div>
        </div>
      </div>
    </y-shelf>
    <div style="float:right">
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="currentPage"
                     :page-sizes="[5, 10, 20, 50]"
                     :page-size="pageSize"
                     layout="total, sizes, prev, pager, next"
                     :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import { orderList, delOrder } from '/api/goods'
  import YShelf from '/components/shelf'
  import { getStore } from '/utils/storage'
  import dayjs from 'dayjs'
  export default {
    data () {
      return {
                // 订单状态选项
        order_status_op: [

          {
            value: 1,
            label: '未支付'
          },
          {
            value: 2,
            label: '已支付'
          },
          // {
          //   value: 3,
          //   label: '正在配货'
          // },
          {
            value: 4,
            label: '已发货'
          },
          {
            value: 5,
            label: '交易成功'
          },
          {
            value: 6,
            label: '正在退款'
          },
          {
            value: 7,
            label: '交易取消'
          }
        ],
        order_status: '',
        // 众筹状态选项
        funding_status_op: [
          {
            value: 1,
            label: '众筹成功'
          },
          {
            value: 2,
            label: '众筹失败'
          },
          {
            value: 3,
            label: '正在众筹'
          }
        ],
        funding_status: '',
        orderList: [0],
        userId: '',
        orderStatus: '',
        loading: true,
        currentPage: 1,
        pageSize: 5,
        total: 0
      }
    },
    methods: {
      message (m) {
        this.$message.error({
          message: m
        })
      },
      formatDate (date) {
        return dayjs(date).format('YYYY年MM月DD日 HH:mm:ss') // 展示
      },
      handleSizeChange (val) {
        this.pageSize = val
        this._orderList()
      },
      handleCurrentChange (val) {
        this.currentPage = val
        this._orderList()
      },
      orderPayment (orderId) {
        let orderIdList = []
        orderIdList.push(orderId)
        let olJson = JSON.stringify(orderIdList)
        window.open(window.location.origin + '#/order/payment?orderId=' + olJson)
      },
      goodsDetails (id) {
        window.open(window.location.origin + '#/goodsDetails?productId=' + id)
      },
      orderDetail (orderId) {
        let orderIdList = []
        orderIdList.push(orderId)
        let olJson = JSON.stringify(orderIdList)
        this.$router.push({
          path: 'orderDetail',
          query: {
            orderId: olJson
          }
        })
      },
      getOrderStatus (status) {
        if (status === 1) {
          return '待支付'
        } else if (status === 2) {
          return '已支付'
        } else if (status === 3) {
          return '正在配货'
        } else if (status === 4) {
          return '已发出'
        } else if (status === 5) {
          return '交易成功'
        } else if (status === 6) {
          return '正在退款'
        } else if (status === 7) {
          return '交易关闭'
        }
      },
      _orderList () {
        let params = {
          params: {
            page_size: this.pageSize,
            page: this.currentPage,
            order_status: this.order_status,
            funding_status: this.funding_status
          }
        }
        orderList(params).then(res => {
          if (res.code === 200) {
            this.orderList = res.data.order_list
            this.total = res.data.total
          }
          this.loading = false
        })
      },
      _delOrder (orderId, i) {
        let params = {
          params: {
            id: orderId
          }
        }
        delOrder(params).then(res => {
          if (res.code === 200) {
            this.orderList.splice(i, 1)
          } else {
            this.message('删除失败')
          }
        })
      }
    },
    created () {
      this.userId = getStore('userId')
      this._orderList()
    },
    components: {
      YShelf
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../../assets/style/mixin";

  .gray-sub-title {
    height: 38px;
    padding: 0 24px;
    background: #EEE;
    border-top: 1px solid #DBDBDB;
    border-bottom: 1px solid #DBDBDB;
    line-height: 38px;
    font-size: 12px;
    color: #666;
    display: flex;
    span {
      display: inline-block;
      height: 100%;
    }
    .first {
      display: flex;
      justify-content: space-between;
      flex: 1;
      .f-bc {
        > span {
          width: 112px;
          text-align: center;
        }
      }
    }
    .last {
      width: 230px;
      text-align: center;
      display: flex;
      border-left: 1px solid #ccc;
      span {
        flex: 1;
      }
    }
  }

  .bt {
    border-top: 1px solid #EFEFEF;
  }

  .date {
    padding-left: 0px;
  }

  .order-id {
    margin-left: 25px;
  }

  .flitter{
      margin:10px
  }

  .cart {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 24px;
    &:hover {
      .del-order {
        display: block;
      }
    }
    .del-order {
      display: none;
    }

    .cart-l {
      display: flex;
      align-items: center;
      flex: 1;
      padding: 15px 0;
      justify-content: space-between;
      position: relative;
      &:before {
        position: absolute;
        content: ' ';
        right: -1px;
        top: 0;
        width: 1px;
        background-color: #EFEFEF;
        height: 100%;
      }
      .ellipsis {
        margin-left: 20px;
        width: 220px;
      }
      .img-box {
        border: 1px solid #EBEBEB;
      }
      img {
        display: block;
        @include wh(80px);
      }
      .cart-l-r {
        display: flex;
        > div {
          text-align: center;
          width: 112px;
        }
      }
      .car-l-l {
        display: flex;
        align-items: center;
      }
    }
    .cart-r {
      width: 230px;
      display: flex;
      span {
        text-align: center;
        flex: 1;
      }
    }
  }
  .info{
     height: 70px;
     margin: 0 0 0 15px;
     text-align: left;
     width: 270px;
     overflow: hidden;
  }
    .attribute, .name p {
    color: #999;
    font-size: 12px;
    padding-top: 4px;
    line-height: 17px;
  }
  .prod-operation {
    height: 110px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 254px;
    div {
      width: 100%;
      text-align: center;
    }
    div:last-child {
      padding-right: 24px;
    }
  }
</style>
