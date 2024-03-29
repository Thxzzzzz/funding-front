import http from './public'

//          商品信息相关        //

// 商品列表
export const productList = (params) => {
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
// 获取产品类型列表
export const productTypeList = (params) => {
  return http.fetchGet('/product/typeList', params)
}

// / 产品评论相关   ///

// 获取产品评论
export const getCommentInfoByProductId = (params) => {
  return http.fetchGet('/product/getCommentInfoByProductId', params)
}
// 提交产品评论
export const saveCommentsInfo = (params) => {
  return http.fetchPost('/comments/saveCommentsInfo', params)
}
// 提交产品评论回复
export const saveCommentsReply = (params) => {
  return http.fetchPost('/comments/saveCommentsReply', params)
}

// ////////      商品 商家相关        ///////
// 保存产品
export const saveProduct = (params) => {
  return http.fetchPost('/pm/save', params)
}
// 获取产品信息
export const productById = (params) => {
  return http.fetchGet('/pm/productById', params)
}
// 获取产品套餐信息
export const pkgListByProductId = (params) => {
  return http.fetchGet('/pm/pkgListByProductId', params)
}
// 保存产品套餐信息
export const saveProductPackage = (params) => {
  return http.fetchPost('/pm/saveProductPackage', params)
}
// 根据卖家 ID 来获取产品信息（我的众筹）
export const allProductBySellerId = (params) => {
  return http.fetchGet('/pm/allProductBySellerId', params)
}
// 根据类型和数量随机获取一组产品信息（用来做推荐）
export const getProductsRand = (params) => {
  return http.fetchGet('/product/getProductsRand', params)
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
//  取消订单
export const cancelOrder = (params) => {
  return http.fetchPost('/order/cancel', params)
}
//  申请退款
export const refundOrder = (params) => {
  return http.fetchPost('/order/refund', params)
}
//  发起投诉
export const complaintOrder = (params) => {
  return http.fetchPost('/order/complaint', params)
}
//  删除订单
export const delOrder = (params) => {
  return http.fetchPost('/order/delOrder', params)
}
//  确认收货
export const receivedOrder = (params) => {
  return http.fetchPost('/order/receivedOrder', params)
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

// 拒绝退款
export const cantRefundOrder = (params) => {
  return http.fetchPost('/order/cantRefund', params)
}
