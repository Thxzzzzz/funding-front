import {
  INIT_BUYCART,
  ADD_CART,
  GET_USERINFO,
  RECORD_USERINFO,
  ADD_ANIMATION,
  SHOW_CART,
  REDUCE_CART,
  EDIT_CART
} from './mutation-types'
import {
  setStore
} from '../utils/storage'
export default {
  // 网页初始化时从本地缓存获取购物车数据
  [INIT_BUYCART] (state, {
    cartList
  }) {
    state.cartList = cartList
  },
  // 加入购物车
  [ADD_CART] (state, {
    product_package_id,
    product_id,
    price,
    product_name,
    description,
    image_url,
    nums = 1
  }) {
    let cart = state.cartList // 购物车
    if (!cart) {
      console.log('null')
      cart = []
    }
    let falg = true
    // 购物车定义
    let goods = {
      product_package_id,
      product_id,
      price,
      product_name,
      description,
      image_url
    }
    if (cart.length) { // 有内容
      let index = -1
      let changeItem = {}
      cart.forEach(item => {
        if (item.product_package_id === product_package_id) {
          if (item.nums >= 0) {
            falg = false
            item.nums += nums
            changeItem = item
            index = cart.indexOf(item)
          }
        }
      })
      if (index !== -1) {
        cart.splice(index, 1)
        cart.unshift(changeItem)
      }
    }
    if (!cart.length || falg) {
      goods.nums = nums
      goods.checked = true
      cart.unshift(goods)
    }
    state.cartList = cart
    // 存入localStorage
    if (!state.login) {
      setStore('buyCart', cart)
    }
  },
  // 加入购物车动画
  [ADD_ANIMATION] (state, {
    moveShow,
    elLeft,
    elTop,
    img,
    cartPositionT,
    cartPositionL,
    receiveInCart
  }) {
    state.showMoveImg = moveShow
    if (elLeft) {
      state.elLeft = elLeft
      state.elTop = elTop
    }
    state.moveImgUrl = img
    state.receiveInCart = receiveInCart
    if (cartPositionT) {
      state.cartPositionT = cartPositionT
      state.cartPositionL = cartPositionL
    }
  },
  // 是否显示购物车
  [SHOW_CART] (state, {
    showCart
  }) {
    // let timer = null
    state.showCart = showCart
    // clearTimeout(timer)
    // if (showCart) {
    //   timer = setTimeout(() => {
    //     state.showCart = false
    //   }, 5000)
    // }
  },
  // 移除商品
  [REDUCE_CART] (state, {
    product_package_id
  }) {
    let cart = state.cartList
    cart.forEach((item, i) => {
      if (item.product_package_id === product_package_id) {
        if (item.nums > 1) {
          item.nums--
        } else {
          cart.splice(i, 1)
        }
      }
    })
    state.cartList = cart
    // 存入localStorage
    setStore('buyCart', state.cartList)
  },
  // 修改购物车
  [EDIT_CART] (state, {
    product_package_id,
    nums,
    checked
  }) {
    let cart = state.cartList
    if (nums) {
      cart.forEach((item, i) => {
        if (item.product_package_id === product_package_id) {
          item.nums = nums
          item.checked = checked
        }
      })
    } else if (product_package_id) {
      cart.forEach((item, i) => {
        if (item.product_package_id === product_package_id) {
          cart.splice(i, 1)
        }
      })
    } else {
      cart.forEach((item) => {
        item.checked = checked
      })
    }
    state.cartList = cart
    // 存入localStorage
    setStore('buyCart', state.cartList)
  },
  // 记录用户信息
  [RECORD_USERINFO] (state, info) {
    state.userInfo = info
    state.login = true
    setStore('userInfo', info)
  },
  // 获取用户信息
  [GET_USERINFO] (state, info) {
    if (state.userInfo && (state.userInfo.username !== info.username)) {
      return
    }
    if (!state.login) {
      return
    }
    if (!info.message) {
      state.userInfo = {
        ...info
      }
    } else {
      state.userInfo = null
    }
  }
}
