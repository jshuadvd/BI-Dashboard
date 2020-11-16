<template>
  <grid-layout
    class="bi-grid-layout"
    :layout.sync = "layout"
    :col-num="12"
    :row-height="30"
    :is-draggable="true"
    :is-resizable="true"
    :is-mirrored="false"
    :margin="[10, 10]"
    :use-css-transforms="true"
    :auto-size="false"
    :prevent-collision="true"
  >
    <grid-item v-for="item in layout"
      :x="item.x"
      :y="item.y"
      :w="item.w"
      :h="item.h"
      :i="item.i"
      :key="item.i"
    >
      <component :is="hashComponents[item.i]" />
      <v-btn
        small depressed
        class="bi-btn"
        @click="delItem(item.i)"
      >X</v-btn>
    </grid-item>
  </grid-layout>
</template>

<script>
import { GridLayout, GridItem } from 'vue-grid-layout';
import CalendarContainerVue from '../components/charts/calendar/CalendarContainer.vue';
import LineChartContainerVue from '../components/charts/linecharts/LineChartContainer.vue';
import BarChartContaineVue from '../components/charts/barcharts/BarChartContainer.vue';

export default {
  props: {
    layout: {
      type: Array,
      required: true,
    },
  },
  components: {
    GridLayout,
    GridItem,
  },
  methods: {
    // ind: layout元素的id(d.i)
    delItem(ind) {
      this.$emit('del-item', ind);
    },
  },
  data() {
    return {
      hashComponents: {
        0: LineChartContainerVue,
        2: BarChartContaineVue,
        1: CalendarContainerVue,
      },
    };
  },
};
</script>

<style scoped lang="scss">
.bi-grid-layout {
  min-height: 100%;
}
.vue-grid-layout {
    background: #fff;
}
.vue-grid-item:not(.vue-grid-placeholder) {
    background: #fff;
    border: 1px solid black;
}

.vue-grid-item {
  position: relative;
}

.vue-grid-item .resizing {
    opacity: 0.9;
}
.vue-grid-item .static {
    background: #cce;
}
.vue-grid-item .text {
    font-size: 24px;
    text-align: center;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    height: 100%;
    width: 100%;
}
.vue-grid-item .no-drag {
    height: 100%;
    width: 100%;
}
.vue-grid-item .minMax {
    font-size: 12px;
}
.vue-grid-item .add {
    cursor: pointer;
}
.vue-draggable-handle {
    position: absolute;
    width: 20px;
    height: 20px;
    top: 0;
    left: 0;
    background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'><circle cx='5' cy='5' r='5' fill='#999999'/></svg>") no-repeat;
    background-position: bottom right;
    padding: 0 8px 8px 0;
    background-repeat: no-repeat;
    background-origin: content-box;
    box-sizing: border-box;
    cursor: pointer;
}
.v-btn.bi-btn {
  position:absolute;
  top:0px;
  right:0px;
}
</style>
