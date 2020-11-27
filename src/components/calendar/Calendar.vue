<template>
  <parent-wrapper :width="width" :height="height">
    <defs>
      <linearGradient id="gradient" x1="0" x2="0" y1="100%" y2="0%">
        <stop offset="0%" stop-color="#2dff9d" />
        <stop offset="50%" stop-color="#eee" />
        <stop offset="100%" stop-color="#ff492d" />
      </linearGradient>
    </defs>

    <g :transform="`translate(${width-left+20}, ${10})`"
      v-if="tooltip">
        <text>{{colorSchema && colorSchema.domain()[0].toFixed(2)}}</text>
        <rect x="10" y="12" class="legend"
          :width="cellSize-cellPadding" :height="height/2" fill="url(#gradient)" />
        <text y="85%">{{colorSchema && colorSchema.domain()[2].toFixed(2)}}</text>
    </g>

    <text x="5" y="50%">{{year}}</text>

    <g :transform="`translate(${left}, ${top})`">
      <!-- 日历图 -->
      <template v-for="(data,j) in cellData">
        <rect v-for="(d,i) in data" :key="i+'r'+j"
          :width="i>=data.length-7 && !type ? cellLength-3 : cellLength-1"
          :height="i===data.length-1 && !type && d.getDay()!==0
            ? cellLength-3
            : (type === 1 ? cellLength + 3:cellLength-1 )"
          :x="cellX(d)"
          :y="cellY(d)"
          :fill="cellColor(d)"
        >
          <!-- <title>{{d}}</title> -->
        </rect>
        <rect
          v-show="type===0"
          :key="j+year"
          :x="cellX(data[data.length-7]) + cellLength - 3"
          :y="cellY(data[data.length-7]) - 3"
          :width="4"
          :height="4"
          fill="#fff"
        />
        <text
          :key="year+j+'t'"
          :x="cellX(data[14])"
          :y="-10"
        >{{j+1}}</text>
      </template>
    </g>
  </parent-wrapper>
</template>

<script>
import * as d3 from 'd3';
import chartBand from '@/mixins/chartBand';
import ParentWrapperVue from '../wrapper/ParentWrapper.vue';
// import GradientVue from '../defs/Gradient.vue';

const daysLabel = Array.from({ length: 7 }, (d, i) => `星期${'一二三四五六日'[i]}`);

export default {
  props: {
    cellSizeProp: {
      type: Number,
      default: 10,
    },
    year: String,
    colorSchema: {
      type: Function,
    },
    colorScaleAcc: {
      type: Function,
    },
    type: {
      type: Number,
    },
    tooltip: {
      type: Boolean,
      default: true,
    },
  },

  components: {
    ParentWrapper: ParentWrapperVue,
    // Gradient: GradientVue,
  },

  data() {
    return {
      daysLabel,
      // 方块间的间距
      cellPadding: 1,
    };
  },

  computed: {
    cellSize() {
      return this.chartWidth / 52;
    },
    cellLength() {
      if (this.type) {
        return this.cellSize - this.cellPadding;
      }
      return this.cellSize;
    },

    cellData() {
      const hash = {
        2019: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
        2020: [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
      };
      // 按年份计算日期
      const cellData = Array.from({ length: 12 }, () => []);
      const dt = new Date(Date.UTC(this.year, 0, 1));
      let index = 0;
      if (this.year === 2019) {
        index = 7;
      } else {
        index = 6;
      }

      let count = 0;
      let indexMonth = 0;
      while (dt <= new Date(Date.UTC(this.year, 11, 31))) {
        const month = dt.getMonth();

        if (count === 7) {
          index += 7;
          count = 0;

          if (index > hash[this.year][indexMonth]) {
            index -= hash[this.year][indexMonth];
            indexMonth += 1;
          }
        }

        cellData[month].push(new Date(dt));
        dt.setDate(dt.getDate() + 1);
        count += 1;
      }

      return cellData;
    },
  },

  methods: {
    cellX(d) {
      return d3.utcMonday.count(d3.utcYear(d), d)
         * this.cellSize + this.cellPadding;
    },

    cellY(d) {
      // 0代表星期天
      const index = d.getUTCDay() % 7;
      return ((index + 6) % 7) * this.cellSize + this.cellPadding;
    },

    cellColor(d) {
      return this.colorSchema(this.colorScaleAcc(d.toISOString().substr(0, 10)));
    },
  },

  mixins: [
    chartBand,
  ],
};
</script>

<style scoped>
  text {
    font-size: 12px;
  }
</style>
