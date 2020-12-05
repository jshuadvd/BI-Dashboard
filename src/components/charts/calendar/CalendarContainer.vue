<template>
<div class="bi-chart-item">
    <v-overlay v-if="loading" :value="loading" color="#fff" absolute z-index="600">
      <v-progress-circular indeterminate size="64" color="#98cbfa"></v-progress-circular>
    </v-overlay>

    <div class="bi-container">
      <h3 class="text-lg-h6 text-md-h6"> {{ chartTitle }} | {{subTitle}}</h3>
      <div class="bi-chart-legends">
        <span v-if="type===1" @click="type = 1">环比</span>
        <span v-if="type===0" @click="type = 0">同比</span>

        <div class="bi-legends">
          <div>
            {{startDay}} - {{endDay}}
          </div>

          <div>
            {{items[itemSelect].title}}
        </div>
      </div>
    </div>

    </div>

    <div
      v-for="(value, key) in feeTimeSeries"
      :key="key"
    >
      <calendar
        :width="600"
        :height="100"
        :left="50"
        :right="50"
        :year="key"
        :colorScaleAcc="colorScaleAcc"
        :colorSchema="colorSchema"
        :type="itemSelect"
      />
    </div>
  </div>
</template>

<script>
import YEAR_HASH from '@/utils/yearHash';
import * as d3 from 'd3';
import { fetchFeeTimeSeries } from '@/site/util/http';
import { mapState } from 'vuex';
import { TITLE_HASH, SUBTITLE_HASH } from '@/utils/param';
import CalendarVue from '../../calendar/Calendar.vue';

export default {
  props: {
    status: Object,
  },

  data() {
    return {
      items: [
        { value: 0, title: '月', key: 'month' },
        { value: 1, title: '周', key: 'week' },
        { value: 2, title: '日', key: 'day' },
      ],
      itemSelectMap: 0,
      // chartProps:
      loading: false,

      // type为0： 同比， 1：环比
      typeMap: 1,

      startDayMap: 0,
      endDayMap: 0,
      subTitle: '',
      chartTitle: '',
    };
  },

  components: {
    Calendar: CalendarVue,
  },

  computed: {
    ...mapState({
      choseId: (state) => state.choseId,
    }),
    itemSelect: {
      get() {
        return this.itemSelectMap;
      },
      set(value) {
        this.itemSelectMap = value;
      },
    },

    startDay: {
      get() {
        return this.startDayMap;
      },
      set(value) {
        this.startDayMap = value;
      },
    },

    endDay: {
      get() {
        return this.endDayMap;
      },
      set(value) {
        this.endDayMap = value;
      },
    },

    type: {
      get() {
        return this.typeMap;
      },
      set(value) {
        this.typeMap = value;
      },
    },

    feeTimeSeries() {
      // return this.$store.state.feeTimeSeries;
      return this.status.data;
    },
    valueType() {
      return ['year_ratio', 'chain_ratio'][this.type];
    },
    colorScaleAcc() {
      const { itemSelect } = this;

      return (d, i) => {
        const hashDay = YEAR_HASH[d][itemSelect];
        const data = this.feeTimeSeries[hashDay.slice(0, 4)][hashDay];
        if (data) {
          return data[this.valueType];
        }
        return 0;
      };
    },
    colorSchema() {
      let minV = Number.MAX_VALUE, maxV = Number.MIN_VALUE;
      Object.values(this.feeTimeSeries).forEach((yearData) => {
        Object.values(yearData).forEach((d) => {
          const tmp = d[this.valueType];
          minV = Math.min(tmp, minV);
          maxV = Math.max(tmp, maxV);
        });
      });

      const e = Math.max(Math.abs(minV), Math.abs(maxV));

      return d3.scaleLinear()
        .range(['#73cdbb', '#fff', '#eb745f'])
        .domain([-e, 0, e]);
    },
  },

  watch: {
    itemSelect(value) {
      this.getLoad(this.items[value].key);
    },
    endDay(value) {
      this.getLoad(undefined, value);
    },
    chartTitle(value) {
      this.getLoad(undefined, undefined, value);
    },
    subTitle(value) {
      this.getLoad(undefined, undefined, undefined, value);
    },

    status: {
      handler(newValue) {
        this.initDataFromStatus(newValue);
      },
      deep: true,
      immediate: true,
    },
  },

  methods: {
    initDataFromStatus(newValue) {
      this.itemSelectMap = newValue.itemSelect;
      this.startDayMap = newValue.dateStart;
      this.endDayMap = newValue.dateEnd;
      this.typeMap = newValue.type;
      this.subTitle = newValue.subTitle;
      this.chartTitle = newValue.chartTitle;
    },
    getLoad(
      granularity = this.items[this.itemSelect].key,
      endDay = this.endDay,
      fundType = this.chartTitle,
      feeType = this.subTitle,
    ) {
      if (endDay) {
        this.loading = true;

        fetchFeeTimeSeries({
          fundType: TITLE_HASH[fundType],
          feeType: SUBTITLE_HASH[feeType],
          granularity,
          startDay: this.startDay,
          endDay,
        }).then((res) => {
          this.loading = false;
          this.$store.dispatch('updateChartData', { choseId: this.choseId, data: res, pro: 'data' });
        }).catch((err) => {
          this.loading = false;
        });
      }
    },
  },
};
</script>

<style scoped lang="scss">
  .bi-chart-item {
    padding: 2px 20px;
    display: flex;
    flex-direction: column;
  }

  .bi-container {
    display: flex;
    flex-direction: column;

    .bi-chart-legends {
      justify-content: space-between;

      span {
        max-width: 100px;
      }
    }

    .bi-legends {
      margin: 10px 0;
    }
  }
</style>
