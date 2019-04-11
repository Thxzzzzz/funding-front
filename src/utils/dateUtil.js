/**
 * 计算相差天数
 */
export const calcDayBetween = (date1, date2) => {
  let date = date2.getTime() - date1.getTime()
  return Math.floor(date / (24 * 3600 * 1000))
}
