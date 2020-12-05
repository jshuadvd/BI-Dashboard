<template>
  <v-sheet :class="['bi-main', drawer?'hide-drawer':'']">
    <div class="bi-sidenav">
      <sidenav @add-item="addItem" @add-rich-text="addRichText"/>
    </div>

    <v-toolbar class="bi-app-bar" dense>
      <v-toolbar-title
        class="app-bar-title"
      >
        <input
          v-if = "edited"
          v-model = "titleMap"
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
          <v-btn text medium outlined
            @click="$router.go(-1)"
          >
            返回继续浏览
          </v-btn>
        </div>
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      </div>
    </v-toolbar>

    <div class="bi-canvas">
      <!-- main -->
      <RichTextVue
      class="header">
      </RichTextVue>
      <Canvas :layout="layout" @del-item="delItem" />
    </div>
  </v-sheet>
</template>

<script>
import Chart from '@/config/Chart';
import { mapState } from 'vuex';
import { fetchDashboardTitle } from '@/utils/api';
import Canvas from './views/Canvas.vue';
import Sidenav from './views/Sidenav.vue';
import RichTextVue from './components/richtext/RichText.vue';

export default {
  name: 'App',

  components: {
    Canvas,
    Sidenav,
    RichTextVue,
  },

  data: () => ({
    drawer: null,
    index: 1,
    // 是否在编辑状态
    edited: false,
    // 编辑还是保存
    dashStatus: 0,
    header: '医保智能检测系统汇报',
    author: 'VAG',
    layout: [],
  }),

  computed: {
    ...mapState({
      charts: (state) => state.charts,
      title: (state) => state.title,
    }),
    titleMap: {
      set(value) {
        this.$store.dispatch('updateTitle', value);
        // console.log(this.title);
      },
      get() {
        return this.title;
      },
    },
  },

  watch: {
    charts: {
      handler(value) {
        this.mapChart(value);
      },
      deep: true,
    },
  },

  mounted() {
    this.getDashboardTitle();
    this.mapChart(this.charts);
  },

  methods: {
    mapChart(value) {
      this.layout = value.map((chart, index) => {
        console.log('chartSize', index, chart.status.size);

        // let x = 0, y = 0;
        // if (index > 0 && chart.status.size.x === undefined) {
        //   const lastChart = value[index - 1];
        //   if (lastChart.status.size.x + lastChart.status.size.w + chart.status.size.w <= 12) {
        //     x = lastChart.status.size.x + lastChart.status.size.w;
        //   } else {
        //     y = lastChart.status.size.y + lastChart.status.size.h;
        //   }
        // }
        return ({
          x: chart.status.size.x || 0,
          y: chart.status.size.y || 0,
          w: chart.status.size.w || 6,
          h: chart.status.size.h || 12,
          i: chart.id,
          drag: true,
          type: chart.type,
          setting: chart.setting,
          status: {
            data: chart.status.data,
            ...chart.status.state,
            ...chart.props,
          },
        });
      });
    },
    addItem() {
      this.layout.push({
        x: (this.layout.length * 2) % (this.colNum || 12),
        y: this.layout.length + (this.colNum || 12),
        w: 2,
        h: 2,
        i: this.index,
        drag: true,
        status: {},
        setting: {},
      });
      this.index += 1;
    },
    addRichText() {
      const status = {
        data: {
          content: '',
        },
        size: { w: 6, h: 4 },
      };
      const data = new Chart('richtext', status, null);
      this.$store.dispatch('addChart', data);
    },
    delItem(ind) {
      this.$store.dispatch('deleteChart', ind);
    },
    editTodo(todo) {
      this.edited = todo;
    },
    async getDashboardTitle() {
      const data = await fetchDashboardTitle({
        id: '1',
      });
      this.$store.commit('SET_TITLE', data.title);
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
      label {
        display: block;
        min-width: 80px;
        min-height: 50px;
        line-height: 50px;
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
      min-height: 80vh;

      .header {
        display: flex;
        justify-content: center;
        align-items: flex-end;
        margin: 5px 0;

        h1, h3 {
          font-weight: 300;
        }
      }
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
