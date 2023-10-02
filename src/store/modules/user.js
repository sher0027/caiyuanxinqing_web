import { loginByVerifyCode, loginByPassword, getCode, getRole} from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'


const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    phone: '',
    roles: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME  : (state, name) => {
    state.name = name 
  },
  SET_PHONE: (state, phone) => {
    state.phone = phone
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
}

const actions = {
  //密码登录
  loginByPassword({ commit }, userInfo) {
    const { phone, password } = userInfo
    return new Promise((resolve, reject) => {
      loginByPassword({ phone: phone, password: password }).then(response => {
        commit('SET_TOKEN', response.data)
        setToken(response.data)
        console.log(state.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  //验证码登录
  loginByVerifyCode({ commit }, userInfo) {
    const { name, phone, verifyCode } = userInfo
    console.log(userInfo)
    return new Promise((resolve, reject) => {
      loginByVerifyCode({name:name, phone:phone, verifyCode:verifyCode }).then(response => {
        console.log('验证码登录')
        console.log(response.data)
        commit('SET_TOKEN', response.data)
        commit('SET_NAME', name)
        // commit('SET_PHONE', phone)
        setToken(response.data)
        console.log(state.token)
        console.log(state.name)
        resolve()
      }).catch(error => {
        reject(error)
      })
      
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const { name , phone } = data

        commit('SET_name ', name)
        commit('SET_PHONE', phone)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取验证码
  getCode({ commit }, baseInfo) {
    const { name, phone } = baseInfo;
    return new Promise((resolve, reject) => {
      getCode(name, phone).then(response => {
        console.log('获取验证码')
        console.log(response.data)
        commit('SET_TOKEN', response.data)
        setToken(response.data)
        resolve()
      }).catch(error => {
        reject(error)
        console.log('验证码获取失败')
      })
    })
  },

  // 获取身份
  getRole({ commit }) {
    return new Promise((resolve, reject) => {
      getRole().then(response => {
        console.log('获取身份')
        const ordin =['ordin']
        const admin =['admin']
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }
        console.log(response.data)
        if(data == 1){
          commit('SET_ROLES', ordin)
        }else{
          commit('SET_ROLES', admin)
        }
        console.log('获取身份lo')
        console.log(state.roles)
        resolve(state.roles)
      }).catch(error => {
        reject(error)
        console.log('身份获取失败')
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

