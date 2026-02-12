
import { SliderHeroDOMTree } from "../components/slider-hero";
import normalizeContentfulData from "../libs/content-full";
import CategoryDOMTree from "../components/category";
import { SliderBannerDOMTree } from "../components/slider-banner";
import { injectStyles, parseDOM } from "../libs/css-magi";
import { NewsDOMTree } from "../components/news";
import { VideoDOMTree } from "../components/video";
import { HTMLDOMTree } from "../components/html";
import { JsonDOMTree } from "../components/json";

new EventSource("/esbuild").addEventListener("change", () => location.reload());

export class Slider {
  constructor($element) {
    this.$element = $element;
    this.index = 0;
    this.distance = 0;
    this.isNavigating = false;
    this.limitKeepCurrent = 50;
    this.draggingOver = true;
    this.rows = this.dataset("rows", 1);
    this.gap = this.dataset("gap", 0);
    Object.entries(this.$element.dataset).forEach(([key, value]) => {
      if (isNaN(value)) {
        this[key] = value;
      } else {
        this[key] = JSON.parse(value);
      }
    });

    this.init();

    this.shouldAddActions(() => {
      this.updateIsNavigating();
      this.addPagination();
      this.addNavigation();
      this.addTouchEvents();
      this.addMouseDrag();
      this.addKeyboardEvents();
    });
  }

  dataset(key, initData) {
    return this.$element.dataset[key] || initData;
  }

  shouldAddActions(callback) {
    if (this.itemList.length > this.rows) {
      callback();
    }
  }

  loadImagesSuccess() {
    return Promise.all(
      Array.from(this.$element.querySelectorAll("img")).map(($img) => {
        return new Promise((resolve) => {
          if ($img.complete) {
            resolve($img);
          }
          $img.onload = () => {
            resolve($img);
          };
        });
      }),
    );
  }

  init() {
    this.$element.style.display = `flex`;
    this.$element.style.flexDirection = `row`;
    this.$element.style.gap = this.gap + "px";
    this.$element.style.flexWrap = `nowrap`;
    this.$element.style.overflow = `hidden`;
    this.$element.style.position = `relative`;
    this.itemList = this.$element.querySelectorAll(":scope > div");
    this.itemList.forEach(($item) => {
      const calc = `calc((100% - ${(this.rows - 1) * this.gap}px) / ${this.rows})`;
      $item.style.width = calc;
      $item.style.maxWidth = calc;
      $item.style.minWidth = calc;
      $item.style.position = `relative`;
      $item.style.touchAction = `pan-y`;
    });
  }

  updateIsNavigating() {
    this.$element.addEventListener("click", () => {
      this.isNavigating = true;
    });

    document.addEventListener("click", (e) => {
      if (this.$element.contains(e.target)) {
        return;
      }
      this.isNavigating = false;
    });
  }

  addMouseDrag() {
    this.$element.addEventListener("mousedown", (e) => {
      e.preventDefault();
      this.startX = e.clientX;
    });

    this.$element.addEventListener("mousemove", (e) => {
      if (this.startX) {
        this.endX = e.clientX;
        this.distance = this.endX - this.startX;
        this.updateView();
      }
    });

    const mouseUpHandler = (e) => {
      e.preventDefault();
      this.endX = e.clientX;
      let step = this.distance / (this.$element.offsetWidth / this.rows);

      if (step < 0) {
        step = Math.floor(step);
      } else {
        step = Math.ceil(step);
      }

      this.startX = null;
      if (this.distance > this.limitKeepCurrent) {
        this.index = this.index - step;
        this.distance = 0;
        this.updateView();
      } else if (this.distance < -this.limitKeepCurrent) {
        this.index = this.index - step;
        this.distance = 0;
        this.updateView();
      }
      this.distance = 0;
      this.updateView();
    };

    this.$element.addEventListener("mouseup", mouseUpHandler);
    this.$element.addEventListener("mouseleave", mouseUpHandler);
  }

