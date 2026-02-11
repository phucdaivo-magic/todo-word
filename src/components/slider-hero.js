import div from "../libs/domtree";

class SliderHeroDOMTree {
  constructor(props = {}) {
    this.props = props;
  }

  render() {
    return div({
      callback: (element) => {
        new SliderHero(element, this.props).play(0);
      },
      attrs: {
        class: "slider-hero",
      },
      childs: [
        { attrs: { class: "slider-hero__overlay" } },
        {
          attrs: { class: "slider-hero__inner" },
          childs: [
            {
              attrs: { class: "slider-hero__left" },
              childs: [
                {
                  name: "h2",
                  attrs: {
                    "data-title": "",
                    class:
                      "animate in-view font-size:50px margin:0 @media(max-width:768px):font-size:32px color:#fff font-weight:bold",
                  },
                },
                {
                  name: "p",
                  attrs: {
                    "data-description": "",
                    class:
                      "in-view animate font-size:18px color:#fff line-height:1.8",
                  },
                },
              ],
            },
            {
              attrs: { class: "slider-hero__right" },
              childs: {
                name: "img",
                attrs: {
                  class: "width:100% is-animation",
                  src: this.props.image || "",
                  alt: "",
                  "data-image": "",
                },
              },
            },
          ],
        },
        {
          attrs: {
            "data-progress": "",
            class: "height:5px background:rgba(0,0,0,0.4)",
          },
        },
        {
          attrs: { class: "slider-hero__navigation" },
          childs: [
            {
              attrs: {
                class: "navigation-prev navigation-item",
                "data-navigation-prev": "",
              },
              childs: [
                {
                  attrs: {
                    class: "navigation-prev-inner navigation-item-inner",
                  },
                },
                {
                  attrs: {
                    class:
                      "navigation-prev-inner-overlay navigation-item-overlay",
                  },
                },
              ],
            },
            {
              attrs: {
                class: "navigation-next navigation-item",
                "data-navigation-next": "",
              },
              childs: [
                {
                  attrs: {
                    class: "navigation-prev-inner navigation-item-inner",
                  },
                },
                {
                  attrs: {
                    class:
                      "navigation-prev-inner-overlay navigation-item-overlay",
                  },
                },
              ],
            },
          ],
        },
      ],
    });
  }
}

class SliderHero {
  constructor(element, contentFields = []) {
    this.$element = element;
    this.contentFields = contentFields;
    this.init();
    this.registerEvent();
  }

  init() {
    this.listIds = this.contentFields.map((_, index) => index);
    this.index = 0;
    this.updateViewTimer = null;
    this.nextTimer = null;
    this.createTimer();
  }

  play(index) {
    this.index = index;
    this.updateView();
  }

  next() {
    this.index = this.getNextIndex(this.index);
    this.updateView();
  }

  prev() {
    this.index = this.getPrevIndex(this.index);
    this.updateView();
  }

  getNextIndex(index) {
    return this.listIds.includes(index + 1) ? index + 1 : 0;
  }

  getPrevIndex(index) {
    return this.listIds.includes(index - 1) ? index - 1 : this.listIds.at(-1);
  }

  updateView() {
    document.querySelectorAll("[data-progress]").forEach(($progress) => {
      // $progess.style.setProperty('animation', 'progress 4s ease-in-out');
      $progress.style.animation = "none";
      $progress.offsetHeight;
      $progress.style.animation = "progress 6s ease-in-out forwards";
    });
    // Update background and image
    const { background, image, heading, text } = this.contentFields[this.index];
    this.$element.style.background = background;
    this.$element
      .querySelector("[data-image]")
      .style.setProperty("opacity", "0");
    this.$element.querySelector("[data-title]").classList.remove("in-view");
    this.$element
      .querySelector("[data-description]")
      .classList.remove("in-view");

    clearTimeout(this.updateViewTimer);
    this.updateViewTimer = setTimeout(() => {
      this.$element
        .querySelector("[data-image]")
        .style.setProperty("transform", "translateX(100%)");
      this.$element.querySelector("[data-image]").src = image.fields.file.url;
      this.$element.querySelector("[data-image]").onload = setTimeout(() => {
        this.$element
          .querySelector("[data-image]")
          .style.setProperty("transform", "translateX(0)");
        this.$element
          .querySelector("[data-image]")
          .style.setProperty("opacity", "1");
        this.$element
          .querySelector("[data-image]")
          .classList.add("is-animation");

        updateBackground();
      }, 300);
    }, 300);

    // Update navigation
    const updateBackground = () => {
      const nextIndex = this.getNextIndex(this.index);
      const prevIndex = this.getPrevIndex(this.index);

      this.$element.querySelector(
        "[data-navigation-prev] .navigation-item-overlay"
      ).style.backgroundColor = this.contentFields[prevIndex].background;
      this.$element.querySelector(
        "[data-navigation-next] .navigation-item-overlay"
      ).style.backgroundColor = this.contentFields[nextIndex].background;
      // Update title and description
      this.$element.querySelector("[data-title]").textContent = heading;
      this.$element.querySelector("[data-description]").textContent = text;
      this.$element.querySelector("[data-title]").classList.add("in-view");
      this.$element
        .querySelector("[data-description]")
        .classList.add("in-view");
    };
  }

  registerEvent() {
    this.$element
      .querySelectorAll("[data-navigation-prev]")
      .forEach(($item) => {
        $item.addEventListener("click", () => {
          this.prev();
          this.createTimer();
        });

        $item.addEventListener("mouseenter", () => {
          this.$element.classList.add("is-left-hover");
        });

        $item.addEventListener("mouseleave", () => {
          this.$element.classList.remove("is-left-hover");
        });
      });

    this.$element
      .querySelectorAll("[data-navigation-next]")
      .forEach(($item) => {
        $item.addEventListener("click", () => {
          this.next();
          this.createTimer();
        });

        $item.addEventListener("mouseenter", () => {
          this.$element.classList.add("is-right-hover");
        });

        $item.addEventListener("mouseleave", () => {
          this.$element.classList.remove("is-right-hover");
        });
      });
  }

  createTimer() {
    clearInterval(this.nextTimer);
    this.nextTimer = setInterval(() => {
      this.next();
    }, 6000);
  }
}

export { SliderHeroDOMTree, SliderHero };
