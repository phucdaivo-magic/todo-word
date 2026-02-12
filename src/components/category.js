import { Slider } from "../js/volkswagencentral";
import div from "../libs/domtree";

class CategoryDOMTree {
  constructor(props = {}) {
    this.props = props;
    this.updateRows();
  }

  updateRows() {
    this.rows = 1;
    const medias = {
      2: window.matchMedia("(min-width: 768px)"),
      3: window.matchMedia("(min-width: 1024px)"),
      4: window.matchMedia("(min-width: 1920px)"),
    };

    Object.entries(medias).forEach(([row, { matches }]) => {
      if (matches) {
        console.log(row);

        this.rows = row;
      }
    });
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
          attrs: {
            class:
              "padding:20px font-size:30px text-align:center color:--color-primary",
          },
        },
        {
          attrs: {
            class:
              "display:flex flex-direction:row gap:50px font-size:16px width:fit-content max-width:100% overflow:auto margin:auto padding-bottom:30px",
          },
          childs: [
            ...this.props.tabs.map((tab) => ({
              childs: tab,
              attrs: { class: "padding:10px_0 cursor:pointer" },
            })),
          ],
        },
        {
          callback: (element) => {
            new Slider(element);
          },
          attrs: {
            class: "padding:0_80px_50px_80px dom-tree slider-component",
            "data-rows": this.rows,
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
