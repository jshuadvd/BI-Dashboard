// calculate chart width and height
export default {
  props: {
    width: {
      type: Number,
      default: 500,
    },
    height: {
      type: Number,
      default: 300,
    },
    top: {
      type: Number,
      default: 20,
    },
    right: {
      type: Number,
      default: 20,
    },
    bottom: {
      type: Number,
      default: 20,
    },
    left: {
      type: Number,
      default: 20,
    },
  },

  computed: {
    chartWidth() {
      return this.width - this.left - this.right;
    },
    chartHeight() {
      return this.height - this.top - this.bottom;
    },
  },
};
