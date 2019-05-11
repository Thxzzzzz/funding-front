export const OrderStatus = {
  // 下单
  Ordered: 1,
  // 已支付
  Paid: 2,
  // 正在配货
  Prepare: 3,
  // 出货 配送
  Deliver: 4,
  // 交易成功
  Finished: 5,
  // 正在退款
  Refund: 6,
  // 交易取消
  Canceled: 7
}

export const getOrderStatus = (status) => {
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
}
