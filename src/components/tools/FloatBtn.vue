<template>
  <v-speed-dial
    v-model="fab"
    bottom
    right
    absolute
    open-on-hover
    direction="left"
    transition="slide-x-transition"
  >
    <template v-slot:activator>
      <v-btn
        color="blue darken-2"
        dark
        fab
        @click="$emit('click')"
      >
        <v-icon>
          mdi-plus
        </v-icon>
      </v-btn>
    </template>
    <v-sheet class="info" color="blue darken-2">
      添加到报表
    </v-sheet>
  </v-speed-dial>
</template>

<script>
export default {
  data() {
    return {
      fab: null,
    };
  },
};
</script>

<style scoped lang="scss">
  .info {
    z-index: -1;
    position: absolute;
    display: flex;
    border-radius: 20px;
    min-width: 500%;
    padding: 10px 15px;
    box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2),
      0px 6px 10px 0px rgba(0, 0, 0, 0.14),
      0px 1px 18px 0px rgba(0, 0, 0, 0.12);
    color: #fff;
    opacity: .8;
    margin-right: 50px;
  }
</style>
