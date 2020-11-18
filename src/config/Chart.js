const Chart = (() => {
  // 作为chart的标识符
  let id = 0;

  class ChartClass {
    constructor(type, status) {
      // 组件的类型
      this.type = type;
      // 复现组件状态的data，对象
      this.status = status;
      this.id = id;
      id += 1;
    }
  }

  return ChartClass;
})();

export default Chart;
