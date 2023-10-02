import request from '@/utils/request'

/**
 * 获取所有身份列表
 */
 export function getIdentityList(pageIndex) {
  return request({
      url: '/admin/admins?pageSize=15',
      method: 'get',
      params: { pageIndex }
  })
}

/**
 * 新增身份
 */
export function addIdentity(data){
  return request({
    url: '/admin/admin',
    method: 'post',
    data
  })
}

/**
 * 维护身份
 */
export function editIdentity(data){
  return request({
    url: '/admin/admin',
    method: 'put',
    data
  })
}

/**
 * 删除身份
 */
export function deleteIdentity(aid) {
  return request({
    url:'/admin/admin',
    method:'delete',
    params: { aid }
  })
}