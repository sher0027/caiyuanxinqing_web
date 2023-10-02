import request from '@/utils/request'

/**
 * 账号管理 - 获取所有小程序用户
 */

export function getAccountList(pageIndex) {
  return request ({
    url: '/admin/users?pageSize=15',
    method: 'get',
    params: { pageIndex }
  })
}

/**
 *账号管理 - 根据姓名查找用户
 */

export function searchAccount(pageIndex, name) {
  return request ({
    url: '/admin/usersOfName?pageSize=10',
    method: 'get',
    params: { pageIndex, name }
  })
}

/**
 *账号管理 - 根据用户查找预约
 */

export function personalAppoint(pageIndex, bid) {
  return request ({
    url: '/admin/reservationsOfUser?pageSize=100',
    method: 'get',
    params: { pageIndex, bid }
  })
}

/**
 *账号管理 - 查看预约详情
 */

export function getAppointDetail(rid) {
  return request ({
    url: '/admin/reservationDetail',
    method: 'get',
    params: { rid }
  })
}

/**
 *账号管理 - 下拉获取管理员老师列表
 */

export function getAdminsList(pageIndex) {
  return request ({
    url: '/admin/assignableAdmins?pageSize=65535',
    method: 'get',
    params: { pageIndex }
  })
}

/**
 *账号管理 - 知心预约指派
 */

export function Appoint(rid, assignedAid) {
  return request ({
    url: '/admin/assignReservation',
    method: 'put',
    params: { rid, assignedAid }
  })
}

/**
 *账号管理 - 认领
 */

export function Claim(rid) {
  return request ({
    url: '/admin/claimReservation',
    method: 'put',
    params: { rid }
  })
}

/**
 *账号管理 - 撤回
 */

export function Withdraw(rid) {
  return request ({
    url: '/admin/declineAssignment',
    method: 'put',
    params: {rid}
  })
}

/**
 *账号管理 - 确认
 */

 export function Confirm(rid, solvedDatetime, solvedPlace) {
  return request ({
    url: '/admin/confirmReservationSolvedDatetime',
    method: 'put',
    params: {rid, solvedDatetime, solvedPlace}
  })
}

/**
 *账号管理 - 完成预约
 */

 export function FinishReserve(rid) {
  return request ({
    url: '/admin/finishReservation',
    method: 'put',
    params: {rid}
  })
}

/**
 *账号管理 - 根据用户查找留言
 */

export function personalMessage(pageIndex, bid) {
  return request ({
    url: '/admin/messagesOfUser?pageSize=100',
    method: 'get',
    params: { pageIndex, bid }
  })
}

/**
 *账号管理 - 留言详情
 */

export function getServiceDetail(mid) {
  return request ({
    url: '/admin/messageDetail',
    method: 'get',
    params: { mid }
  })
}

/**
 *账号管理 - 尽心服务指派
 */

 export function Appoint_(mid, assignedAid) {
  return request ({
    url: '/admin/assignMessage',
    method: 'put',
    params: { mid, assignedAid }
  })
}

/**
 *账号管理 - 尽心服务撤回
 */

 export function Withdraw_(mid) {
  return request ({
    url: '/admin/declineMessage',
    method: 'put',
    params: {mid}
  })
}

/**
 *账号管理 - 回复留言
 */

export function Reply(mid) {
  return request ({
    url: '/admin/replyMessage',
    method: 'put',
    params: { mid }
  })
}









