import { Slider } from "../js/volkswagencentral";
import div from "../libs/domtree";
class SliderBannerDOMTree {
  constructor(props = {}) {
    this.props = props;
  }

  render() {
    return (
      div({
        name: 'div',
        attrs: {
          class: 'padding:20px max-width:1280px margin:auto',
        },
        childs: [
          {
            name: 'h3',
            attrs: {
              class: 'font-size:30px color:--color-primary text-align:center',
            },
            childs: 'Slider Banner',
          },
          {
            name: 'div',
            attrs: {
              class: 'slider-banner slider-component',
              'data-component': 'hero-banner',
            },
            callback: (element) => {
              new Slider(element);
            },
            childs: [...this.props.images.map((image) => {
              return {
                childs: [{
                  name: 'img',
                  attrs: {
                    src: image.fields.file.url,
                    class: 'width:100%',
                  },
                }]
              }
            })],
          }
        ]
      })
    );
  };
}


export { SliderBannerDOMTree };