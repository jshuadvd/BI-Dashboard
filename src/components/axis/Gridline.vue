<template>
  <g v-axis:[orient]="{
    scale: xScale,
    inner: chartHeight,
    tickFormat: ''}"
    class="bi-gridline"
  />
</template>

<script>
export default {
  props: {
    orient: {
      type: String,
      // 默认放在bottom, 其他选项"top" "right" "left"首字母
      default: 'b',
    },
    scale: {
      type: Function,
      required: true,
    },
    inner: {
      type: Number,
      require: true,
    },
  },
};
</script>
