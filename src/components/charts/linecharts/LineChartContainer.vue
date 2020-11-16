<template>
  <div class="bi-chart-item">
    <v-overlay v-if="loading" :value="loading" color="#fff" absolute z-index="600">
      <v-progress-circular indeterminate size="64" color="#98cbfa"></v-progress-circular>
    </v-overlay>

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

      <v-select
        :items="items"
        v-model="itemSelect"
        item-text="title"
        item-value="value"
        dense
        hide-details
        flat
        outlined
      ></v-select>
    </div>

    <linechart
      :datum="datum"
      :accessorX="accessorX"
      :accessorY="accessorY"
      :xDomain="xDomain"
      :xScaleAcc="xScaleAcc"
      :yScaleAcc="yScaleAcc"
      :left="80"
    />
  </div>
</template>

<script>
import YEAR_HASH from '@/utils/yearHash';
import LinechartVue from '../../linechart/Linechart.vue';

export default {
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
      itemSelect: 1,

      startDay: new Date('2019-01-01').toISOString().substr(0, 10),
      endDay: new Date().toISOString().substr(0, 10),

      // chartProps:
      accessorX: (d, i) => new Date(d[0]),
      xDomain: [new Date(Date.UTC(2020, 0, 0)), new Date(Date.UTC(2020, 11, 31))],

      loading: true,
    };
  },

  computed: {
    feeTimeSeries() {
      return this.$store.state.feeTimeSeries;
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
        return this.feeTimeSeries[hashDay.slice(0, 4)][hashDay].value;
      };
    },
    datum() {
      return Object.values(this.feeTimeSeries).map((d) => Object.entries(d));
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
  },
};
</script>

<style scoped lang="scss">
  .bi-chart-item {
    padding: 2px 20px;
    display:flex;
    flex-direction: column;
  }
</style>
