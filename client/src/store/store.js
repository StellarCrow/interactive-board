import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
// import Cookies from 'js-cookie';
// plugins: [createPersistedState({
//   storage: {
//     getItem: key => Cookies.get(key),
//     setItem: (key, value) => Cookies.set(key, value, { expires: 3, secure: true }),
//     removeItem: key => Cookies.remove(key)
//   }
// })],
Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createPersistedState()],
  strict: true,
  state: {
    token: null,
    user: null,
    isUserLoggedIn: false
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
      if(token) {
        state.isUserLoggedIn = true;
      } else {
        state.isUserLoggedIn = false;
      }
    },
    setUser(state, user) {
      state.user = user
    }
  },
  actions: {
    setToken({commit}, token) {
      commit('setToken', token)
    },
    setUser({commit}, user) {
      commit('setUser', user)
    }
  }
})
