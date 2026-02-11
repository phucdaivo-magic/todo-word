import { Slider } from "../js/volkswagencentral";
import div from "../libs/domtree";

class CategoryDOMTree {
  constructor(props = {}) {
    this.props = props;
  }

  render() {
    return div({
      name: "div",
      attrs: {
        class: "padding:20px max-width:1280px margin:auto",
      },
      childs: [
        {
          name: "div",
          childs: [
            {
              name: "div",
              attrs: {
                class: "font-size:30px text-align:center color:--color-primary",
              },
              childs: this.props.heading,
            },
          ],
        },
        {
          callback: (element) => {
            new Slider(element);
          },
          attrs: {
            class: "padding:0_80px_50px_80px dom-tree slider-component",
            "data-rows": "3",
            "data-gap": "60",
          },
          childs: this.props.products.map((item) => {
            return {
              childs: [
                {
                  name: "img",
                  attrs: {
                    src: item.image,
                    class: "width:100%",
                  },
                },
                {
                  name: "div",
                  attrs: {
                    class: "text-align:center font-size:16px",
                  },
                  childs: item.title,
                },
              ],
            };
          }),
        },
      ],
    });
  }
}

export default CategoryDOMTree;
