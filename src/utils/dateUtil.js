import dayjs from 'dayjs'

/**
 * 计算相差天数
 */
export const calcDayBetween = (date1, date2) => {
  let date = date2.getTime() - date1.getTime()
  return Math.floor(date / (24 * 3600 * 1000))
}

/**
 * 格式化日期
 */
export const formatDate = (date) => {
  if (!date) return ''
  return dayjs(date).format('YYYY年MM月DD日 HH:mm:ss') // 展示
}
