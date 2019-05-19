import http from './public'

//            登录相关          //
// 登陆
export const userLogin = (params) => {
  return http.fetchPost('/user/login', params)
}
// 退出登陆
export const loginOut = (params) => {
  return http.fetchPost('/user/logout', params)
}
// 用户信息
export const userInfo = (params) => {
  return http.fetchGet('/user/info', params)
}
// 根据ID获取用户信息
export const getInfoById = (params) => {
  return http.fetchGet('/user/getInfoById', params)
}
// 根据用户ID获取执照信息
export const getLicenseByUserId = (params) => {
  return http.fetchGet('/user/getLicenseByUserId', params)
}
// 注册账号
export const register = (params) => {
  return http.fetchPost('/user/register', params)
}
// 上传图片
export const uploadImage = (params, OnUploadProgress) => {
  return http.Upload('/user/uploadImage', params, OnUploadProgress)
}
// 上传图片
export const upload = (params) => {
  return http.fetchPost('/member/imgaeUpload', params)
}
// TODO 修改头像
export const updateheadimage = (params) => {
  return http.fetchPost('/member/updateheadimage', params)
}

// 首页接口
export const productHome = (params) => {
  return http.fetchGet('/product/home', params)
}
// 首页统计
export const getProductCountInfo = (params) => {
  return http.fetchGet('/product/getProductCountInfo', params)
}

// TODO 推荐板块
export const recommend = (params) => {
  return http.fetchGet('/pruduct/recommend', params)
}

// //  执照相关 ///
export const saveLicense = (params) => {
  return http.fetchPost('/user/license/save', params)
}
