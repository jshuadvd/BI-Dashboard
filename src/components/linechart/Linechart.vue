<template>
  <parent-wrapper :width="width" :height="height">
    <g clip-path ="url(#clip)"
      :transform='`translate(${margin.left}, ${margin.top})`'
    >
      <path v-for="(d,i) in datum"
        :key="i"
        :d="line(d)"
        :style="{
          stroke: '#6672fb',
          fill: 'none'
        }"
      />
    </g>
    <!-- slot -->
    <slot></slot>
  </parent-wrapper>
</template>

<script>
import * as d3 from 'd3';
import axisDirective from '@/directives/axis';
import chartBand from '@/mixins/chartBand';
import ParentWrapperVue from '../wrapper/ParentWrapper.vue';

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
  },

  components: {
    ParentWrapper: ParentWrapperVue,
  },

  computed: {
    chartX() {
      return d3.scaleLinear()
        .domain([0, 365])
        // .domain([new Date(Date.UTC(2020, 0, 0)), new Date(Date.UTC(2020, 11, 31))])
        .range([0, this.chartWidth]);
    },

    chartY() {
      return d3.scaleLinear().domain([0, 100000000]).range([this.chartHeight, 0]).nice();
    },

    line() {
      const {
        chartX, chartY, accessorX, accessorY,
      } = this;
      return d3
        .line()
        .curve(d3.curveCardinal)
        .x((d, index) => chartX(accessorX(d, index)))
        .y((d, index) => chartY(accessorY(d, index)));
    },
  },

  directives: {
    axis: axisDirective,
  },

  mixins: [
    chartBand,
  ],
};
</script>

<style>

</style>
