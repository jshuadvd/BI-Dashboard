<template>
  <div class="layout">
    <v-btn
      dense
      @click="addItem"
    >
      添加一个
    </v-btn>
    <v-btn
    dense
    @click="addRichText">
      添加文本框
    </v-btn>
  </div>
</template>

<script>
export default {
  methods: {
    addItem() {
      this.$emit('add-item');
    },
    addRichText() {
      this.$emit('add-rich-text');
    },
  },
};
</script>

<style scoped lang="scss">
  .layout {
    display: flex;
    padding: 10px 20px;
  }
</style>
