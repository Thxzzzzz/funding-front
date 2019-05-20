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
const recommendStroeKey = 'fProductRecommend'
export const addRecommendCount = (type, count) => {
  // 从浏览器 Local Storage 取出类型推荐计数的数组
  let recommend = getStore(recommendStroeKey)
  // 如果没有就初始化一个空数组
  if (!recommend) {
    recommend = []
  } else {
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

export const getRecommendType = () => {
  // 从浏览器 Local Storage 取出类型推荐计数的数组
  let recommend = getStore(recommendStroeKey)
  // 如果没有就返回 0 后端将从所有类型中推荐
  if (!recommend) return 0
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
