<template>
  <div class="bi-svg-parent">
    <svg
      :viewBox="`0 0 ${width} ${height}`"
      :width="width"
      :height="height"
    >
      <slot></slot>
    </svg>
  </div>
</template>

<script>
export default {
  // 确保svg的长宽和父亲div一样
  props: {
    width: Number,
    height: Number,
  },
};
</script>

<style scoped lang="scss">
  .bi-svg-parent {
    display: inline-block;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
</style>
