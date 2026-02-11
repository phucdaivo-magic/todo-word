import div from "../libs/domtree";
import YouTubePlayer from "youtube-player";

class VideoDOMTree {
  constructor(props = {}) {
    this.props = props;
    this.videoController = null;
  }

  render() {
    return (
      div({
        name: "div",
        attrs: {
          class: "news",
        },
        childs: [
          {
            attrs: {
              class: "height:fit-content position:relative",
            },
            childs: [
              {
                name: "div",
                attrs: {
                  class: "video-player",
                },

                childs: [
                  {
                    callback: (element) => {
                      this.videoController = new VideoPlayer(element);
                    },
                    name: "div",
                    attrs: {
                      'data-ids': this.props.youtubeIds.join(','),
                    }
                  },
                  {
                    name: "div",
                    on: {
                      click: () => {
                        this.videoController.prev();
                      }
                    },
                    attrs: {
                      class: "prev",
                      'data-prev': '',
                    },
                    childs: [
                      {
                        name: "div",
                        attrs: {
                          class: "prev-overload",
                        },
                      }
                    ]
                  },
                  {
                    name: "div",
                    callback: (element) => {
                      element.addEventListener("click", () => {
                        this.videoController.next();
                      });
                    },
                    on: {
                      click: () => {
                        this.videoController.next();
                      }
                    },
                    attrs: {
                      class: "next",
                      'data-next': '',
                    },
                    childs: [
                      {
                        name: "div",
                        attrs: {
                          class: "next-overload",
                        },
                      }
                    ]
                  },
                ]
              }
            ]
          }
        ]
      })
    );
  }
};

class VideoPlayer {
  constructor(element) {
    this.$element = element;
    this.ids = element.dataset.ids.split(",");
    this.indexIds = Array.from({ length: this.ids.length }, (_, i) => i);
    this.init();
    this.play(0);
    this.registerEvent();
  }

  play(index) {
    this.player.loadVideoById({
      videoId: this.ids[index],
      startSeconds: 0,
    });
  }

  registerEvent() {
    // this.$element.closest(".news").querySelector("[data-next]").addEventListener("click", () => {
    // 	this.next();
    // });

    // this.$element.closest(".news").querySelector("[data-prev]").addEventListener("click", () => {
    // 	this.prev();
    // });

    this.player.on("stateChange", (event) => {
      if (event.data === 0) {
        this.next();
      }
    });
  }

  next() {
    this.index = this.indexIds.includes(this.index + 1) ? this.index + 1 : 0;
    this.player.loadVideoById(this.ids[this.index]);
  }

  prev() {
    this.index = this.indexIds.includes(this.index - 1)
      ? this.index - 1
      : this.indexIds.at(-1);
    this.player.loadVideoById(this.ids[this.index]);
  }

  init() {
    this.player = YouTubePlayer(this.$element, {
      autoplay: 1,
      playerVars: {
        controls: 0,
        title: 0,
        description: 0,
        keywords: 0,
        playlist: [],
        playsinline: 1,
        rel: 0,
        showinfo: 0,
        enablejsapi: 1,
        widgetid: 1,
        aoriginsup: 1,
        modestbranding: 1,
        rel: 0,
        fs: 0,
        iv_load_policy: 3,
        autoplay: 1,
        mute: 1,
        allow: "autoplay",
      },
    });
  }
}


export { VideoDOMTree, VideoPlayer };