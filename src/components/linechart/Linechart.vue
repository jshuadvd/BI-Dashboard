<template>
  <parent-wrapper :width="width" :height="height">
    <g clip-path ="url(#clip)"
      :transform='`translate(${left}, ${top})`'
    >
      <path v-for="(d,i) in datum"
        :key="i"
        :d="line(d)"
        :style="{
          stroke: `var(--color-${i})`,
        }"
        class="bi-line animate-line"
      />

      <g class="grid-line">
        <line :y2="chartHeight" v-for="n in 11" :key="n"
          :transform="`translate(${scales.xScale(new Date(Date.UTC(2020, n, 1)))},0)`"
          :id="new Date(Date.UTC(2020, n, 0))"
          />
        <line :transform="`translate(${scales.xScale(new Date(Date.UTC(2020, 12, 0)))},0)`"
          :y2="chartHeight"  />
        <line :transform="`translate(${scales.xScale(new Date(Date.UTC(2020, 0, 0)))},0)`"
          :y2="chartHeight"  />
      </g>
    </g>

    <axis
      :transformX="transformX"
      :transformY="transformY"
      :xOption="xOption"
      :yOption="yOption"
      :xPath="xPath"
      :yPath="yPath"
    />
    <!-- slot -->
    <slot></slot>
  </parent-wrapper>
</template>

<script>
import * as d3 from 'd3';
import chartBand from '@/mixins/chartBand';
import ParentWrapperVue from '../wrapper/ParentWrapper.vue';
import AxisVue from '../axis/Axis.vue';

export default {
  props: {
    // 数据
    datum: {
      type: Array,
    },
    accessorX: {
      // 获取数据的回调
      type: Function,
      // default: (d, index) => return datum[d]
    },
    accessorY: {
      type: Function,
    },
    xDomain: {
      type: Array,
    },
    yDomain: {
      type: Array,
    },
    xScaleAcc: {
      type: Function,
    },
    yScaleAcc: {
      type: Function,
    },
  },

  components: {
    ParentWrapper: ParentWrapperVue,
    Axis: AxisVue,
  },

  data() {
    return {
      // chartX: null,
      // chartY: null,
    };
  },

  watch: {
  },

  computed: {
    scales() {
      // calculate xDomain and yDomain of the datum
      const xFlag = this.xDomain === undefined;
      const yFlag = this.yDomain === undefined;

      // TODO 目前只支持Number类型，如果是其他类型需要在传进来前处理
      let xMin = Number.MAX_VALUE, yMin = Number.MAX_VALUE,
        xMax = Number.MIN_VALUE, yMax = Number.MIN_VALUE;

      this.datum.forEach((data) => {
        data.forEach((d, i) => {
          if (xFlag) {
            const x = +this.accessorX(d, i);
            xMin = Math.min(xMin, x);
            xMax = Math.max(xMax, x);
          }

          if (yFlag) {
            const y = +this.accessorY(d, i);
            yMin = Math.min(yMin, y);
            yMax = Math.max(yMax, y);
          }
        });
      });

      // if the domain has been assigned, just use the value
      const x = xFlag ? [xMin, xMax] : this.xDomain;
      const y = yFlag ? [0, yMax] : this.yDomain;

      const xScale = d3.scaleTime()
        .domain(x)
        .range([0, this.chartWidth]);

      const yScale = d3.scaleLinear()
        .domain(y)
        .range([this.chartHeight, 0]).nice();

      return { xScale, yScale };
    },

    accUseByXScale() {
      if (this.xScaleAcc) {
        return this.xScaleAcc;
      }
      return this.accessorX;
    },

    accUseByYScale() {
      if (this.yScaleAcc) {
        return this.yScaleAcc;
      }
      return this.accessorY;
    },

    line() {
      const {
        scales, accUseByXScale, accUseByYScale,
      } = this;

      const { xScale, yScale } = scales;

      if (xScale && yScale) {
        return d3
          .line()
          .curve(d3.curveCardinal)
          .x((d, index) => xScale(accUseByXScale(d, index)))
          .y((d, index) => yScale(accUseByYScale(d, index)));
      }
      return null;
    },

    // for axis
    transformX() {
      return `translate(${this.left}, ${this.chartHeight + this.top})`;
    },
    transformY() {
      return `translate(${this.left}, ${this.top})`;
    },
    xPath() {
      return `M${this.left - 5}, ${this.chartHeight + this.top} H${this.chartWidth + this.left}`;
    },
    yPath() {
      return `M${this.left}, ${this.top - 5} V${5 + this.chartHeight + this.top}`;
    },

    xOption() {
      return {
        scale: this.scales.xScale,
        tickFormat: d3.timeFormat('%m-%d'),
      };
    },

    yOption() {
      return {
        scale: this.scales.yScale,
      };
    },
  },

  mixins: [
    chartBand,
  ],
};
</script>

<style scoped lang="scss">
  path.animate-line {
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;

    animation-name: draw;
    animation-duration: 1.5s;
    animation-fill-mode: forwards;
    animation-iteration-count: 1;
    animation-timing-function: ease-in-out;
  }

  @keyframes draw {
    85% {
    }
    100% {
      stroke-dashoffset: 0;
    }
  }

  .grid-line {
    stroke: #ccc;
  }
</style>
