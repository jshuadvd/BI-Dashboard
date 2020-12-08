<template>
  <v-sheet :class="['bi-main', drawer?'hide-drawer':'']"
    v-click-outside="toggleClick"
  >
    <div class="bi-sidenav">
      <sidenav
        @add-rich-text="addRichText"
        @add-title-text="addTitleText"
      />
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
          <label @click = "edited = true;"> {{titleMap}} </label>
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

          <v-btn text medium outlined
          @click="preView">
            预览
          </v-btn>
        </v-btn-toggle>

        <div class="bi-btn">
          <v-btn text medium outlined
          @click="saveDashboard">
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
      <Canvas  id='print' :layout="layout" @del-item="delItem" />
    </div>
  </v-sheet>
</template>

<script>
import { mapState } from 'vuex';
import { fetchDashboardTitle, updateDashboard, getDashboardComponents } from '@/utils/api';
import Chart from '@/config/Chart';
import ClickOutside from 'vue-click-outside';
import Canvas from './views/Canvas.vue';
import Sidenav from './views/Sidenav.vue';

export default {
  name: 'App',

  components: {
    Canvas,
    Sidenav,
    // RichTextVue,
  },

  data: () => ({
    drawer: null,
    index: 1,
    // 是否在编辑状态
    edited: false,
    // 编辑还是保存
    dashStatus: 0,
    header: '<h1><strong class="ql-size-large">医保智能监测系统</strong></h1>',
    author: 'VAG',
    layout: [],
    fullscreen: false,
  }),

  computed: {
    ...mapState({
      charts: (state) => state.charts,
      titles: (state) => state.titles,
    }),
    titleMap: {
      set(value) {
        this.$store.dispatch('updateTitle', { title: value, index: 0 });
        // console.log(this.title);
      },
      get() {
        console.log(this.titles[0]);
        // TODO 默认现在为0
        return this.titles[0];
      },
    },
  },
  // destroyed() {
  //   console.log('destroyed.');
  // },
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
    this.getDashboardComponents();
    // console.log('mounted');
    this.popupItem = this.$el;
  },

  directives: {
    ClickOutside,
  },

  methods: {
    toggleClick() {
      this.$store.dispatch('updateId', -1);
    },
    cancelChoose() {
      this.$store.dispatch('updateId', -1);
    },
    mapChart(value) {
      this.layout = value.map((chart) => {
        if (chart.backid !== -1) {
          return {
            x: chart.status.size.x || 0,
            y: chart.status.size.y || 0,
            w: chart.status.size.w || 6,
            h: chart.status.size.h || 12,
            backid: chart.backid,
            i: chart.id,
            drag: true,
            type: chart.type,
            setting: chart.setting,
            status: chart.status,
          };
        }
        return {
          x: chart.status.size.x || 0,
          y: chart.status.size.y || 0,
          w: chart.status.size.w || 6,
          h: chart.status.size.h || 12,
          backid: chart.backid,
          i: chart.id,
          drag: true,
          type: chart.type,
          setting: chart.setting,
          status: {
            data: chart.status.data,
            ...chart.status.state,
            ...chart.props,
          },
        };
      });
    },
    addTitleText() {
      const status = {
        data: {
          content: '<h1><strong class="ql-size-large">医保智能监测系统</strong></h1>',
          isTitle: true,
        },
        size: { w: 12, h: 4 },
        backid: -1,
      };
      const data = new Chart('richtext', status, null);
      this.$store.dispatch('addChart', data);
    },
    addRichText() {
      const status = {
        data: {
          content: '<h1><strong class="ql-size-large">测试文本测试文本测试文本测试文本</strong></h1>',
          isTitle: false,
        },
        size: { w: 12, h: 3 },
        backid: -1,
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
        id: 3,
      });
      this.$store.commit('SET_TITLE', data.title);
    },
    async getDashboardComponents() {
      const data = await getDashboardComponents({
        id: 3,
      });
      console.log('getdashboard');
      data.settings.forEach((value) => {
        const comp = {};
        comp.x = value.x;
        comp.y = value.y;
        comp.w = value.w;
        comp.h = value.h;
        comp.status = value.config.status;
        comp.setting = value.config.setting;
        comp.type = value.config.type;
        // console.log('comp', comp);
        // console.log('value', value);
        const status = {
          ...comp.status,
          size: {
            w: comp.w, h: comp.h, x: comp.x, y: comp.y,
          },
          backid: value.id,
        };
        const chart = new Chart(comp.type, status, comp.setting);
        this.$store.dispatch('addChart', chart);
      });
    },
    async saveDashboard() {
      const settings = [];
      this.layout.forEach((value) => {
        const comp = {};
        comp.id = value.backid;
        comp.x = value.x;
        comp.y = value.y;
        comp.w = value.w;
        comp.h = value.h;
        comp.config = {
          status: value.status,
          setting: value.setting,
          type: value.type,
        };
        settings.push(comp);
      });
      const data = await updateDashboard({
        id: 3,
        title: this.title,
        settings,
        del: [],
      });
      console.log(data);
    },
    preView() {
      const element = document.getElementById('print');
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.msRequestFullscreen) {
        // IE11
        element.msRequestFullscreen();
      }
      // this.fullscreen = !this.fullscreen;
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
    height: 100%;
    background: #fff;

    .bi-sidenav {
      position: absolute;
      right: 0;
      bottom: 0;
      top: 48px;
      width: 275px;
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
