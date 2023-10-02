import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [{
    path: '/login',
    component: () =>  import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () =>  import('@/views/404'),
    hidden: true
  },
]

// {
//   path: '/',
//   component: Layout,
//   redirect: '/dashboard',
//   children: [{
//     path: 'dashboard',
//     name: 'Dashboard',
//     component: () => import('@/views/dashboard/index'),
//     meta: { title: '身份设置'}
//   }]
// },

export const asyncRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/personal',
    name: 'personal',
    meta: {
      title: '个人中心',
      roles: ['admin','ordin']
    },
    children: [{
      path: 'personal',
      name: 'personal',
      component: () =>  import('@/views/personal/index'),
      meta: { title: '个人中心', breadcrumb: false}
    }]
  },

  {
    path: '/account',
    component: Layout,
    redirect: '/account/index',
    name: 'account',
    meta: {
      title: '账号管理',
      roles: ['admin'] 
    },
    children: [{
      path: 'index',
      name: 'account',
      component: () =>  import('@/views/account/index'),
      meta: { title: '账号管理', breadcrumb: false}
    }]
  },

  {
    path: '/identity',
    component: Layout,
    redirect: '/identity/index',
    name: 'identity',
    meta: {
      title: '身份设置',
      roles: ['admin'] ,
    },
    children: [{
      path: 'index',
      name: 'identity',
      component: () =>  import('@/views/identity/index'),
      meta: { title: '身份设置', breadcrumb: false}
    }]
  },

  {
    path: '/appoint',
    component: Layout,
    redirect: '/appoint/index',
    name: 'appoint',
    meta: {
      title: '知心预约',
      roles: ['admin']
    },
    children: [{
      path: 'index',
      name: 'appoint',
      component: () =>  import('@/views/appoint/index'),
      meta: { title: '知心预约', breadcrumb: false}
    }]
  },

  {
    path: '/service',
    component: Layout,
    redirect: '/service/index',
    name: 'service',
    meta: {
      title: '尽心服务',
      roles: ['admin']
    },
    children: [{
      path: 'index',
      name: 'service',
      component: () =>  import('@/views/service/index'),
      meta: { title: '尽心服务', breadcrumb: false}
    }]
  },


  {
    path: '/logs',
    component: Layout,
    redirect: '/logs/index',
    name: 'logs',
    meta: {
      title: '日志',
      roles: ['admin']
    },
    children: [
      {
        path: 'index',
        name: 'logs',
        component: () => import('@/views/logs/index'),
        meta: { title: '日志', breadcrumb: false}
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*',
    redirect: '/404',
    hidden: true 
  },
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
