import request from '@/utils/request'

export function loginByVerifyCode(data) {
  return request({
    url: '/admin/loginByVerifyCode',
    method: 'post',
    data
  })
}

export function loginByPassword(data) {
  return request({
    url: '/admin/loginByPassword',
    method: 'post',
    data
  })
}

export function getCode(name, phone) {
  return request({
    url: '/admin/verifyCode',
    method: 'get',
    params: { name, phone }
  })
}

export function getRole() {
  return request({
    url: '/admin/myAdminRole',
    method: 'get',
    params: {}
  })
}