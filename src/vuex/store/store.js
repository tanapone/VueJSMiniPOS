import vue from 'vue'
import Vuex from 'vuex'
import Vue from 'vue';
Vue.use(Vuex)

const state = {
    serverPath: 'http://192.168.1.84:8080/services/',
    authKey: '',
    nowComponent: ''
}
const getters = {
    serverPath: (state) => {
        return state.serverPath
    }
}
const mutations = {
    SET_AUTHKEY: (state, authKey) => {
        state.authKey = authKey
    }
}

const actions = {
    logout: ({ commit }) => {
        commit('SET_AUTHKEY', '')
    }
}

export const store = new Vuex.Store({
    state,
    getters,
    actions,
    mutations
})