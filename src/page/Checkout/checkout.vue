<template>
  <div class="checkout">
    <y-header>
      <div slot="nav"></div>
    </y-header>
    <div class="w"
         style="padding-top: 40px;">
      <!-- 收货地址 -->
      <y-shelf title="收货信息">
        <div slot="content">
          <ul class="address-item-list clearfix">
            <li v-for="(item,i) in addList"
                :key="i"
                class="address pr"
                :class="{checked:addressId === item.id}"
                @click="chooseAddress(item)">
              <span v-if="addressId === item.id"
                    class="pa">
                <svg viewBox="0 0 1473 1024"
                     width="17.34375"
                     height="12">
                  <path d="M1388.020 57.589c-15.543-15.787-37.146-25.569-61.033-25.569s-45.491 9.782-61.023 25.558l-716.054 723.618-370.578-374.571c-15.551-15.769-37.151-25.537-61.033-25.537s-45.482 9.768-61.024 25.527c-15.661 15.865-25.327 37.661-25.327 61.715 0 24.053 9.667 45.849 25.327 61.715l431.659 436.343c15.523 15.814 37.124 25.615 61.014 25.615s45.491-9.802 61.001-25.602l777.069-785.403c15.624-15.868 25.271-37.66 25.271-61.705s-9.647-45.837-25.282-61.717M1388.020 57.589z"
                        fill="#6A8FE5"
                        p-id="1025">
                  </path>
                </svg>
              </span>
              <p>收货人: {{item.name}} {{isDefaultAddress(item.id) ? '(默认地址)' : ''}}</p>
              <p class="street-name">收货地址: {{item.address}}</p>
              <p>手机号码: {{item.phone}}</p>
              <div class="operation-section">
                <span class="update-btn"
                      style="font-size:12px"
                      @click="update(item)">修改</span>
                <span class="delete-btn"
                      style="font-size:12px"
                      :data-id="item.id"
                      @click="del(item.id)">删除</span>
              </div>
            </li>

            <li class="add-address-item"
                @click="update()">
              <img src="../../../static/svg/jia.svg"
                   alt="">
              <p>使用新地址</p>
            </li>
          </ul>
        </div>
      </y-shelf>
      <!-- 购物清单 -->
      <y-shelf title="购物清单">
        <div slot="content">
          <div class="box-inner ui-cart">
            <div>
              <!--标题-->
              <div class="cart-table-title">
                <span class="name">商品信息</span>
                <span class="subtotal">小计</span>
                <span class="num">数量</span>
                <span class="price">单价</span>
              </div>
              <!--列表-->
              <div class="cart-table"
                   v-for="(item,i) in cartList"
                   :key="i"
                   v-if="item.checked">
                <div class="cart-group divide pr"
                     :data-productid="item.product_id">
                  <div class="cart-top-items">
                    <div class="cart-items clearfix">
                      <!--图片-->
                      <div class="items-thumb fl">
                        <img :alt="item.product_name"
                             :src="item.image_url">
                        <a @click="goodsDetails(item.product_id)"
                           :title="item.product_name"
                           target="_blank"></a>
                      </div>
                      <!--信息-->
                      <div class="name hide-row fl">
                        <div class="name-table">
                          <a @click="goodsDetails(item.product_id)"
                             :title="item.product_name"
                             target="_blank"
                             v-text="item.product_name"></a>
                          <ul class="attribute">
                            <li>{{item.description}}</li>
                          </ul>
                        </div>
                      </div>
                      <!--商品数量-->
                      <div>
                        <!--总价格-->
                        <div class="subtotal"
                             style="font-size: 14px">¥ {{Number(item.price * item.nums).toFixed(2)}}</div>
                        <!--数量-->
                        <div class="item-cols-num">
                          <span v-text="item.nums"></span>
                        </div>
                        <!--价格-->
                        <div class="price">¥ {{item.price}}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 合计 -->
            <div class="cart-bottom-bg fix-bottom">
              <div class="fix-bottom-inner">
                <div class="shipping">
                  <div class="shipping-box"
                       style="padding: 0 40px;">
                    <div class="shipping-total shipping-price">
                      <h4 class="highlight">应付总额：<em>￥{{checkPrice}}</em>
                      </h4>
                    </div>
                  </div>
                  <y-button class="big-main-btn"
                            :classStyle="submit?'disabled-btn':'main-btn'"
                            style="margin: 0;width: 130px;height: 50px;line-height: 50px;font-size: 16px"
                            :text="submitOrder"
                            @btnClick="_submitOrder">
                  </y-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </y-shelf>

      <y-popup :open="popupOpen"
               @close='popupOpen=false'
               :title="popupTitle">
        <div slot="content"
             class="md"
             :data-id="msg.id">
          <div>
            <input type="text"
                   placeholder="收货人姓名"
                   v-model="msg.name">
          </div>
          <div>
            <input type="number"
                   placeholder="手机号码"
                   oninput="if(value.length > 11)value = value.slice(0, 11)"
                   v-model="msg.phone">
          </div>
          <div>
            <input type="text"
                   placeholder="收货地址"
                   v-model="msg.address">
          </div>
          <div>
            <el-checkbox class="auto-login"
                         v-model="msg.default">设为默认</el-checkbox>
          </div>
          <y-button text='保存'
                    class="btn"
                    :classStyle="btnHighlight?'main-btn':'disabled-btn'"
                    @btnClick="save({userId:userId,id:msg.id,name:msg.name,phone:msg.phone,address:msg.address,default:msg.default})">
          </y-button>
        </div>
      </y-popup>
    </div>
    <y-footer></y-footer>
  </div>
