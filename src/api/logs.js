import request from '@/utils/request'

/**
日志 - 分页查询所有日志
*/

export function getLogsList(pageIndex) {
  return request({
    url: '/admin/logs?pageSize=15',
    method: 'get',
    params: { pageIndex }
  })
}

/**
日志 - 根据姓名匹配日志
*/
export function searchLogs(pageIndex, name) {
  return request({
    url: '/admin/logsOfName?pageSize=15',
    method: 'get',
    params: { pageIndex, name }
  })
}