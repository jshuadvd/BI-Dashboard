import Vue from 'vue';
import Vuex from 'vuex';
import { fetchFeeTimeSeries } from '../utils/http';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // wei_gui_lie_zhi_fei_yong
    // wei_gui_ren_shu: 0,
    // wei_gui_ji_gou_shu: 0,
    menudata: [0, 0, 0],

    // 表格的数据
    tableData: {
      page: {},
      total: 0,
    },
    feeTimeSeries: null,
  },
  mutations: {
    SET_FEE_TIME_SERIES(state, data) {
      state.feeTimeSeries = data;
    },
    updatemenu(state, payload) {
      state.menudata = payload.data;
    },

    updateTableData(state, payload) {
      console.log(payload);
      state.tableData = { ...state.tableData, ...payload.data };
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
