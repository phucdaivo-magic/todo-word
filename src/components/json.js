import div from "../libs/domtree";

class JsonDOMTree {
  constructor(props = {}) {
    this.props = props;

  }
  render() {
    return div({ ...this.props.json });
  }
}

export { JsonDOMTree };