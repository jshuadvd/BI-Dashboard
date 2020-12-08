const Chart = (() => {
  // 作为chart的标识符
  let id = 0;
  class ChartClass {
    constructor(type, status, setting) {
      // 组件的类型
      this.type = type;
      // 复现组件状态的data，对象
      this.status = status;
      this.backid = status.backid;
      this.isTitle = status.data.isTitle;
      this.id = id;
      id += 1;
      this.setting = setting;
    }

    get props() {
      const obj = {};
      if (this.status && this.status.props && this.setting) {
        this.status.props.forEach((config, i) => {
          const set = this.setting[i];
          // console.log('getProps', config);

          config.forEach((configItem) => {
            if (configItem.constructor === String) {
              obj[configItem] = set.props[configItem];
            } else {
              const value = set.props[configItem.propsKey];
              obj[configItem.compProps] = value;
            }
          });
        });
      }

      return obj;
    }

    updateSetting({ i, pro, value }) {
      this.setting[i].props[pro] = value;
    }

    updateData(pro, data) {
      this.status = { ...this.status, ...{ [pro]: { ...this.status[pro], ...data } } };
    }
  }
  return ChartClass;
})();

export default Chart;
