<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      app
      right
    >
      <!-- sidenav -->
      <sidenav @add-item="addItem" />
    </v-navigation-drawer>

    <v-app-bar
      class="bi-app-bar"
      app
      dense
    >
      <v-toolbar-title>Application</v-toolbar-title>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
    </v-app-bar>

    <v-main>
      <!-- main -->
      <Canvas :layout="layout" />
    </v-main>
  </v-app>
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
        x: 0, y: 0, w: 12, h: 8, i: '0',
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
  },
};
</script>

<style lang="scss">
  @import "~@/styles/svg.scss";
  @import "~@/styles/axis/gridline.scss";

  .bi-app-bar {
    .v-toolbar__content {
      justify-content: space-between;
    }
  }
</style>
