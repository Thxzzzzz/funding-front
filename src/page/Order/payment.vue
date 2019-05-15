<template>
  <div class="w"
       style="padding-bottom: 100px;">
    <y-shelf title="支付订单">
      <div slot="content">
        <div class="box-inner order-info">
          <h3>请您完成支付</h3>
          <!-- <p class="payment-detail">请在 <span>24 小时内</span>完成支付，超时订单将自动取消。</p> -->
          <p class="payment-detail">商品将在众筹成功后一定时间内发出，详情可查看商品介绍页</p>
        </div>
        <div class="pay-info">

        </div>
        <!--支付方式-->
        <div class="pay-type">
          <div class="p-title">支付方式</div>
          <div class="pay-item">
            <div :class="{active:payType==1}"
                 @click="payType=1"><img src="/static/images/alipay@2x.png"
                   alt=""></div>
            <div :class="{active:payType==2}"
                 @click="payType=2"><img src="/static/images/weixinpay@2x.png"
                   alt=""></div>
            <div :class="{active:payType==3}"
                 @click="payType=3"><img src="/static/images/qqpay.png"
                   alt=""></div>
          </div>
        </div>

        <div>
          <div class="box-inner">
            <div>
              <span>
                订单金额：
              </span>
              <em><span>¥</span>{{orderTotal.toFixed(2)}}</em>
              <span>
                实际应付金额：
              </span>
              <em><span>¥</span>{{Number(totalPay).toFixed(2)}}</em>
              <!-- :classStyle="submit?'main-btn':'disabled-btn'" -->
              <y-button :text="payNow"
                        :classStyle="'main-btn'"
                        style="width: 120px;height: 40px;font-size: 16px;line-height: 38px"
                        @btnClick="paySuc()"></y-button>
            </div>
          </div>
        </div>

      </div>
    </y-shelf>
    <!--地址信息-->
    <div class="p-msg w">
      <div class="confirm-detail">
        <div class="info-title">收货信息</div>
        <p class="info-detail">姓名：{{name}}</p>
        <p class="info-detail">联系电话：{{phone}}</p>
        <p class="info-detail">详细地址：{{address}}</p>
      </div>
    </div>
    <div class="confirm-table-title">
      <span class="name">商品信息</span>
      <div>
        <span class="price">单价</span>
        <span class="num">数量</span>
        <span class="subtotal">小计</span>
      </div>
    </div>
    <!--商品-->
    <div class="confirm-goods-table">
      <div class="cart-items"
           v-for="(item,i) in cartList"
           :key="i">
        <div class="name">
          <div class="name-cell ellipsis">
            <a @click="goodsDetails(item.product_id)"
               title=""
               target="_blank">{{item.product_name}}</a>
            <ul class="attribute">
              <li>{{item.description}}</li>
            </ul>
          </div>
        </div>
        <div class="n-b">
          <div class="price">¥ {{item.unit_price}}</div>
          <div class="goods-num">{{item.nums}}</div>
          <div class="subtotal">
            <div class="subtotal-cell"> ¥ {{item.unit_price * item.nums}}<br></div>
          </div>
        </div>
      </div>
    </div>
    <!--合计-->
    <div class="order-discount-line">
      <p style="font-size: 14px;font-weight: bolder;"> <span style="padding-right:47px">商品总计：</span>
        <span style="font-size: 16px;font-weight: 500;line-height: 32px;">¥ {{orderTotal}}</span>
      </p>
      <p><span style="padding-right:30px">运费：</span><span style="font-weight: 700;">+ ¥{{freight}} </span></p>
    </div>
  </div>
