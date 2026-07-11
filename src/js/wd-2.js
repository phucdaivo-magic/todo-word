import YouTubePlayer from "youtube-player";

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
        autoplay: 1,
        mute: 1,
        loop: 1,
      },
    });
  }
}


document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-video]').forEach(video => {
    new VideoPlayer(video);
  });
  document.addEventListener('click', () => {
    document.documentElement.requestFullscreen();
  })
});