</template>
<script>
  import { getCartList, addressList, addressUpdate, addressAdd, addressDel, checkoutPkgInfo, submitOrder, delCartChecked } from '/api/goods'
  import YShelf from '/components/shelf'
  import YButton from '/components/YButton'
  import YPopup from '/components/popup'
  import YHeader from '/common/header'
  import YFooter from '/common/footer'
  import { getStore } from '/utils/storage'
  import { mapState } from 'vuex'
  export default {
    data () {
      return {
        cartList: [],
        addList: [],
        addressId: 0,
        popupOpen: false,
        popupTitle: '管理收货地址',
        nums: 0, // 立刻购买
        productId: '',
        msg: {
          id: '',
          name: '',
          phone: '',
          address: '',
          default: false
        },
        name: '',
        phone: '',
        address: '',
        userId: '',
        orderTotal: 0,
        submit: false,
        submitOrder: '提交订单',
        // 是否来自购物车
        isFromCartList: false
      }
    },
    computed: {
      ...mapState(['userInfo']),
      btnHighlight () {
        let msg = this.msg
        return msg.name && msg.phone && msg.address
      },
      // 选中的总价格
      checkPrice () {
        let totalPrice = 0
        this.cartList && this.cartList.forEach(item => {
          if (item.checked) {
            totalPrice += (item.nums * item.price)
          }
        })
        this.orderTotal = totalPrice
        return totalPrice
      }
    },
    methods: {
      isDefaultAddress: function (addressId) {
        return this.userInfo.info.default_address_id === addressId
      },
      message (m) {
        this.$message.error({
          message: m
        })
      },
      goodsDetails (id) {
        window.open(window.location.origin + '#/goodsDetails?productId=' + id)
      },
      _getCartList () {
        getCartList().then(res => {
          this.cartList = res.data
        })
      },
      _addressList (chooseLast) {
        addressList().then(res => {
          let data = res.data
          if (data.length) {
            this.addList = data
            for (let i in data) {
              if (this.isDefaultAddress(data[i].id)) {
                this.addressId = data[i].id
                this.name = data[i].name
                this.phone = data[i].phone
                this.address = data[i].address
                break
              }
            }
            if (chooseLast) {
              this.chooseAddress(data[data.length - 1])
            }
          } else {
            this.addList = []
          }
        })
      },
      _addressUpdate (params) {
        addressUpdate(params).then(res => {
          if (params.default) {
            this.userInfo.info.default_address_id = params.id
          }
          this._addressList()
        })
      },
      _addressAdd (params) {
        addressAdd(params).then(res => {
          if (res.code === 200) {
            if (params.default) {
              this.userInfo.info.default_address_id = res.data.id
            }
            this._addressList(true)
          } else {
            this.message(res.message)
          }
        })
      },
      _addressDel (params) {
        addressDel(params).then(res => {
          if (res.code === 200) {
            this._addressList()
          } else {
            this.message(res.message)
          }
        })
      },
      // 提交订单后跳转付款页面
      _submitOrder () {
        this.submitOrder = '提交订单中...'
        this.submit = true
        var array = []
        if (this.id === 0) {
          this.message('请选择收货地址')
          this.submitOrder = '提交订单'
          this.submit = false
          return
        }
        if (this.cartList.length === 0) {
          this.message('非法操作')
          this.submitOrder = '提交订单'
          this.submit = false
          return
        }

        for (var i = 0; i < this.cartList.length; i++) {
          if (this.cartList[i].checked) {
            let OrderPkgItem = {
              user_id: this.cartList[i].user_id,
              seller_id: this.cartList[i].seller_id,
              product_package_id: this.cartList[i].product_package_id,
              price: this.cartList[i].price,
              nums: this.cartList[i].nums,
              product_id: this.cartList[i].product_id
            }
            array.push(OrderPkgItem)
          }
        }
        let params = {
          name: this.name,
          address: this.address,
          phone: this.phone,
          order_pkg_list: array,
          order_total: this.orderTotal
        }
        submitOrder(params).then(res => {
          if (res.code === 200) {
            // 如果是从购物车结算，就删除购物车勾选的字段
            if (this.isFromCartList) {
              this._delCartChecked()
            }
            this.payment(res.data)
          } else {
            this.message(res.message)
            this.submitOrder = '提交订单'
            this.submit = false
          }
        })
      },
      _delCartChecked () {
        delCartChecked().then(res => {
          if (res.code !== 200) {
              // this.message('删除失败')
          }
        })
      },

      // 付款
      payment (orderId) {
        let olJson = JSON.stringify(orderId)
        // 需要拿到地址id
        this.$router.push({
          path: '/order/payment',
          query: {
            'orderId': olJson
          }
        })
      },
      // 选择地址
      chooseAddress (item) {
        this.addressId = item.id
        this.name = item.name
        this.phone = item.phone
        this.address = item.address
      },
      // 修改
      update (item) {
        this.popupOpen = true
        if (item) {
          this.popupTitle = '管理收货地址'
          this.msg.name = item.name
          this.msg.phone = item.phone
          this.msg.address = item.address
          this.msg.default = this.isDefaultAddress(item.id)
          this.msg.id = item.id
        } else {
          this.popupTitle = '新增收货地址'
          this.msg.name = ''
          this.msg.phone = ''
          this.msg.address = ''
          this.msg.default = false
          this.msg.id = ''
        }
      },
      // 保存
      save (p) {
        this.popupOpen = false
        if (p.id) {
          this._addressUpdate(p)
        } else {
          delete p.id
          this._addressAdd(p)
        }
      },
      // 删除
      del (addressId) {
        this._addressDel({id: addressId})
      },
      _productDet (product_package_id) {
        checkoutPkgInfo({params: {product_package_id: product_package_id}}).then(res => {
          let item = res.data
          item.checked = true
          item.nums = this.nums
          this.cartList.push(item)
        })
      }
    },
    created () {
      this.userId = getStore('userId')
      let query = this.$route.query
      if (query.product_package_id && query.nums) {
        // this.product_id = query.product_id
        this.product_package_id = Number(query.product_package_id)
        this.nums = Number(query.nums)
        this._productDet(this.product_package_id)
      } else {
        this._getCartList()
        this.isFromCartList = true
      }
      this._addressList()
    },
    components: {
      YShelf,
      YButton,
      YPopup,
      YHeader,
      YFooter
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  // 收货地址
  .address-item-list {
    padding: 30px 13px 0;
    .address {
      padding: 19px 14px 0 19px;
      p {
        line-height: 26px;
      }
    }
    li.checked {
      border-color: #6A8FE5;
      position: relative;
      background: #fff;
      .pa {
        right: 15px;
        top: 18px;
      }
      &:hover {
        background: #fff;
      }
    }
    li {
      position: relative;
      overflow: hidden;
      float: left;
      width: 276px;
      height: 158px;
      margin: 0 0 30px 16px;
      border: 1px solid #E5E5E5;
      border-radius: 3px;
      background: #FAFAFA;
      line-height: 14px;
      text-align: left;
      word-wrap: break-word;
      word-break: normal;
      color: #626262;
      cursor: pointer;
      -moz-user-select: -moz-none;
      -webkit-user-select: none;
      -o-user-select: none;
      user-select: none;
      &:hover {
        background: #F2F2F2;
        .operation-section {
          visibility: visible;
          transform: translate(0, 0);
        }
      }
      &.add-address-item {
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        p {
          margin-top: 5px;
        }
      }
      .operation-section {
        visibility: hidden;
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 28px;
        background: #E1E1E1;
        border-top: 1px solid #E1E1E1;
        transition: all .2s ease;
        transform: translate(0, 29px);
        border-top: 1px solid #E1E1E1;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 11;
        span {
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 1;
          height: 100%;
          &:hover {
            background: #F2F2F2;
          }
        }

        span + span {
          border-left: 1px solid #E1E1E1;
        }

      }
    }
  }

  .s-content {
    .md {
      width: 400px;
      > div {
        text-align: left;
        margin-bottom: 15px;
        > input {
          width: 100%;
          height: 50px;
          font-size: 18px;
          padding: 10px 20px;
          border: 1px solid #ccc;
          border-radius: 6px;
          box-shadow: 0 3px 5px -4px rgba(0, 0, 0, .4) inset, -1px 0 3px -2px rgba(0, 0, 0, .1) inset;
          line-height: 46px;
        }
      }
    }

    .btn {
      margin: 0;
      width: 100%;
      height: 50px;
      font-size: 14px;
      line-height: 48px
    }
  }

  .ui-cart {
    img {
      width: 80px;
      height: 80px;
    }

    .cart-table-title {
      position: relative;
      z-index: 1;
      line-height: 38px;
      height: 38px;
      padding: 0 0 0 30px;
      font-size: 12px;
      background: #eee;
      border-bottom: 1px solid #dbdbdb;
      border-bottom-color: rgba(0, 0, 0, .08);
      .name {
        float: left;
        text-align: left;
      }
      span {
        width: 137px;
        float: right;
        text-align: center;
        color: #838383;
      }
    }
    .cart-group.divide {
      .cart-items {
        border-top: 1px dashed #eee;
      }
    }
    .cart-items {
      position: relative;
      height: 140px;
      margin-left: 74px;
      .subtotal {
        font-weight: 700;
      }
      .item-cols-num,
      .price,
      .subtotal {
        overflow: hidden;
        float: right;
        width: 137px;
        text-align: center;
        color: #666;
        line-height: 140px;
      }
      /*数量*/
      .subtotal,
      .item-cols-num {
        padding-top: 50px;
        line-height: 40px;
      }
      .select {
        width: 112px;
        height: 40px;
        padding-top: 4px;
        margin: 0 auto;
        line-height: 40px;
        .down {
          background-position: 0 -60px;
        }
        .down.down-disabled:hover {
          background-position: 0 -300px;
          cursor: not-allowed;
        }
        .num {
          position: relative;
          overflow: hidden;
          display: inline-block;
          width: 36px;
          height: 18px;
          margin: 7px 0 0;
          border: none;
          border-radius: 3px;
          line-height: 18px;
          text-align: center;
          font-size: 14px;
          transition: all .2s ease-out;
        }
      }

    }
    .down.down-disabled {
      background-position: 0 -300px;
      cursor: not-allowed;
    }
  }

  .cart-group.divide .cart-top-items:first-child .cart-items {
    border-top: none;
  }

  .items-choose {
    position: absolute;
    left: -74px;
    top: 0;
    width: 74px;
    height: 20px;
    padding: 60px 0 0 31px;
    font-size: 12px;
    color: #999;
  }

  .items-thumb {
    position: relative;
    margin-top: 30px;
    overflow: hidden;
    width: 80px;
    height: 80px;
  }

  .cart-items .items-thumb > a, .ui-cart .cart-items .items-thumb > i {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    border: 1px solid #fff;
    border-radius: 3px;
    border: 0 solid rgba(255, 255, 255, .1);
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .06);
  }

  .name {
    width: 380px;
    margin-left: 20px;
    color: #323232;
    display: table;
    a {
      color: #333;
      font-size: 16px;
    }
  }

  .name-table {
    display: table-cell;
    vertical-align: middle;
    height: 140px;
  }

  .fix-bottom {
    padding: 22px 29px 19px 30px;
    height: 90px;
    width: 100%;
    z-index: 1;
    background-position: center;
    background: #fdfdfd;
    background: -webkit-linear-gradient(#fdfdfd, #f9f9f9);
    background: linear-gradient(#fdfdfd, #f9f9f9);
    border-top: 1px solid #e9e9e9;
    box-shadow: 0 -3px 8px rgba(0, 0, 0, .04);
    .cart-bottom-bg {
      height: 80px;
      border-top: 1px solid #D9D9D9;
      border-radius: 0 0 8px 8px;
    }
    .fix-bottom-inner {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
    .shipping {
      display: flex;
      align-items: center;
    }
    em {
      display: inline-block;
      position: relative;
      top: 3px;
      margin-top: -4px;
      font-size: 24px;
      color: #d44d44;
      font-weight: 700;
    }
  }

  .attribute, .name p {
    color: #999;
    font-size: 12px;
    padding-top: 4px;
    line-height: 17px;
  }


</style>
