<template>
  <v-sheet :class="['bi-main', drawer?'hide-drawer':'']">
    <div class="bi-sidenav">
      <sidenav @add-item="addItem" />
    </div>

    <v-toolbar class="bi-app-bar" dense>
      <v-toolbar-title
        class="app-bar-title"
      >
        <input
          v-if = "edited"
          v-model = "title"
          @blur= "edited = false; $emit('update')"
          @keyup.enter = "edited=false; $emit('update')"
        />
        <div v-else>
          <label @click = "edited = true;"> {{title}} </label>
        </div>
      </v-toolbar-title>
      <div>
        <v-btn-toggle
          v-model="dashStatus"
          mandatory
          color="blue darken-2"
        >
          <v-btn text medium outlined>
            编辑
          </v-btn>

          <v-btn text medium outlined>
            预览
          </v-btn>
        </v-btn-toggle>

        <div class="bi-btn">
          <v-btn text medium outlined>
            保存
          </v-btn>
        </div>
        <div class="bi-btn">
          <v-btn text medium outlined>
            返回继续浏览
          </v-btn>
        </div>
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      </div>
    </v-toolbar>

    <div class="bi-canvas">
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
    layout: [],
    index: 1,
    // 报名的名字
    title: '未命名报表',
    // 是否在编辑状态
    edited: false,
    // 编辑还是保存
    dashStatus: 0,
  }),

  mounted() {
    const charts = JSON.parse(localStorage.charts);
    if (charts) {
      this.layout = charts.map((chart) => ({
        x: 0,
        y: 0,
        w: 6,
        h: 12,
        i: chart.id,
        status: chart.status,
        type: chart.type,
      }));
    }
  },

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
      let { charts } = localStorage;
      if (charts) {
        charts = JSON.parse(charts);
      }
      charts = charts.filter((chart) => chart.id !== ind);
      localStorage.setItem('charts', JSON.stringify(charts));
    },
    editTodo(todo) {
      this.edited = todo;
    },
  },
};
</script>

<style lang="scss">
  @import "~@/styles/variables.scss";
  @import "~@/styles/svg.scss";
  @import "~@/styles/legends.scss";
  @import "~@/styles/axis/gridline.scss";

  .bi-app-bar {
    .v-toolbar__content {
      justify-content: space-between;
    }

    box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2)!important;

    .bi-btn {
      border-radius: 4px;
      display: inline-flex;
      margin: 0 1px;

      .v-btn {
        height: 48px;
        min-height: 0;
        min-width: 48px;
      }
    }

    .app-bar-title {
      margin-left: -5px;

      label, input {
        user-select: none;
      }

      input {
        border: 1px solid #ccc;
        background: transparent;
        padding: 2px 7px;

        &:focus {
          outline: none;
        }
      }

      div {
        padding: 2px 7px;
        border: 1px solid #fff;
      }
    }
  }

  .bi-main {
    position: relative;
    height: 90vh;

    .bi-sidenav {
      position: absolute;
      right: 0;
      bottom: 0;
      top: 48px;
      width: 275px;
      background: #fff;
      transform: translate3d(0px, 0px, 0px);
      transition: transform .3s ease-in-out;
      box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2);
    }

    .bi-canvas {
      transition: all .3s ease-in-out;
      margin-right: 280px;
      overflow: auto;
      min-height: 80vh
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
