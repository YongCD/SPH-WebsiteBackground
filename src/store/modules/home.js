import mockRequest from '@/utils/mockRequest'

const state = {
  data: {}
}

const mutations = {
  GETDATA(state, data) {
    state.data = data
  }
}

const actions = {
  async getData({commit}) {
    const result = await mockRequest('/home/list')
    if(result.code === 200) commit('GETDATA', result.data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}