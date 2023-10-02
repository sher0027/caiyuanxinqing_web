import request from '@/utils/request'

/*
知心预约 - 分页获取所有预约
*/


 export function getAppointList(pageIndex) {
  return request ({
    url: '/admin/reservations?pageSize=15',
    method: 'get',
    params: { pageIndex }
  })
}