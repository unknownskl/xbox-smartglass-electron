const state = {
  consoles: []
}

const mutations = {
  setConsoles (state, payload) {
    state.consoles = payload
  },
  clearConsoles (state) {
    state.consoles = []
  }
}

const actions = {
  setConsoles ({commit, payload}) {
    console.log('commit')
    // do something async
    commit('setConsoles', payload)
  }
}

export default {
  state,
  mutations,
  actions
}
