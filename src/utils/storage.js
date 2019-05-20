/**
 * 存储localStorage
 */
export const setStore = (name, content) => {
  if (!name) return
  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }
  window.localStorage.setItem(name, content)
}

/**
 * 获取localStorage
 */
export const getStore = name => {
  if (!name) return
  return window.localStorage.getItem(name)
}

/**
 * 删除localStorage
 */
export const removeStore = name => {
  if (!name) return
  window.localStorage.removeItem(name)
}

// const fProductRecommend = [
//   {
//     type: Number,
//     count: Number
//   }
// ]

// 对应产品类型点击次数保存在 Local Storage 中的 字段名
const recommendStroeKey = 'fProductRecommend'
/**
 * 给对应类型增加点击数量
 * @param {商品类型} type
 * @param {增加的计数值} count
 */
export const addRecommendCount = (type, count) => {
  // 从浏览器 Local Storage 取出类型推荐计数的数组
  let recommend = getStore(recommendStroeKey)
  // 如果没有就初始化一个空数组
  if (!recommend) {
    recommend = []
  } else {
    // 因为  Local Storage 只能存字符串，所以要将 Json 字符串反序列化成 JavaScript 对象
    recommend = JSON.parse(recommend)
  }
  let typeIndex = -1
  // 遍历查找对应类型
  for (let index = 0; index < recommend.length; index++) {
    const element = recommend[index]
    // 找到之后将对应类型的计数累加
    if (element.type === type) {
      typeIndex = index
      recommend[index].count += count
      break
    }
  }
  // 如果没有找到对应类型，则新建一个对象加入数组中
  if (typeIndex === -1) {
    let newTypeRec = {
      type: type,
      count: count
    }
    Array.push(recommend, newTypeRec)
  }
  // 保存到浏览器 Local Storage
  setStore(recommendStroeKey, recommend)
}

/**
 * 获取点击次数最多的类型
 */
export const getRecommendType = () => {
  // 从浏览器 Local Storage 取出类型推荐计数的数组
  let recommend = getStore(recommendStroeKey)
  // 如果没有就返回 0 后端将从所有类型中推荐
  if (!recommend) return 0
  // 因为  Local Storage 只能存字符串，所以要将 Json 字符串反序列化成 JavaScript 对象
  recommend = JSON.parse(recommend)
  let type = 0
  let maxCount = 0
  // 在数组中遍历找最大值
  for (let index = 0; index < recommend.length; index++) {
    const element = recommend[index]
    if (element.count > maxCount) {
      type = element.type
      maxCount = element.count
    }
  }
  // 返回对应类型
  return type
}

/**
 * 清理推荐计数（注销时清理）
 */
export const clearRecommendStorage = () => {
  removeStore(recommendStroeKey)
}
