<template>
  <div class="bi-svg-parent">
    <svg
      width="100%"
      height="100%"
      :viewBox="`0 0 ${width} ${height}`"
      :preserveAspectRatio="preserveAspectRatio"
    >
      <slot></slot>
    </svg>
  </div>
</template>

<script>
export default {
  // TODO 目前方案是保证和parent一样，是否需要其他的方案
  props: {
    width: Number,
    height: Number,
    preserveAspectRatio: {
      type: String,
      default: 'xMidYMid meet',
    },
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
