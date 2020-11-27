<template>
  <div class="bi-chart-item">
    <v-overlay v-if="loading" :value="loading" color="#fff" absolute z-index="600">
      <v-progress-circular indeterminate size="64" color="#98cbfa"></v-progress-circular>
    </v-overlay>

    <h3 class="text-lg-h6 text-md-h6">{{chartTitle}} | {{subTitle}}</h3>

    <div class="bi-container">
      <div>
        <div class="bi-chart-legends">
          <span v-for="(d,i) in Object.keys(feeTimeSeries)" :key="d"
            class="legend"
          >
            <i :style="{
              background: `var(--color-${i})`,
            }"></i>
            {{d}}
          </span>
        </div>
      </div>

      <div class="bi-legends">
        <div>
          {{startDay}} - {{endDay}}
        </div>

        <div>
          {{items[itemSelect] && items[itemSelect].title}}
        </div>
      </div>

    </div>

    <linechart
      v-if="Object.keys(datum).length > 0"
      :datum="datum"
      :accessorX="accessorX"
      :accessorY="accessorY"
      :xDomain="xDomain"
      :xScaleAcc="xScaleAcc"
      :yScaleAcc="yScaleAcc"
      :left="60"
      :top="0"
    />
  </div>
</template>

<script>
import YEAR_HASH from '@/utils/yearHash';
import { fetchFeeTimeSeries } from '@/site/util/http';
import { mapState } from 'vuex';
import { TITLE_HASH, SUBTITLE_HASH } from '@/utils/param';
import LinechartVue from '../../linechart/Linechart.vue';

export default {
  props: {
    status: Object,
  },

  components: {
    Linechart: LinechartVue,
  },

  data() {
    return {
      items: [
        { value: 0, title: '月', key: 'month' },
        { value: 1, title: '周', key: 'week' },
        { value: 2, title: '日', key: 'day' },
      ],
      // chartProps:
      accessorX: (d, i) => new Date(d[0]),
      xDomain: [new Date(Date.UTC(2020, 0, 0)), new Date(Date.UTC(2020, 11, 31))],

      loading: true,

      itemSelect: 0,
      startDay: '',
      endDay: '',
      subTitle: '',
      chartTitle: '',
    };
  },

  computed: {
    ...mapState({
      choseId: (state) => state.choseId,
    }),

    feeTimeSeries() {
      return this.status.data;
    },
    accessorY() {
      return (d, i) => d[1].value;
    },
    // 处理坐标轴的数据显示
    xScaleAcc() {
      const { itemSelect } = this;

      return (d, i) => new Date(`2020${String(YEAR_HASH[d[0]][itemSelect]).slice(4)}`);
    },
    yScaleAcc() {
      const { itemSelect } = this;

      return (d, i) => {
        // TODO 目前的月日周切换没有接后台数据，但是已经写了更新逻辑
        const hashDay = YEAR_HASH[d[0]][itemSelect];
        const data = this.feeTimeSeries[hashDay.slice(0, 4)][hashDay];
        return data ? data.value : 0;
      };
    },
    datum() {
      if (this.feeTimeSeries) {
        return Object.values(this.feeTimeSeries).map((d) => Object.entries(d));
      }
      return [];
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
        this.itemSelect = newValue.itemSelect;
        this.startDay = newValue.dateStart;
        this.endDay = newValue.dateEnd;
        this.subTitle = newValue.subTitle;
        this.chartTitle = newValue.chartTitle;
      },
      deep: true,
      immediate: true,
    },
  },

  methods: {
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
    padding: 10px;
    display:flex;
    flex-direction: column;

    .bi-container {
      margin: 10px 0 0 0;
    }
  }
</style>
