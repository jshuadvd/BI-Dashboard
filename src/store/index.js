import Vue from 'vue';
import Vuex from 'vuex';
import { fetchFeeTimeSeries } from '../utils/http';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    feeTimeSeries: null,
  },
  mutations: {
    SET_FEE_TIME_SERIES(state, data) {
      state.feeTimeSeries = data;
    },
  },
  actions: {
    getFeeTimeSeries({ commit }, param) {
      fetchFeeTimeSeries(param).then((res) => {
        commit('SET_FEE_TIME_SERIES', res);
      });
    },
  },
  modules: {
  },
});
