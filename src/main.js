import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/'
import VueLazyload from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'
import VueCookie from 'vue-cookie'

import {
  userInfo
} from './api'
import {
  Progress,
  Button,
  Pagination,
  Checkbox,
  Icon,
  Autocomplete,
  Loading,
  Message,
  Notification,
  Steps,
  Step,
  Table,
  TableColumn,
  Input,
  Dialog,
  Select,
  Form,
  FormItem,
  DatePicker,
  Upload,
  Option,
  Tabs,
  TabPane,
  Row,
  Col,
  Card
} from 'element-ui'
import VueContentPlaceholders from 'vue-content-placeholders'
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(TabPane)
Vue.use(Tabs)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(DatePicker)
Vue.use(Upload)
Vue.use(Progress)
Vue.use(VueContentPlaceholders)
Vue.use(Button)
Vue.use(Pagination)
Vue.use(Checkbox)
Vue.use(Icon)
Vue.use(Autocomplete)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Input)
Vue.use(Dialog)
Vue.use(Select)
Vue.use(Option)
Vue.use(Loading.directive)
Vue.prototype.$loading = Loading.service
Vue.prototype.$notify = Notification
Vue.prototype.$message = Message
Vue.use(infiniteScroll)
Vue.use(VueCookie)
Vue.use(VueLazyload, {
  // preLoad: 1.3,
  // error: 'dist/error.png',
  loading: '/static/images/load.gif'
  // attempt: 1
})
Vue.config.productionTip = false
const whiteList = ['/', '/home', '/goods', '/login', '/register', '/goodsDetails', '/thanks', '/search', '/refreshsearch', '/refreshgoods'] // 不需要登陆的页面
router.beforeEach(function (to, from, next) {
  // 处于白名单中的 Url 不需要验证

  userInfo().then(res => {
    if (res.code !== 200) { // 没登录
      if (whiteList.indexOf(to.path) !== -1) { // 白名单
        next()
        return
      }
      next('/login')
    } else {
      // 将 userinfo 存入 vuex strore 中
      let info = res.data
      if (!info.icon_url) {
        info.icon_url = 'static/images/defaultIcon.png'
      }
      store.commit('RECORD_USERINFO', {
        info: info
      })
      if (to.path === '/login') {
        // 跳转到首页
        next({
          path: '/'
        })
      }
      next()
    }
  }).catch(() => {
    if (whiteList.indexOf(to.path) !== -1) { // 白名单
      next()
      return
    }
    // 转到错误页？
  })
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
