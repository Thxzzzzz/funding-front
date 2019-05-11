import http from './public'

//          商品信息相关        //

// 商品列表
export const getAllGoods = (params) => {
  return http.fetchGet('/product/productList', params)
}
// 获取用户订单
export const checkoutPkgInfo = (params) => {
  return http.fetchGet('/product/checkoutPkgInfo', params)
}
// 商品详情
export const productDet = (params) => {
  return http.fetchGet('/product/detail', params)
}
// TODO 商品列表
export const getSearch = (params) => {
  return http.fetchGet('/product/search', params)
}
// TODO 快速搜索
export const getQuickSearch = (params) => {
  return http.fetchGet('/product/quickSearch', params)
}

//           购物车相关          //

// 获取购物车列表
export const getCartList = (params) => {
  return http.fetchGet('/user/cart/cartList', params)
}
// 加入购物车
export const addCart = (params) => {
  return http.fetchPost('/user/cart/addCart', params)
}
// 删除购物车
// export const delCart = (params) => {
//   return http.fetchPost('/user/cart/delCart', params)
// }
// 删除购物车勾选商品
export const delCartChecked = (params) => {
  return http.fetchPost('/user/cart/delCartChecked', params)
}
// 编辑购物车
export const cartEdit = (params) => {
  return http.fetchPost('/user/cart/cartEdit', params)
}
// 全选
export const editCheckAll = (params) => {
  return http.fetchPost('/user/cart/editCheckAll', params)
}
// 删除整条购物车
export const cartDel = (params) => {
  return http.fetchPost('/user/cart/cartDel', params)
}

//            地址相关              //

// 获取用户地址
export const addressList = (params) => {
  return http.fetchGet('/user/address/all', params)
}
// 通过id获取地址
export const getAddress = (params) => {
  return http.fetchGet('/user/address', params)
}
// 修改收货地址
export const addressUpdate = (params) => {
  return http.fetchPost('/user/address/update', params)
}
// 添加收货地址
export const addressAdd = (params) => {
  return http.fetchPost('/user/address/new', params)
}
// 删除收货地址
export const addressDel = (params) => {
  return http.fetchPost('/user/address/delete', params)
}

//            TODO 订单相关            //

// 生成订单
export const submitOrder = (params) => {
  return http.fetchPost('/order/addOrder', params)
}
// 支付
export const orderPay = (params) => {
  return http.fetchPost('/order/orderPay', params)
}
// 获取用户订单
export const orderList = (params) => {
  return http.fetchGet('/order/orderList', params)
}
// 获取多个订单详情
export const getOrderDet = (params) => {
  return http.fetchGet('/order/orderInIds', params)
}
// TODO 取消订单
export const cancelOrder = (params) => {
  return http.fetchPost('/order/cancelOrder', params)
}
// TODO 删除订单
export const delOrder = (params) => {
  return http.fetchGet('/order/delOrder', params)
}
// TODO 确认收货
export const receivedOrder = (params) => {
  return http.fetchGet('/order/receivedOrder', params)
}

//          TODO 订单 商家相关            //
// 商家获取订单列表
export const orderListToSeller = (params) => {
  return http.fetchGet('/order/orderListToSeller', params)
}
// 发货
export const sendOutOrder = (params) => {
  return http.fetchPost('/order/sendOutOrder', params)
}
