<template>
  <linearGradient id="gradient" x1="0" x2="0" y1="100%" y2="0%">
    <stop offset="0%" stop-color={colors[0]} />
    <stop offset="100%" stop-color={colors[1]} />
  </linearGradient>
</template>

<script>

export default {
  props: {
    colors: {
      type: Array,
      default: () => (['#ff492d', '#2dff9d']),
    },
  },
};
</script>
