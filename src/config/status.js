class Status {
  constructor(type, props, model) {
    this.type = type;
    this.props = props;
    // this.events = events;
    // remove model 所有组件的更新都使用props和事件
    // this.model = model;
  }

  // set props({ pro, value }) {
  //   console.log(pro, value);
  //   this.props[pro] = value;
  // }
}

export default Status;
