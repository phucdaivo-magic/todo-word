import div from "../libs/domtree";

class NewsDOMTree {
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
          attrs: {
            class: "font-size:30px text-align:center color:--color-primary padding:40px",
          },
          childs: "News"
        },
        {
          name: "div",
          attrs: {
            class: 'display:flex flex-direction:row gap:40px flex-wrap:wrap'
          },
          childs: [...this.props.items.map((item) => {
            return {
              name: "div",
              attrs: {
                class: "--w:100% @media(min-width:768px):--w:calc(100%_/_2_-_40px) @media(min-width:1024px):--w:calc(100%_/_3_-_40px) width:--w min-width:--w max-width:--w",
              },
              childs: [
                {
                  name: "img",
                  attrs: {
                    src: item.image.fields.file.url,
                    class: "width:100%",
                  },
                },
                {
                  name: "h3",
                  attrs: {
                    class: "color:--color-primary",
                  },
                  childs: item.heading,
                },
                {
                  name: "p",
                  attrs: {
                    class: "line-height:1.6",
                  },
                  childs: item.description,
                },
                {
                  name: "a",
                  attrs: {
                    href: item.link,
                    class: "color:--color-primary font-size:14px font-weight:bold",
                  },
                  childs: "Read more",
                }
              ]
            };
          })]
        }
      ]
    });
  }
};

export { NewsDOMTree };