<template>
  <v-sheet :class="['bi-main', drawer?'hide-drawer':'']"
    v-click-outside="toggleClick"
  >
    <div class="bi-sidenav">
      <sidenav
      :nameExist="nameExist"
      defaultName="报表1"
      @add-rich-text="addRichText"
      @add-title-text="addTitleText"
      @save-as-image="saveAsImage"
      @save-as-pdf="saveAsPdf" />
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
import domtoimage from 'dom-to-image';
import { jsPDF } from 'jspdf';
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
    layout: [],
    del: [],
    nameExist: false,
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
        // TODO 默认现在为0
        return this.titles[0];
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
      // const yMax = Math.max(...value.map((chart) => chart.status.size.y));
      // console.log(yMax);

      this.layout = value.map((chart, index) => {
        if (chart.backid !== -1) {
          return {
            x: chart.status.size.x || 0,
            y: chart.status.size.y || 0,
            w: chart.status.size.w || 6,
            h: chart.status.size.h || 12,
            backid: chart.backid,
            isTitle: chart.isTitle,
            i: index,
            drag: (chart.isTitle !== true),
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
          isTitle: chart.isTitle,
          i: index,
          drag: (chart.isTitle !== true),
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
      if (this.nameExist !== true) {
        this.layout.forEach((layout, index) => {
          if (this.layout[index].status && this.layout[index].status.size) {
            this.$store.dispatch('updateChartData',
              {
                choseId: index,
                data: {
                  h: layout.h, w: layout.w, x: layout.x, y: layout.y + 3,
                },
                pro: 'size',
              });
          }
        });
        const status = {
          data: {
            content: '<h1 class="ql-align-center"><strong class="ql-size-large">医保智能监测系统</strong></h1>',
            isTitle: true,
          },
          size: {
            w: 12, h: 3,
          },
          backid: -1,
        };
        const data = new Chart('richtext', status, null);
        this.$store.dispatch('addChart', data);
        this.nameExist = true;
      } else {
        let i;
        for (i = 0; i < this.layout.length; i++) {
          if (this.layout[i].isTitle === true) { break; }
        }
        this.delItem(i);
        // console.log(this.charts);
        this.nameExist = false;
      }
      // console.log('add', this.nameExist);
    },
    addRichText() {
      const status = {
        data: {
          content: '<h1>测试文本测试文本测试文本测试文本</h1>',
          isTitle: false,
        },
        size: {
          x: 0, y: 0, w: 6, h: 4,
        },
        backid: -1,
      };
      const data = new Chart('richtext', status, null);
      this.$store.dispatch('addChart', data);
    },
    delItem(ind) {
      let index;
      for (index = 0; index < this.layout.length; index++) {
        if (this.layout[index].i === ind) {
          this.del.push(this.layout[index].backid);
          break;
        }
      }
      console.log('deleteItem,dashboard', ind, this.layout[ind]);
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
      data.settings.forEach((value) => {
        const comp = {};
        comp.x = value.x;
        comp.y = value.y;
        comp.w = value.w;
        comp.h = value.h;
        comp.status = value.config.status;
        comp.setting = value.config.setting;
        comp.type = value.config.type;
        const status = {
          ...comp.status,
          size: {
            w: comp.w, h: comp.h, x: comp.x, y: comp.y,
          },
          backid: value.id,
        };
        if (value.config.status.data && value.config.status.data.isTitle) {
          this.nameExist = true;
        }
        const chart = new Chart(comp.type, status, comp.setting);
        this.$store.dispatch('addChart', chart);
      });
      console.log(this.nameExist);
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
        del: this.del,
      });
    },
    preView() {
      const element = document.getElementById('print');
      element.requestFullscreen();
    },
    saveAsPdf(fileName) {
      const node = document.getElementById('print');
      const scale = 3;
      domtoimage.toPng(node, {
        width: node.scrollWidth * scale,
        height: node.parentNode.scrollHeight * scale,
        style: {
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        },
      }).then((dataUrl) => {
        const JsPDF = jsPDF;
        const pdf = new JsPDF('p', 'px', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        const widthRatio = pageWidth / node.scrollWidth;
        const heightRatio = pageHeight / node.parentNode.scrollHeight;
        const ratio = widthRatio > heightRatio ? heightRatio : widthRatio;

        const realWidth = node.scrollWidth * ratio;
        const realHeight = node.parentNode.scrollHeight * ratio;

        pdf.addImage(dataUrl, 'png', 0, 0, realWidth, realHeight);
        pdf.save(`${fileName}.pdf`);
      });
    },
    saveAsImage(fileName) {
      const node = document.getElementById('print');
      const scale = 3;
      domtoimage.toJpeg(node, {
        width: node.scrollWidth * scale,
        height: node.parentNode.scrollHeight * scale,
        style: {
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        },
      }).then((dataUrl) => {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `${fileName}.jpeg`;
        link.click();
      });
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
