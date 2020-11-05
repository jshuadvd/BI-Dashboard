<template>
  <div class="layout">
    <v-btn
      dense
      @click="addItem"
    >
      添加一个
    </v-btn>
  </div>
</template>

<script>
export default {
  methods: {
    addItem() {
      this.$emit('add-item');
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
