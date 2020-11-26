<template>
  <time-picker
    :type="true"
    :dateEnd="dateEnd"
    :dateStart="dateStart"
    :menu1="menu1"
    :menu2="menu2"
    @updateMenu1="updateMenu1"
    @updateMenu2="updateMenu2"
    @updateDateStart="updateDateStart"
    @updateDateEnd="updateDateEnd"
  />
</template>

<script>
import TimePickerVue from '../../site/components/small/TimePicker.vue';

export default {
  components: {
    TimePicker: TimePickerVue,
  },

  props: {
    dateStart: String,
    dateEnd: String,
  },

  data() {
    return {
      menu1: false,
      menu2: false,
    };
  },

  computed: {
    dateStartMap: {
      get() {
        return this.dateStart;
      },
      set(value) {
        this.$emit('update-start', value);
      },
    },

    dateEndMap: {
      get() {
        return this.dateEnd;
      },
      set(value) {
        this.$emit('update-end', value);
      },
    },

  },

  methods: {
    updateMenu1(value) {
      this.menu1 = value;
    },

    updateMenu2(value) {
      this.menu2 = value;
    },

    updateDateStart(value) {
      this.dateStartMap = value;
    },

    updateDateEnd(value) {
      this.dateEndMap = value;
    },
  },

};
</script>

<style>

</style>
