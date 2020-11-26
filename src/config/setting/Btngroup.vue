<template>
  <v-btn-toggle v-model="propModel"
    group
    color="blue accent-3"
    class="bi-btn"
  >
    <v-btn v-for="(btn, index) in options"
      :key="index"
    >
      <v-icon >{{btn}}</v-icon>
    </v-btn>
  </v-btn-toggle>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
    },
    value: Number,
  },

  computed: {
    propModel: {
      get() { return this.value; },
      set(value) { this.$emit('change', value); },
    },
  },

};
</script>

<style scoped lang="scss">
  .bi-btn {
    .v-icon {
      font-style:normal;
      font-size: 16px;
    }

    button {
      height: 36px!important;
      border-bottom: 1px solid!important;
      margin: 0 0 20px 0!important;
    }
  }
</style>
