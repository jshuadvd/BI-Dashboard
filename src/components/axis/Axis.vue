<template>
  <g class="bi-chart-axis">
    <!-- for xaxis: on the left of the chart -->
    <g v-axis:[xScalePos]="xOption"
      :transform="transformX"
    />

    <!-- for yaxis: on the bottom of the chart -->
    <g v-axis:[yScalePos]="yOption"
      :transform="transformY"
    />

    <path :d="yPath" />
    <path :d="xPath" />
  </g>

</template>

<script>
import axisDirective from '@/directives/axis';

export default {
  props: {
    transformX: {
      type: String,
      default: 'translate(0,0)',
    },
    transformY: {
      type: String,
      default: 'translate(0,0)',
    },
    xScalePos: {
      type: String,
      default: 'b',
    },
    yScalePos: {
      type: String,
      default: 'l',
    },
    /**
     * {
     *    scale: 比例尺
     *    tickFormat：axis文字的格式化
     * }
     */
    xOption: {
      type: Object,
      required: true,
    },
    yOption: {
      type: Object,
      required: true,
    },

    xPath: {
      type: String,
    },
    yPath: {
      type: String,
    },
  },

  directives: {
    axis: axisDirective,
  },

};
</script>

<style lang="scss">
  .bi-chart-axis {
    .tick line {
      display: none;
    }
    path.domain {
      display: none;
    }

    path {
      stroke: #5b5b5b;
      stroke-width: 1;
      // prevents strokes from scaling as an SVG scales
      vector-effect: non-scaling-stroke;
    }
  }
</style>
