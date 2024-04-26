import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter, anyRoutes, asyncRoutes, constantRoutes } from '@/router'
import router from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    routes: null,
    buttons: null,
    roles: null,
    resultAsyncRoutes: null,
    resultAllRoutes: null    //用户需要展示的全部路由
  }
}

// 定义一个函数，两个数组进行对比，对比出当前用户到底显示哪些异步路由
const computedAsyncRoutes = (asyncRoutes, routes) => {
  return asyncRoutes.filter(item => {
    if(routes.includes(item.name)) {
      if(item.children) {
        item.children = computedAsyncRoutes(item.children, routes)
      }
      return true
    }
  })
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USERINFO: (state, userInfo) => {
    state.name = userInfo.name // 用户名
    state.avatar = userInfo.avatar  // 头像
    state.routes = userInfo.routes //菜单权限标记
    state.buttons = userInfo.buttons //按钮权限标记
    state.roles = userInfo.roles  // 角色
  },
  SET_RESULTASYNCROUTES: (state, asyncRoutes) => {
    state.resultAsyncRoutes = asyncRoutes
    state.resultAllRoutes = constantRoutes.concat(state.resultAsyncRoutes, anyRoutes)
    resetRouter()
    router.addRoutes(state.resultAllRoutes)
  }
}

const actions = {
  // user login
  async login({ commit }, userInfo) {
    try {
      const { username, password } = userInfo
      const result = await login({ username: username.trim(), password: password })
        const {data} = result
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        return 'ok'
    } catch (error) {
      return Promise.reject(new Error(error))
    }
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        commit('SET_USERINFO', data)
        commit('SET_RESULTASYNCROUTES', computedAsyncRoutes(asyncRoutes, data.routes))

        resolve(data)
      }).catch(error => {
        reject(error)
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

