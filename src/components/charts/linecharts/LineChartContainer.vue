<template>
  <div class="bi-chart-item">
    <linechart
      :datum="wrapperdData"
      :accessorX="accessorX"
      :accessorY="accessorY"
    />
  </div>
</template>

<script>
import fakeData from '@/mock/a.json';
import LinechartVue from '../../linechart/Linechart.vue';

export default {
  components: {
    Linechart: LinechartVue,
  },

  data() {
    return {
      wrapperdData: Object.values(fakeData).map((d) => Object.entries(d)),
      accessorX: (d, i) => i,
      accessorY: (d, i) => d[1].value,
    };
  },

  mounted() {
    // console.log(Object.values(fakeData));
  },
};
</script>

<style scoped lang="scss">

</style>
