import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [
    createPersistedState({
      storage: window.sessionStorage,
    }),
  ],
  state: {
    checklists: {},
  },
  getters: {},
  mutations: {
    // eslint-disable-next-line  require-jsdoc-except/require-jsdoc
    SET_CHECKLIST(state, newObject) {
      state.checklists[newObject.key] = newObject.data;
    },
  },
  actions: {
    // eslint-disable-next-line  require-jsdoc-except/require-jsdoc
    setChecklist({ commit }, newObject) {
      commit("SET_CHECKLIST", newObject);
    },
  },
});
