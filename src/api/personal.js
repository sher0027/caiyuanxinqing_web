import request from '@/utils/request'

/**
个人中心 - 分页获取我的预约
 */

export function getPersonalList(reservationPageIndex, messagePageIndex) {
  return request({
    url: '/admin/myAdmin?reservationPageSize=5&messagePageSize=5',
    method: 'get',
    params: { reservationPageIndex, messagePageIndex }
  })
}