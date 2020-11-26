import Vue from 'vue';
import Vuex from 'vuex';
import { updateDashboardTitle } from '@/utils/api';
import { fetchFeeTimeSeries } from '../utils/http';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // wei_gui_lie_zhi_fei_yong
    // wei_gui_ren_shu: 0,
    // wei_gui_ji_gou_shu: 0,
    title: '',
    menudata: [0, 0, 0],

    // 表格的数据
    tableData: {
      page: {},
      total: 0,
    },
    feeTimeSeries: null,
    // 当前选中的组件
    choseId: 0,
    // 当前存储的组件状态
    charts: [],
  },
  mutations: {
    SET_TITLE(state, newTitle) {
      state.title = newTitle;
    },

    SET_FEE_TIME_SERIES(state, data) {
      state.feeTimeSeries = data;
    },

    SET_ID(state, id) {
      state.choseId = id;
    },

    ADD_CHART(state, chart) {
      state.charts = [...state.charts, chart];
    },

    updatemenu(state, payload) {
      state.menudata = payload.data;
    },

    updateTableData(state, payload) {
      // console.log(payload);
      state.tableData = { ...state.tableData, ...payload.data };
    },

    deleteChart(state, id) {
      state.charts = state.charts.filter((chart) => chart.id !== id);
    },

    changeChartProperty(state, payload) {
      const {
        choseId, i, pro, value,
      } = payload;
      // 选择的第choseId个图表的第i个配置项，props中的pro属性，修改为value
      const chart = state.charts[choseId];
      chart.updateSetting({ i, pro, value });
      Vue.set(state.charts, choseId, chart);
    },

    changeChartData(state, payload) {
      const { choseId, data, pro } = payload;
      const chart = state.charts[choseId];
      chart.updateData(pro, data);
      Vue.set(state.charts, choseId, chart);
    },
  },
  actions: {
    getFeeTimeSeries({ commit }, param) {
      fetchFeeTimeSeries(param).then((res) => {
        commit('SET_FEE_TIME_SERIES', res);
      });
    },
    updateTitle({ commit }, newTitle) {
      commit('SET_TITLE', newTitle);
      updateDashboardTitle({ id: '1', title: newTitle }).then((res) => {
      });
    },

    updateId({ commit }, id) {
      commit('SET_ID', id);
    },

    addChart({ commit }, chart) {
      commit('ADD_CHART', chart);
    },

    deleteChart({ commit }, id) {
      commit('deleteChart', id);
    },

    updateChart({ commit }, payload) {
      commit('changeChartProperty', payload);
    },

    updateChartData({ commit }, payload) {
      commit('changeChartData', payload);
    },
  },
  modules: {
  },
});
