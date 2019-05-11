import Vue from 'vue'
import Router from 'vue-router'
const Index = () => import('/page/index.vue')
const Login = () => import('/page/Login/login.vue')
const Register = () => import('/page/Login/register.vue')
const Home = () => import('/page/Home/home.vue')
const GoodS = () => import('/page/Goods/goods.vue')
const goodsDetails = () => import('/page/Goods/goodsDetails.vue')
const Cart = () => import('/page/Cart/cart.vue')
const order = () => import('/page/Order/order.vue')
const user = () => import('/page/User/user.vue')
const orderList = () => import('/page/User/children/order.vue')


const information = () => import('/page/User/children/information.vue')
const addressList = () => import('/page/User/children/addressList.vue')
const coupon = () => import('/page/User/children/coupon.vue')
const aihuishou = () => import('/page/User/children/aihuishou.vue')
const support = () => import('/page/User/children/support.vue')
const checkout = () => import('/page/Checkout/checkout.vue')
const payment = () => import('/page/Order/payment.vue')
const paysuccess = () => import('/page/Order/paysuccess.vue')
const Search = () => import('/page/Search/search.vue')
const RefreshSearch = () => import('/page/Refresh/refreshsearch.vue')
const RefreshGoods = () => import('/page/Refresh/refreshgoods.vue')
const orderDetail = () => import('/page/User/children/orderDetail.vue')

/////////////////      商家相关       ///////////////
// 订单管理
const orderManager = () => import('/page/User/children/orderManager.vue')
// 我的众筹
const fundingManager = () => import('/page/User/children/fundingManager.vue')
// 资质认证
const licenseManager = () => import('/page/User/children/licenseManager.vue')
// 订单详情（商家）
const orderDetailManager = () => import('/page/User/children/orderDetailManager.vue')
// 发起众筹
const newFunding = () => import('/page/User/children/newFunding.vue')


// const Alipay = () => import('/page/Order/alipay.vue')
// const Wechat = () => import('/page/Order/wechat.vue')
// const QQpay = () => import('/page/Order/qqpay.vue')
Vue.use(Router)
export default new Router({
  routes: [{
      path: '/',
      component: Index,
      name: 'index',
      redirect: '/home',
      children: [{
          path: 'home',
          component: Home
        },
        {
          path: 'goods',
          component: GoodS
        },
        {
          path: 'goodsDetails',
          name: 'goodsDetails',
          component: goodsDetails
        },
        // {path: 'thanks', name: 'thanks', component: Thanks},
        {
          path: '/refreshgoods',
          name: 'refreshgoods',
          component: RefreshGoods
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/cart',
      name: 'cart',
      component: Cart
    },
    {
      path: '/refreshsearch',
      name: 'refreshsearch',
      component: RefreshSearch
    },
    {
      path: '/order',
      name: 'order',
      component: order,
      children: [{
          path: 'paysuccess',
          name: 'paysuccess',
          component: paysuccess
        },
        {
          path: 'payment',
          name: 'payment',
          component: payment
        },
        {
          path: '/search',
          name: 'search',
          component: Search
        }
        // {path: 'alipay', name: 'alipay', component: Alipay},
        // {path: 'wechat', name: 'wechat', component: Wechat},
        // {path: 'qqpay', name: 'qqpay', component: QQpay}
      ]
    },
    {
      path: '/user',
      name: 'user',
      component: user,
      // redirect: '/user/orderList',
      children: [{
          path: 'orderList',
          name: '订单列表',
          component: orderList
        },
        {
          path: 'orderDetail',
          name: '订单详情',
          component: orderDetail
        },
        {
          path: 'information',
          name: '账户资料',
          component: information
        },
        {
          path: 'addressList',
          name: '收货地址',
          component: addressList
        },
        {
          path: 'coupon',
          name: '我的优惠',
          component: coupon
        },
        {
          path: 'support',
          name: '售后服务',
          component: support
        },
        {
          path: 'aihuishou',
          name: '以旧换新',
          component: aihuishou
        },
        // 商家相关
        {
          path: 'orderManager',
          name: '订单管理',
          component: orderManager
        },
        {
          path: 'fundingManager',
          name: '我的众筹',
          component: fundingManager
        },
        {
          path: 'licenseManager',
          name: '资质认证',
          component: licenseManager
        },
        {
          path: 'orderDetailManager',
          name: '订单管理详情',
          component: orderDetailManager
        },
        {
          path: 'newFunding',
          name: '发起众筹',
          component: newFunding
        },

      ]
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: checkout
    },
    {
      path: '*',
      redirect: '/home'
    }
  ]
})
