<template>
  <v-sheet :class="['bi-main', drawer?'hide-drawer':'']">
    <div class="bi-sidenav">
      <sidenav @add-item="addItem" />
    </div>

    <div class="bi-canvas">
      <v-toolbar class="bi-app-bar" dense>
        <v-toolbar-title>Application</v-toolbar-title>
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      </v-toolbar>

      <!-- main -->
      <Canvas :layout="layout" @del-item="delItem" />
    </div>
  </v-sheet>
</template>

<script>
import Canvas from './views/Canvas.vue';
import Sidenav from './views/Sidenav.vue';

export default {
  name: 'App',

  components: {
    Canvas,
    Sidenav,
  },

  data: () => ({
    drawer: null,
    layout: [
      {
        x: 0, y: 0, w: 6, h: 12, i: '0',
      },
      {
        x: 6, y: 0, w: 6, h: 12, i: '1',
      },
      {
        x: 0, y: 12, w: 6, h: 12, i: '2',
      },
    ],
    index: 1,
  }),

  methods: {
    addItem() {
      this.layout.push({
        x: (this.layout.length * 2) % (this.colNum || 12),
        y: this.layout.length + (this.colNum || 12),
        w: 2,
        h: 2,
        i: this.index,
      });
      this.index += 1;
    },
    delItem(ind) {
      this.layout = this.layout.filter((d) => d.i !== ind);
    },
  },
};
</script>

<style lang="scss">
  @import "~@/styles/svg.scss";
  @import "~@/styles/legends.scss";
  @import "~@/styles/axis/gridline.scss";

  .bi-app-bar {
    .v-toolbar__content {
      justify-content: space-between;
    }
  }

  .bi-main {
    position: relative;
    height: 90vh;

    .bi-sidenav {
      position: absolute;
      right: 0;
      width: 15vw;
      bottom: 0;
      transform: translate3d(0px, 0px, 0px);
      position: absolute;
      width: 280px;
      background: #fefefe;
      height: 100%;
      transition: transform .3s ease-in-out;
      box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2),
        0px 4px 5px 0px rgba(0, 0, 0, 0.14),
        0px 1px 10px 0px rgba(0, 0, 0, 0.12);
    }

    .bi-canvas {
      transition: margin-right .3s ease-in-out;
      margin-right: 280px;
    }
  }

  .hide-drawer {
      .bi-canvas {
        margin-right: 0;
      }

      .bi-sidenav {
        transform: translate3d(280px, 0px, 0px);
      }
    }
</style>
