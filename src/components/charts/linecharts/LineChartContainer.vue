<template>
  <div class="bi-chart-item">
    <!-- <v-select
      :items="items"
      v-model="itemSelect"
      item-text="title"
      item-value="value"
      solo
      dense
      hide-details
      flat
    ></v-select> -->

    <linechart
      :datum="datum"
      :accessorX="accessorX"
      :accessorY="accessorY"
      :xDomain="xDomain"
      :xScaleAcc="xScaleAcc"
      :yScaleAcc="yScaleAcc"
    />
  </div>
</template>

<script>
import fakeData from '@/mock/a.json';
import YEAR_HASH from '@/utils/yearHash';
import LinechartVue from '../../linechart/Linechart.vue';

export default {
  components: {
    Linechart: LinechartVue,
  },

  data() {
    return {
      items: [
        { value: 0, title: '月', key: 'month' },
        { value: 1, title: '周', key: 'week' },
        { value: 2, title: '日', key: 'day' },
      ],
      itemSelect: 1,

      // chartProps:
      datum: Object.values(fakeData).map((d) => Object.entries(d)),
      accessorX: (d, i) => new Date(d[0]),
      xDomain: [new Date(Date.UTC(2020, 0, 0)), new Date(Date.UTC(2020, 11, 31))],

    };
  },

  computed: {
    accessorY() {
      return (d, i) => d[1].value;
    },
    xScaleAcc() {
      const { itemSelect } = this;

      return (d, i) => new Date(`2020${String(YEAR_HASH[d[0]][itemSelect]).slice(4)}`);
    },
    yScaleAcc() {
      const { itemSelect } = this;

      return (d, i) => {
        // TODO 目前的月日周切换没有接后台数据，但是已经写了更新逻辑
        const hashDay = YEAR_HASH[d[0]][itemSelect];
        return fakeData[hashDay.slice(0, 4)][hashDay].value;
      };
    },
  },

  mounted() {
    // console.log(YEAR_HASH);
  },
};
</script>

<style scoped lang="scss">

</style>
