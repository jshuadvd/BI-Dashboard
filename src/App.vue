<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      app
      right
    >
      <!--  -->
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
      <!--  -->
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  components: {
  },

  data: () => ({
    drawer: null,
  }),
};
</script>

<style lang="scss">
  @import "~@/styles/svg.scss";

  .bi-app-bar {
    .v-toolbar__content {
      justify-content: space-between;
    }
  }
</style>
