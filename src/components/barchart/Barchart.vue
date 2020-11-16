<template>
  <parent-wrapper :width="width" :height="height">
    <g :transform="`translate(${left},${top})`" ref="bars">
      <rect
        v-for="(value, name) in datum"
        :key="name"
        fill="#2198f8"
        :transform="`translate(${(scales.xScale.bandwidth() - w) / 2},0)`"
        :x="scales.xScale(name)"
        :y="scales.yScale(value)"
        :width="w"
        :height="chartHeight-scales.yScale(value)"
        :rx="r"
      >
      </rect>
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
    datum: {
      type: Object,
    },
  },
  components: {
    ParentWrapper: ParentWrapperVue,
    Axis: AxisVue,
  },
  data() {
    return {
    };
  },
  watch: {
  },
  computed: {
    scales() {
      const xScale = d3.scaleBand()
        .domain(Object.keys(this.datum))
        .rangeRound([0, this.chartWidth]);

      const yScale = d3.scaleLinear()
        .domain([0, d3.max(Object.values(this.datum))])
        .range([this.chartHeight, 0]);
      return { xScale, yScale };
    },
    w() {
      return Math.min(this.scales.xScale.bandwidth(), 10);
    },
    // 矩形角的弧度
    r() {
      return 2;
    },
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
  mounted() {
    // console.log(this.datum);
  },
};
</script>
<style lang="scss">
.grid-line {
  stroke: #ccc;
}
</style>
