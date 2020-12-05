<template>
  <div class="layout">
    <h1>图表设计</h1>
    <v-divider />

    <div class="content">
      <!-- tabs -->
      <v-tabs
        v-model="tab"
        grow
      >
        <v-tab>数据</v-tab>
        <v-tab>图表</v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item>
          <template v-for="(content, i) in contents">
            <template v-if="content.type === 'time' ">
              <timepicker-wrapper-vue
                :key="i"
                v-bind="content.props"
                v-on:update-start="handleChange($event,i,'dateStart')"
                v-on:update-end="handleChange($event,i,'dateEnd')"
              />
            </template>

            <template v-else>
              <component
                :is="content.type" :key="i"
                v-bind="content.props"
                v-on:change="handleChange($event, i, 'value')"
              ></component>
            </template>
             <!-- v-model="content.model" -->

          </template>
        </v-tab-item>

        <v-tab-item>
          <v-text-field
            label="图表标题"
          ></v-text-field>
          <!-- margin -->
          <h3>图表间隔</h3>
          <v-slider
            v-for="(item, i) in margin"
            :key="i"
            v-model="item.value"
            :label="item.label"
            :max="item.range[1]"
            :min="item.range[0]"
            :thumb-size="24"
            hide-details
            inverse-label
          >
            <template v-slot:prepend>
              <span class="slider-value">{{item.value}}</span>
            </template>
          </v-slider>

        </v-tab-item>
      </v-tabs-items>
    </div>

    <div class="footer">
      <v-btn
        dense
        block
        @click="addTitleText">
        添加标题
      </v-btn>
      <br>
      <v-btn
        dense
        block
        @click="addRichText">
        添加富本框
      </v-btn>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { VSelect } from 'vuetify/lib';
import TimePicker from '../site/components/small/TimePicker.vue';
import TimepickerWrapperVue from '../config/setting/TimepickerWrapper.vue';
import Btngroup from '../config/setting/Btngroup.vue';

export default {

  data() {
    return {
      // 切换tab
      tab: 0,
      // 图表的margin状态
      margin: [
        { range: [0, 300], value: 20, label: '上' },
        { range: [0, 300], value: 20, label: '下' },
        { range: [0, 500], value: 20, label: '左' },
        { range: [0, 500], value: 20, label: '右' },
      ],
    };
  },

  components: {
    VSelect,
    TimePicker,
    TimepickerWrapperVue,
    BiBtnGroup: Btngroup,
  },

  computed: {
    ...mapState({
      choseId: (state) => state.choseId,

      contents: (state) => (state.charts[state.choseId] ? state.charts[state.choseId].setting : {}),
    }),

  },

  methods: {
    addItem() {
      this.$emit('add-item');
    },

    handleChange(e, i, pro) {
      console.log('handleChange', e, i, pro);
      this.$store.dispatch('updateChart', {
        choseId: this.choseId, i, pro, value: e,
      });
    },

    addRichText() {
      this.$emit('add-rich-text');
    },
    addTitleText() {
      this.$emit('add-title-text');
    },
  },
};
</script>

<style scoped lang="scss">
  .layout {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 10px 20px;
    height: 100%;

    h1 {
      font-size: 20px;
      font-weight: 400;
      margin: 10px 0;
    }

    .content {
      flex: 1;

      h3 {
        font-weight: 400;
        font-size: 16px;
        color: rgba(0, 0, 0, 0.6);
      }

      .slider-value {
        display: flex;
        align-items: center;
        height: 22px;
      }
    }

    .footer {
      height: 15vh;
    }
  }
</style>
