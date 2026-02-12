import div from "../libs/domtree";
import { documentToHtmlString } from "@contentful/rich-text-html-renderer";

class HTMLDOMTree {
  constructor(props = {}) {
    this.props = props;
  }
  render() {
    return div({
      attrs: {
        class: this.props.class.join(" "),
      },
      childs: documentToHtmlString(this.props.html),
    });
  }
}

export { HTMLDOMTree };
