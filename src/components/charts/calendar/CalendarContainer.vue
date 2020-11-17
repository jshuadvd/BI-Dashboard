<template>
<div class="bi-chart-item">
    <v-overlay v-if="loading" :value="loading" color="#fff" absolute z-index="600">
      <v-progress-circular indeterminate size="64" color="#98cbfa"></v-progress-circular>
    </v-overlay>

    <div class="bi-container">
      <div>
        <div class="bi-chart-legends">
         <span
          :class="type === 1 ? 'active': ''"
          @click="type = 1"
        >
          环比
        </span>
        <span
          :class="type === 0 ? 'active': ''"
          @click="type = 0"
        >
          同比
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

    <div
      v-for="(value, key) in feeTimeSeries"
      :key="key"
    >
      <calendar
        :width="600"
        :height="100"
        :left="50"
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
import CalendarVue from '../../calendar/Calendar.vue';

export default {
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
      loading: true,

      // type为0： 同比， 1：环比
      type: 1,
    };
  },

  components: {
    Calendar: CalendarVue,
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

  computed: {
    feeTimeSeries() {
      return this.$store.state.feeTimeSeries;
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

      const e = Math.abs(Math.abs(minV), Math.abs(maxV));

      return d3.scaleLinear()
        .range(['#73cdbb', '#fff', '#eb745f'])
        .domain([-e, 0, e]);
    },
  },

  watch: {
    itemSelect(value) {
      this.loading = true;
      if (this.feeTimeSeries) {
        this.$store.dispatch('getFeeTimeSeries', {
          fundType: 'public',
          feeType: 'total',
          granularity: this.items[value].key,
          startDay: this.startDay,
          endDay: this.endDay,
        }).then(() => {
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
    span {
      flex: 0 0 60%;

      &.active {
        color: $primary;
      }
    }
  }
</style>