  addTouchEvents() {
    document.addEventListener(
      "scroll",
      (e) => {
        e.preventDefault();
        e.stopPropagation();
      },
      { passive: false },
    );
    this.$element.addEventListener("touchstart", (e) => {
      this.startX = e.touches[0].clientX;
    });
    this.$element.addEventListener("touchmove", (e) => {
      if (this.startX) {
        this.endX = e.touches[0].clientX;
        this.distance = this.endX - this.startX;
        this.updateView();
      }
    });
    this.$element.addEventListener("touchend", (e) => {
      this.endX = e.changedTouches[0].clientX;
      this.deltaX = this.endX - this.startX;
      this.startX = null;
      let step = this.distance / (this.$element.offsetWidth / this.rows);

      if (step < 0) {
        step = Math.floor(step);
      } else {
        step = Math.ceil(step);
      }
      if (this.distance > this.limitKeepCurrent) {
        this.index = this.index - step;
        this.distance = 0;
        this.updateView();
      } else if (this.distance < -this.limitKeepCurrent) {
        this.index = this.index - step;
        this.distance = 0;
        this.updateView();
      }
      this.distance = 0;
      this.updateView();
    });
  }

  throttle(func, delay) {
    let lastCall = 0;
    return function (...args) {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        func.apply(this, args);
      }
    };
  }

  addNavigation() {
    const navigation = document.createElement("div");
    navigation.classList.add("slider-navigation");

    const nextButton = document.createElement("button");
    navigation.appendChild(nextButton);
    nextButton.classList.add(
      "slider-navigation-button",
      "slider-navigation-button-next",
    );

    // Events
    nextButton.addEventListener(
      "click",
      this.throttle((event) => {
        event.preventDefault();
        event.stopPropagation();
        if (this.index > this.itemList.length - this.rows - 1) {
          this.index = 0;
        } else {
          this.index++;
        }
        this.updateView(true);
      }, 600),
    );

    const prevButton = document.createElement("button");
    navigation.appendChild(prevButton);
    prevButton.classList.add(
      "slider-navigation-button",
      "slider-navigation-button-prev",
    );
    // Events
    prevButton.addEventListener(
      "click",
      this.throttle((event) => {
        event.preventDefault();
        event.stopPropagation();
        // this.index = Math.max(0, this.index - 1);
        if (this.index < 1) {
          this.index = this.itemList.length - this.rows;
        } else {
          this.index--;
        }

        this.updateView(true);
      }, 600),
    );

    this.$element.appendChild(navigation);
  }

  addKeyboardEvents() {
    document.addEventListener("keydown", (e) => {
      if (this.isNavigating === false) return;
      if (e.key === "ArrowRight") {
        this.index++;
      } else if (e.key === "ArrowLeft") {
        this.index--;
      }
      this.updateView(true);
    });
  }

  updateView(isNavigating = false) {
    this.index = Math.max(0, this.index);
    this.index = Math.min(this.index, this.itemList.length - this.rows);
    let distance = this.distance;
    this.itemList.forEach(($item, index) => {
      if (this.distance !== 0) {
        $item.style.transition = "none";
        const updateDistance = () => {
          if (this.draggingOver) {
            distance = this.distance / 6;
          } else {
            distance = 0;
          }
        };
        if (this.index === 0 && this.distance > 0) {
          updateDistance();
        }

        if (
          this.index === this.itemList.length - this.rows &&
          this.distance < 0
        ) {
          updateDistance();
        }
      } else {
        if (isNavigating) {
          $item.style.transition =
            "transform 0.8s cubic-bezier(0.42, 0, 0.58, 1)";
        } else {
          $item.style.transition =
            "transform 0.25s cubic-bezier(0.42, 0, 0.58, 1)";
        }
      }
      $item.style.transform = `translate3d(calc(${-this.index * 100}% + ${distance}px - ${this.gap * this.index}px), 0, 0)`;
    });

    this.paginationItems.forEach(($item, index) => {
      $item?.classList?.toggle(
        "slider-pagination-item-active",
        index === this.index,
      );
    });
  }

  addPagination() {
    const pagination = document.createElement("div");
    pagination.classList.add("slider-pagination");

    const paginationContent = document.createElement("div");
    paginationContent.classList.add("slider-pagination-content");

    this.paginationItems = Array.from(this.itemList).map(($item, index) => {
      if (index > this.itemList.length - this.rows) return;
      const paginationItem = document.createElement("div");
      paginationItem.classList.add("slider-pagination-item");
      paginationItem.classList.toggle(
        "slider-pagination-item-active",
        index === this.index,
      );

      paginationItem.addEventListener("click", () => {
        this.index = index;
        this.updateView(true);
      });

      paginationContent.appendChild(paginationItem);
      return paginationItem;
    });

    pagination.appendChild(paginationContent);

    this.$element.appendChild(pagination);
  }
}

