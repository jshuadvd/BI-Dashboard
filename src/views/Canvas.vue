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
    @layout-ready="layoutReadyEvent"
    @layout-updated="layoutUpdatedEvent"
  >
    <grid-item v-for="(item, index) in layout"
      :x="item.x"
      :y="item.y"
      :w="item.w"
      :h="item.h"
      :i="item.i"
      :key="index"
      :is-draggable="item.drag"
      :class ="{bititle:item.isTitle===true}"
      @resized="resizedEvent"
      @moved="movedEvent"
    >
      <div :class="`item-wrapper ${choseId===index?'active':''}`" @click="clickItem(item.i)"
        :id="item.i" :index="index">
        <component
          :is="hashComponents[item.type]"
          :status="item.status"
          :setting="item.setting"
          @fixed-text="fixed(item.i,$event)"
        />
        <v-btn
          v-if="!item.isTitle"
          small depressed
          class="bi-btn"
          @click.stop="delItem(item.i)"
        >X</v-btn>
      </div>
    </grid-item>
  </grid-layout>
</template>

<script>
import { GridLayout, GridItem } from 'vue-grid-layout';
import HASH from '@/config/hashComponents';
import { mapState } from 'vuex';

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

  data() {
    return {
      hashComponents: HASH,
    };
  },

  computed: {
    ...mapState({
      choseId: (state) => state.choseId,
    }),
  },

  methods: {
    // ind: layout元素的id(d.i)
    delItem(ind) {
      this.$emit('del-item', ind);
    },
    clickItem(index) {
      this.$store.dispatch('updateId', index);
    },
    // f 是否固定文本框
    fixed(i, f) {
      this.layout[i].drag = f;
    },
    /**
     *
     * @param i the item id/index
     * @param newH new height in grid rows
     * @param newW new width in grid columns
     * @param newHPx new height in pixels
     * @param newWPx new width in pixels
     *
     */
    resizedEvent(i, newH, newW, newHPx, newWPx) {
      this.$store.dispatch('updateChartData',
        {
          choseId: i,
          data: { h: newH, w: newW },
          pro: 'size',
        });
      // console.log(`RESIZED i=${i}, H=${newH}, W=${newW}, H(px)=${newHPx}, W(px)=${newWPx}`);
    },
    movedEvent(i, x, y) {
      this.$store.dispatch('updateChartData',
        {
          choseId: i,
          data: { x, y },
          pro: 'size',
        });
      // console.log(`MOVED i=${i}, X=${x}, Y=${y}`);
    },
    layoutUpdatedEvent(newLayout) {
      const layoutProps = this.layout;

      // console.log('update', layoutProps);

      if (layoutProps) {
        newLayout.forEach((layout, index) => {
          if (layoutProps[index].status && layoutProps[index].status.size) {
            const {
              w, h, x, y,
            } = layoutProps[index].status.size;
            if (w !== layout.w || h !== layout.h || x !== layout.x || y !== layout.y) {
              this.$store.dispatch('updateChartData',
                {
                  choseId: layoutProps[index].i,
                  data: {
                    h: layout.h, w: layout.w, x: layout.x, y: layout.y,
                  },
                  pro: 'size',
                });
            }
          }
          // console.log(`i:${layout.i}, index:${index}`);
        });
      }
    },

    layoutReadyEvent(newLayout) {
      // console.log('ready');
      const layoutProps = this.layout;
      if (layoutProps) {
        newLayout.forEach((layout, index) => {
          if (layoutProps[index].status && layoutProps[index].status.size) {
            const {
              w, h, x, y,
            } = layoutProps[index].status.size;
            if (w !== layout.w || h !== layout.h || x !== layout.x || y !== layout.y) {
              this.$store.dispatch('updateChartData',
                {
                  choseId: layoutProps[index].i,
                  data: {
                    h: layout.h, w: layout.w, x: layout.x, y: layout.y,
                  },
                  pro: 'size',
                });
            }
          }

          // console.log(`i:${layout.i}, index:${index}`);
        });
      }
    },
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
  touch-action: none
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
.bititle{
  border:hidden !important;
  width: 100% !important;
  // height: 90px !important;
  // line-height: 200% !important;
  // position:absolute !important;
}
.bi-grid-layout {
  .item-wrapper {
    width: 100%;
    height: 100%;
  }

  .active {
    border: 1px solid #2f77d3;
  }
}
</style>
