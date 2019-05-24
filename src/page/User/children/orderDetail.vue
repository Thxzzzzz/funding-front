// TODO 取消订单还没做，打开后没有检测订单是否还有效
<template>
  <div>
    <y-shelf v-bind:title="orderTitle">
      <div slot="content">
        <div v-loading="loading"
             element-loading-text="加载中..."
             style="min-height: 10vw;"
             v-if="orderItem">
          <div class="orderStatus"
               v-if="orderItem.order_status < 6">
            <el-steps :space="200"
                      :active="orderItem.order_status">
              <el-step title="下单"
                       v-bind:description="_formatDate(orderItem.created_at) "></el-step>
              <el-step title="付款"
                       v-bind:description="_formatDate(orderItem.paid_at)"></el-step>
              <el-step title="配货"
                       description=""></el-step>
              <el-step title="出库"
                       description=""></el-step>
              <el-step title="交易成功"
                       v-bind:description="_formatDate(orderItem.finished_at)"></el-step>
            </el-steps>
          </div>
          <div class="orderStatus-close"
               v-if="orderItem.order_status  === 6">
            <el-steps :space="267"
                      :active="3">
              <el-step title="下单"
                       v-bind:description="_formatDate(orderItem.created_at)"></el-step>
              <el-step title="付款"
                       v-bind:description="_formatDate(orderItem.paid_at)"></el-step>
              <el-step title="申请退款"></el-step>
              <el-step title="交易关闭"
                       v-bind:description="_formatDate(orderItem.close_at)"></el-step>
            </el-steps>
          </div>
          <div class="orderStatus-close"
               v-if="orderItem.order_status === 7">
            <el-steps :space="780"
                      :active="2">
              <el-step title="下单"
                       v-bind:description="_formatDate(orderItem.created_at)"></el-step>
              <el-step title="交易关闭"
                       v-bind:description="_formatDate(orderItem.close_at)"></el-step>
            </el-steps>
          </div>
          <div class="status-now"
               v-if="orderItem.order_status === 1">
            <ul>
              <li class="status-title">
                <h3>订单状态：待付款
                </h3>
              </li>
              <li class="button">
                <el-button @click="orderPayment(orderId)"
                           v-if="orderItem.funding_status === 3"
                           type="primary"
                           size="small">现在付款</el-button>
                <el-button @click="_cancelOrder()"
                           size="small">取消订单</el-button>
              </li>
            </ul>
            <p class="realtime">
              <span>在众筹结束前您都可以付款 还有:</span>
              <span class="red">
                <countDown v-bind:endTime="String(getTimestamp(orderItem.end_time))"
                           endText="已结束"></countDown>
              </span>
              <span> 该订单对应产品库存还有：</span> <span class="red">{{orderItem.stock}}</span> <span> 件</span>

            </p>
          </div>
          <div class="status-now"
               v-if="orderItem.order_status === 2">
            <ul>
              <li class="status-title">
                <h3>订单状态：已支付</h3>
              </li>
              <li class="button">
                <el-button @click="_cancelOrder()"
                           size="small">退款并取消订单</el-button>
              </li>
            </ul>
            <p class="realtime">
              <span>请耐心等待，产品将在众筹成功后一段时间内发出</span>
            </p>
          </div>
          <div class="status-now"
               v-if="orderItem.order_status === 3">
            <ul>
              <li class="status-title">
                <h3>订单状态：配货</h3>
              </li>
              <li class="button">
                <el-button @click="refundDialogShow = true"
                           size="small">申请退款</el-button>
              </li>
            </ul>
            <p class="realtime">
              您的订单已经开始配货
            </p>
          </div>
          <div class="status-now"
               v-if="orderItem.order_status === 4">
            <ul>
              <li class="status-title">
                <h3>订单状态：已发货 </h3>

              </li>
              <li class="button">
                <el-button @click="_receivedProduct()"
                           type="success"
                           size="mini"> 确认收货</el-button>
                <el-button @click="refundDialogShow = true"
                           size="small">申请退款</el-button>
              </li>
            </ul>
            <p class="realtime">
              物流单号为 : {{orderItem.checking_number}}
              <el-button @click="queryShipping()"
                         style="margin-left:10px;"
                         type="primary"
                         size="mini"
                         round> 点击查询</el-button>
            </p>
          </div>

          <div class="status-now"
               v-if="orderItem.order_status === 6">
            <ul>
              <li class="status-title">
                <h3>订单状态：正在申请退款</h3>
              </li>
            </ul>
            <div class="realtime">
              <p>申请退款原因：{{orderItem.refund_reason}}</p>
              <span>正在申请退款，等待商家确认。</span>
            </div>
          </div>

          <div class="status-now"
               v-if="orderItem.order_status === 5">
            <ul>
              <li class="status-title">
                <h3>订单状态：已完成</h3>
              </li>
            </ul>
            <p class="realtime">
              <span>您的订单已交易成功，感谢您的支持！</span>
            </p>
          </div>

          <div class="status-now"
               v-if="showCanRefundReason">
            <ul>
              <li class="status-title">
                <h3>退款被拒绝</h3>
              </li>
            </ul>
            <p class="realtime">
              <span>拒绝原因：{{orderItem.refund_reason}}</span>
            </p>
          </div>

          <div class="gray-sub-title cart-title">
            <div class="first">
              <div>
                <span class="order-id">商品名称</span>
              </div>
              <div class="f-bc">
                <span class="price">单价</span>
                <span class="num">数量</span>
                <span class="operation">小计</span>
              </div>
            </div>
          </div>

          <!--商品-->
          <div class="goods-table">
            <div class="cart-items">
              <a @click="goodsDetails(orderItem.product_id)"
                 class="img-box"><img :src="orderItem.image_url"
                     alt=""></a>
              <div class="name-cell ellipsis">
                <a @click="goodsDetails(orderItem.product_id)"
                   title=""
                   target="_blank">{{orderItem.product_name}}</a>
              </div>
              <div class="n-b">
                <div class="price">¥ {{Number(orderItem.unit_price).toFixed(2)}}</div>
                <div class="goods-num">{{orderItem.nums}}</div>
                <div class="subtotal"> ¥ {{Number(orderItem.unit_price * orderItem.nums).toFixed(2)}}</div>
              </div>
            </div>
          </div>
          <!--合计-->
          <div class="order-discount-line">
            <p style="font-size: 14px;font-weight: bolder;"> <span style="padding-right:47px">商品总计：</span>
              <span style="font-size: 16px;font-weight: 500;line-height: 32px;">¥ {{Number(orderItem.total_price).toFixed(2)}}</span>
            </p>
            <p><span style="padding-right:30px">运费：</span>
              <span style="font-weight: 700;">+ ¥ {{Number(orderItem.freight).toFixed(2)}}</span></p>
            <p class="price-total"><span>应付金额：</span>
              <span class="price-red">¥ {{Number(orderItem.total_price + orderItem.freight).toFixed(2)}}</span></p>
          </div>

          <div class="gray-sub-title cart-title">
            <div class="first">
              <div>
                <span class="order-id">收货信息</span>
              </div>
            </div>
          </div>
          <div style="height: 155px;padding: 20px 30px;">
            <p class="address">姓名：{{ orderItem.name }}</p>
            <p class="address">联系电话：{{ orderItem.phone }}</p>
            <p class="address">详细地址：{{ orderItem.address }}</p>
          </div>
        </div>
        <div v-loading="loading"
             element-loading-text="加载中..."
             v-else>
          <div style="padding: 100px 0;text-align: center">
            获取该订单信息失败
          </div>
        </div>
      </div>
    </y-shelf>
    <el-dialog :visible.sync="refundDialogShow"
               title="申请退款">
      <el-input type="textarea"
                v-model="refundReason"
                placeholder="请输入退款原因，如有退货请输入订单号"> </el-input>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="refundDialogShow = false">取 消</el-button>
        <el-button type="primary"
                   @click="_refundOrder()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import { getOrderDet, cancelOrder, receivedOrder, refundOrder } from '/api/goods'
  import YShelf from '/components/shelf'
  import { formatDate } from '/utils/dateUtil'
  import countDown from '/components/countDown'
  import dayjs from 'dayjs'
  export default {
    data () {
      return {
        // 后端返回的订单数据
        orderItem: {},
        orderId: [],
        // 订单标题，最上面显示订单号
        orderTitle: '',
        loading: true,
        // 退款原因
        refundReason: '',
        // 申请退款对话框
        refundDialogShow: false
      }
    },
    computed: {
      // 是否显示被拒绝退款原因
      showCanRefundReason () {
        return this.orderItem.order_status !== 6 &&
                this.orderItem.order_status < 6 &&
               this.orderItem.last_status !== 1 &&
               this.orderItem.refund_reason.length > 1
      }
    },
    methods: {
      // 打开快递 100 页面查询物流信息
      queryShipping () {
        window.open('https://m.kuaidi100.com/result.jsp?nu=' + this.orderItem.checking_number)
      },
      _formatDate (date) {
        return formatDate(date)
      },
      getTimestamp (dateStr) {
        let value = dayjs(dateStr).valueOf()
        return value
      },
      message (m) {
        this.$message.error({
          message: m
        })
      },
      orderPayment (orderId) {
        let jsonStr = JSON.stringify(orderId)
        window.open(window.location.origin + '#/order/payment?orderId=' + jsonStr)
      },
      goodsDetails (id) {
        window.open(window.location.origin + '#/goodsDetails?productId=' + id)
      },
            // 获取订单详情
      _getOrderDet () {
        let params = {
          params: {
            // 转成 JSON 字符串再传
            orderId: JSON.stringify(this.orderId)
          }
        }
        getOrderDet(params).then(res => {
          if (res.code !== 200) {
            this.loading = false
            return
          }
          let item = res.data[0]
          this.orderList = res.data
          this.orderItem = item
  
          if (item.order_status === 6) {
            this.finished_at = item.finished_at
          }
          this.end_time = item.end_time
          this.loading = false
        })
      },
      // 申请退款
      _refundOrder () {
        let params = { id: this.orderItem.order_id, refund_reason: this.refundReason }
        refundOrder(params).then(res => {
          if (res.code === 200) {
            this._getOrderDet()
            this.refundDialogShow = false
          } else {
            this.message('申请退款出错' + res.message)
          }
        })
      },
      // 确认收货
      _receivedOrder () {
        let params = { id: this.orderItem.order_id }
        receivedOrder(params).then(res => {
          if (res.code === 200) {
            this._getOrderDet()
          } else {
            this.message('确认收货出错' + res.message)
          }
        })
      },
      //  取消订单 未付款时可以直接取消
      _cancelOrder () {
        let params = {id: this.orderItem.order_id}
        cancelOrder(params).then(res => {
          if (res.code === 200) {
            this._getOrderDet()
          } else {
            this.message('取消失败' + res.message)
          }
        })
      }
    },
    created () {
      let olJson = JSON.parse(this.$route.query.orderId)
      this.orderId = olJson
      this.orderTitle = '订单号：' + olJson
      this._getOrderDet()
    },
    components: {
      YShelf,
      countDown
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../../assets/style/mixin";

  .orderStatus {
    align-items: center;
    flex-direction: row;
    margin: 50px -150px 20px 60px;
  }

  .orderStatus-close {
    align-items: center;
    flex-direction: row;
    margin: 50px -800px 20px 60px;
  }

  .status-now {
    background: #F6F6F6;
    border: 1px solid #dadada;
    border-radius: 5px;
    padding: 22px 30px 20px;
    margin: 0 30px 30px 30px;
    line-height: 38px;
  }

  .status-title {
    font-size: 18px;
    color: #666;
  }

  .button {
    float: right;
    margin: -37px 0 20px 0;
  }

  .realtime {
    border-top: 1px solid #dcdcdc;
    margin-top: 20px;
    padding-top: 26px;
  }

  .red {
    color: #d44d44;
  }

  .address {
    line-height: 38px;
    word-wrap: break-word;
    word-spacing: normal;
    word-break: break-all;
    color: #626262;
  }

  .img-box {
    border: 1px solid #EBEBEB;
    margin-left: -80px;
  }
  
  img {
    display: block;
    @include wh(80px);
  }

  .goods-table {
    .n-b {
      display: flex;
      align-items: center;
      justify-content: center;
      > div {
        color: #626262;
        font-weight: 700;
        width: 165px;
        text-align: center;
      }
    }
    .cart-items {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 110px;
      padding: 15px 0 15px 111px;
      border-bottom: 1px solid #EFEFEF;
      a {
        color: #333;
      }
    }
    .price {
      padding-left: 107px;
    }
    .goods-num {
      padding-left: 60px;
    }
  }

  .order-discount-line {
    padding: 22px 30px 20px;
    line-height: 24px;
    text-align: right;
    font-size: 12px;
    &:first-child {
      line-height: 32px;
      text-align: right;
      font-size: 14px;
      font-weight: bolder;
    }
  }

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
          width: 130px;
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
    margin-left: 10px;
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

  .price-total {
    height: 54px;
    line-height: 54px;
    font-size: 18px;
  }

  .price-red {
    font-weight: 700;
    color: #d44d44;
  }
</style>