class Toogle {
  constructor(element) {
    this.$element = element;
    this.registerEvent();
  }

  registerEvent() {
    const [className, classActive] = this.$element.dataset.toggle
      .split("|")
      .map((item) => item.trim());
    this.$element.addEventListener("click", () => {
      document.querySelectorAll(className).forEach(($tagget) => {
        $tagget.classList.toggle(classActive);
      });
    });
  }
}

class ContentPage {
  constructor(element) {
    this.$element = element;
    this.injectCallbacks = new Map();
    this.fetchData().then(() => {
      this.reactiveData();
    });

    this.getContent = this.getContent.bind(this);
  }

  async fetchData() {
    return new Promise(async (resolve, reject) => {
      const apiUrl =
        "https://cdn.contentful.com/spaces/kc9744crnpul/environments/master/entries?access_token=h4GdTuPTzjsGcZqNRXDcamMMfvvYbgW0AqJp1gHqPz8";
      if (window.localStorage.getItem(apiUrl) && false) {
        this.spaces = JSON.parse(window.localStorage.getItem(apiUrl));
        resolve(this.data);
      } else {
        return fetch(apiUrl)
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            this.spaces = data;
            window.localStorage.setItem(apiUrl, JSON.stringify(data));
            this.data = normalizeContentfulData(data);
            resolve(data);
          })
          .catch((error) => {
            console.error("Error:", error);
            reject(error);
          });
      }
    });
  }

  registerComponents() {
    const renderComponents = {
      /** 1. Slider Hero */
      'slider-component': (data) => {
        const $sliderHero = new SliderHeroDOMTree(data.items).render();
        return [$sliderHero];
      },
      /** 2. Category */
      'category-component': (data) => {
        const $category = new CategoryDOMTree(data).render();
        return [$category];
      },
      /** 3. Slider Banner */
      'banner-component': (data) => {
        const $sliderBanner = new SliderBannerDOMTree(data).render();
        return [$sliderBanner];
      },
      /** 4. News */
      'news-component': (data) => {
        const $news = new NewsDOMTree(data).render();
        return [$news];
      },
      /** 5. Video */
      'video-component': (data) => {
        const $video = new VideoDOMTree(data).render();
        return [$video];
      },
      /** 6. HTML */
      'html-component': (data) => {
        const $video = new HTMLDOMTree(data).render();
        return [$video];
      },
      /** 7. HTML */
      'json-component': (data) => {
        const $video = new JsonDOMTree(data).render();
        return [$video];
      }
    }
    return renderComponents;
  }

  reactiveData() {
    const blocks = this.data.page[0].blocks;
    console.log(blocks);

    const renderComponents = this.registerComponents();

    this.$element.append(...blocks.flatMap((data) => {
      const component = renderComponents[data.name];
      if (component) {
        return component(data);
      }
      return [];
    }));

    injectStyles(parseDOM(this.$element));
  }

  injectContent(callback) {
    this.injectCallbacks.set(callback);
  }

  getContent(contentTypeId) {
    return this.data[contentTypeId];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document
    .querySelectorAll('[data-component="content-page"]')
    .forEach(($element) => {
      new ContentPage($element);
    });

  // toggle
  document.querySelectorAll("[data-toggle]").forEach(($toggle) => {
    new Toogle($toggle);
  });
}); 