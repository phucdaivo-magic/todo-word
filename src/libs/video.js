import YouTubePlayer from "youtube-player";
export default class VideoSliderBlock {
    constructor(options) {
        const _default = {
            component: '[data-component="VideoSliderBlock"]',
        };
        this.options = { ..._default, ...options };
        this.$component = document.querySelectorAll(this.options.component);
    }

    init() {
        this.$component.forEach((component) => {
            const player = new PlayerComponent(component);
            player.initialize();
            player.playVideo(0);
        });
    }
}

const STATE = {
    ENDED: 0,
    PLAYING: 1,
    PAUSED: 2,
    UNSTARTED: 3,
}
class PlayerComponent {
    constructor(element) {
        // DOM
        this.element = element;
        this.$player = this.element.querySelector('[data-selector="player"]');
        this.$videoOverlay = this.element.querySelector('[data-selector="video-overlay"]');
        this.$navigationButtons = this.element.querySelector('[data-selector="navigation-buttons"]');

        // Media Query
        this.mediaQuery = window.matchMedia('(min-width: 1024px)');

        // Data
        this.ids = this.getVideoIds(element);
        this.index = 0;
        this.player = null;
        this.playlistPlaylist = Array.from({ length: this.ids.length }).map((_, index) => index);

        // Bind events
        this.onNext = this.onNext.bind(this);
        this.onPause = this.onPause.bind(this);
        this.onPlay = this.onPlay.bind(this);

        this.onResizeMediaQuery();
    }

    getVideoIds(element) {
        const videos = (element?.dataset?.videos?.split(',') || []).map((url) => url.split('/').pop());
        return videos;
    }

    initialize() {
        if (this.mediaQuery.matches) {
            this.initializeNavigationButtons();
            this.initializeYouTubePlayer();
            this.registerEvent();
        }
    }

    registerEvent() {
        this.player.on('stateChange', (event) => {
            ({
                [STATE.PLAYING]: this.onPlay,
                [STATE.ENDED]: this.onNext,
                [STATE.PAUSED]: this.onPause,
            })[event?.data]?.(event);
        });
    }

    onPause() {
        this.updateProgressStyle([this.index], ($progress) => $progress.style.animation = '');
    }

    onNext() {
        this.index = this.playlistPlaylist.includes(this.index + 1) ? this.index + 1 : this.playlistPlaylist[0];
        this.playVideo(this.index);
    }

    onPlay(event = {}) {
        this.$videoOverlay.style.opacity = '0';
        const { currentTime, duration } = event?.target?.playerInfo;
        if (duration) {
            this.updateProgressStyle([this.index], ($progress) => {
                $progress.style.animation = `navigation-button-progress-animation ${duration}s linear`;
                $progress.style.animationDelay = `-${currentTime}s`;
                $progress.style.animationPlayState = 'running';
            });
        }
    }

    onResizeMediaQuery() {
        this.mediaQuery.addEventListener('change', (event) => {
            if (event.matches === true) {
                this.initialize();
            } else {
                this.destroy();
            }
        });
    }

    updateProgressStyle(indexList, callback) {
        const selecter = indexList.map((index) => `[data-selector-navigation-button-progress="${index}"]`).join(',');
        const $progress = this.element.querySelectorAll(selecter);
        Array.from($progress).forEach(($progress) => {
            callback($progress);
        });
    }

    renderNavigationButton(_, index) {
        const $barItem = this.renderElement({
            className: 'navigation-button',
            attributes: {
                'data-selector-navigation-button': index,
            },
            events: {
                click: () => {
                    this.playVideo(index);
                },
            },
            children: [
                this.renderElement({
                    className: 'navigation-button-progress',
                    attributes: {
                        'data-selector-navigation-button-progress': index,
                    },
                }),
            ],
        });
        return $barItem;
    }

    initializeNavigationButtons() {
        this.$navigationButtons.innerHTML = '';
        this.$navigationButtons.append(...this.ids.map(this.renderNavigationButton.bind(this)));
    }

    initializeYouTubePlayer() {
        this.player = YouTubePlayer(this.$player, {
            autoplay: 1,
            playerVars: {
                controls: 0,
                title: 0,
                description: 0,
                keywords: 0,
                playlist: this.ids.join(','),
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
                allow: 'autoplay',
            },
        });
    }

    playVideo(index) {
        this.resetProgress();
        this.index = index;
        this.$videoOverlay.style.opacity = '1';
        this.player.loadVideoById({
            videoId: this.ids[index],
            startSeconds: 0,
        });
    }

    resetProgress() {
        this.updateProgressStyle(this.playlistPlaylist, ($progress) => $progress.style.animation = '');
    }

    renderElement({ className = '', attributes = {}, children = [], events = {} }) {
        const $div = document.createElement('div');
        $div.classList.add(className);

        Object.entries(attributes).forEach(([key, value]) => {
            $div.setAttribute(key, value);
        });
        Object.entries(events).forEach(([key, value]) => {
            $div.addEventListener(key, value);
        });
        children.forEach((child) => {
            $div.appendChild(child);
        });

        return $div;
    }

    destroy() {
        this.resetProgress();
        this.player.destroy();
        this.$videoOverlay.style.opacity = '1';
        this.$navigationButtons.innerHTML = '';
        this.index = 0;
    }
}