</template>
<script>
  import YShelf from '/components/shelf'
  import YButton from '/components/YButton'
  import { getOrderDet, orderPay } from '/api/goods'
  import { getStore } from '/utils/storage'
  // , setStore
  export default {
    data () {
      return {
        payType: 1,
        address: '',
        phone: '',
        name: '',
        addList: {},
        cartList: [],
        addressId: 0,
        productId: '',
        num: '',
        userId: '',
        orderTotal: 0,
        payNow: '立刻支付',
        submit: false,
        nickName: '',
        money: 0.00,

        info: '',
        email: '',
        orderId: [],
        freight: 0,
        type: '',
        isCustom: false,
        maxLength: 30
      }
    },
    computed: {
      // 选中的总价格
      checkPrice () {
        let totalPrice = 0
        this.cartList && this.cartList.forEach(item => {
          if (item.checked === true) {
            totalPrice += (item.nums * item.unit_price)
          }
        })
        return totalPrice
      },
      totalPay () {
        return this.orderTotal + this.freight
      }
    },
    methods: {
      messageFail (m) {
        this.$message.error({
          message: m
        })
      },
      goodsDetails (id) {
        window.open(window.location.origin + '#/goodsDetails?productId=' + id)
      },
      _getOrderDet (orderId) {
        let params = {
          params: {
            // 转成 JSON 字符串再传
            orderId: JSON.stringify(this.orderId)
          }
        }
        getOrderDet(params).then(res => {
          if (res.code === 200) {
            this.cartList = res.data
            this.name = res.data[0].name
            this.phone = res.data[0].phone
            this.address = res.data[0].address

            for (let item of res.data) {
              this.orderTotal += item.total_price
              this.freight += item.freight
            }
          }
        })
      },
      paySuc () {
        this.payNow = '支付中...'
        this.submit = false
        orderPay(this.orderId).then(res => {
          if (res.code === 200) {
            this.$router.push({path: '/order/paysuccess', query: {price: this.orderTotal}})
          } else {
            this.payNow = '立刻支付'
            this.submit = true
            this.messageFail(res.message)
          }
        })
      },
      isMoney (v) {
        if (v < 0.1) {
          return false
        }
        var regu = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
        var re = new RegExp(regu)
        if (re.test(v)) {
          return true
        } else {
          return false
        }
      },
      isEmail (v) {
        var regu = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/
        var re = new RegExp(regu)
        if (re.test(v)) {
          return true
        } else {
          return false
        }
      }
    },
    created () {
      this.userId = getStore('userId')
      let olJson = JSON.parse(this.$route.query.orderId)
      this.orderId = olJson
      if (this.orderId) {
        this._getOrderDet(this.orderId)
      } else {
        this.$router.push({path: '/'})
      }
    },
    components: {
      YShelf,
      YButton
    }
  }
</script>
<style lang="scss" scoped rel="stylesheet/scss">
  .w {
    padding-top: 39px;
  }

  .order-info {
    padding: 60px 0 55px;
    color: #333;
    background: #fff !important;
    h3 {
      padding-bottom: 14px;
      line-height: 36px;
      text-align: center;
      font-size: 36px;
      color: #212121;
    }
    .payment-detail {
      text-align: center;
      line-height: 24px;
      font-size: 14px;
      color: #999;
    }
  }

  /*支付类型*/
  .pay-type {
    margin: 0 auto;
    width: 90%;
    padding-bottom: 30px;
    .p-title {
      font-size: 18px;
      line-height: 40px;
      padding: 0 10px;
      position: relative;
      &:before {
        content: ' ';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        border-bottom: 1px solid #ccc;
      }
    }

  }

  .pay-type {
    .pay-item {
      display: flex;
      align-items: center;
      div {
        margin-top: 20px;
        width: 175px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #E5E5E5;
        cursor: pointer;
        border-radius: 6px;
        margin-right: 10px;
        background: #FAFAFA;
        &.active {
          border-color: #6A8FE5;
          background: #fff;
        }
        img {
          display: block;
          height: 34px;
          margin: 8px auto;
        }
      }
    }
  }

  .box-inner {
    line-height: 60px;
    background: #f9f9f9;
    border-top: 1px solid #e5e5e5;
    box-sizing: border-box;
    > div {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding: 0 20px;
    }
    em {
      margin-left: 5px;
      font-size: 24px;
      color: #d44d44;
      font-weight: 700;
      margin-right: 20px;
      span {
        margin-right: 4px;
        font-size: 16px;

      }
    }
  }

  .confirm-detail {
    padding: 0 30px 25px;
    border-top: 1px solid #d5d5d5;
    .info-title {
      height: 14px;
      margin: 30px 0 17px;
      line-height: 14px;
      font-weight: bolder;
      color: #333;
    }
    .info-detail {
      line-height: 24px;
      color: #666;
    }
  }

  .confirm-table-title {
    padding: 3px 0 0 33px;
    border-top: 1px solid #D5D5D5;
    line-height: 54px;
    font-weight: bolder;
    color: #000;
    display: flex;
    justify-content: space-between;
    span {
      display: inline-block;
      width: 175px;
      text-align: left;
    }
    .price {
      padding-left: 80px;
    }
    .num {
      padding-left: 75px;
    }
    .subtotal {
      padding-left: 72px;
    }
  }

  .confirm-goods-table {
    border-top: 1px solid #D5D5D5;
    .cart-items {
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      a {
        color: #333;
      }
    }
    .n-b {
      display: flex;
      align-items: center;
      justify-content: center;
      > div {
        color: #626262;
        font-weight: 700;
        width: 175px;
        text-align: center;
      }
    }
  }

  .order-discount-line {
    padding: 22px 30px 53px;
    border-top: 1px solid #D5D5D5;
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

  .name {
    width: 40%;
  }

  .name-cell {
    padding-left: 33px;
  }

  .input {
    width:30%;
    margin:0 0 1vw 38px;
  }

  .pay-info {
    margin-top: -2vw;
    text-align: center;
  }

  .money-select {
    width: 31%;
    padding-left: 10px;
    margin-bottom: 1vw;
  }
  .attribute {
    color: #999;
    font-size: 12px;
    padding-top: 4px;
    line-height: 17px;
    width: 300px;
    white-space:normal;
    word-break:break-all;
    word-wrap:break-word; 
  }

</style>
