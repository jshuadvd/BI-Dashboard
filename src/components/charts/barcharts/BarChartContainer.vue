<template>
  <div class="bi-chart-item">
    <BarChart :datum="datum"
    />
  </div>
</template>

<script>
import fakeData from '@/mock/b.json';
import BarchartVue from '../../barchart/Barchart.vue';

export default {
  components: {
    BarChart: BarchartVue,
  },
  data() {
    return {
      datum: fakeData,
    };
  },
  computed: {
  },
  mounted() {
    // console.log();
  },
};
</script>
