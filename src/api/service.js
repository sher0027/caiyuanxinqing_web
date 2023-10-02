import request from '@/utils/request'

/*
尽心服务 - 分页获取所有留言
*/

export function getServiceList(pageIndex) {
  return request({
    url: '/admin/messages?pageSize=100',
    method: 'get',
    params: { pageIndex }
  })
}
