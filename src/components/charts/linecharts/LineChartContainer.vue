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

      <div class="legends">
        <div>
          {{startDay}} - {{endDay}}
        </div>

        <div>
          {{items[itemSelect].title}}
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

      startDay: new Date('2019-01-01').toISOString().substr(0, 10),
      endDay: new Date().toISOString().substr(0, 10),

      // chartProps:
      accessorX: (d, i) => new Date(d[0]),
      xDomain: [new Date(Date.UTC(2020, 0, 0)), new Date(Date.UTC(2020, 11, 31))],

      loading: true,
      chartTitle: '公立医院',
      subTitle: '总医药费用',
      itemSelectMap: 0,
    };
  },

  computed: {
    feeTimeSeries() {
      return this.$store.state.feeTimeSeries || {};
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

    itemSelect: {
      get() {
        return this.itemSelectMap;
      },
      set(value) {
        this.itemSelectMap = value;
      },
    },
  },

  mounted() {
    if (!this.$store.feeTimeSeries) {
      this.$store.dispatch('getFeeTimeSeries', {
        fundType: 'public',
        feeType: 'total',
        granularity: this.items[this.itemSelect].key,
        startDay: this.startDay,
        endDay: this.endDay,
      }).then(() => {
        this.loading = false;
      });
    }

    // 通过status，设置数据
    this.initStatus();
  },

  watch: {
    itemSelect(value) {
      this.loading = true;
      this.$store.dispatch('getFeeTimeSeries', {
        fundType: 'public',
        feeType: 'total',
        granularity: this.items[value].key,
        startDay: this.startDay,
        endDay: this.endDay,
      }).then(() => {
        this.loading = false;
      });
    },

    status: {
      handler(newValue) {
        this.itemSelectMap = newValue.data.itemSelect;
      },
      deep: true,
      immediate: true,
    },
  },

  methods: {
    initStatus() {
      const {
        chartTitle, subTitle, startDay, endDay, itemSelect,
      } = this.status.data;
      this.chartTitle = chartTitle;
      this.subTitle = subTitle;
      this.startDay = startDay;
      this.endDay = endDay;
      this.itemSelect = itemSelect;
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

    .legends {
      display: flex;
    }

    .legends div{
      border: 1px solid #cfcfcf;
      border-radius: 4px;
      padding: 4px 10px;
      min-width: 40px;
      margin: 0 3px;
    }
  }
</style>
