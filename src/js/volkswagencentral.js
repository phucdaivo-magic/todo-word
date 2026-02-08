import YouTubePlayer from "youtube-player";
new EventSource("/esbuild").addEventListener("change", () => location.reload());
class Slider {
    constructor($element) {
        this.$element = $element;
        this.index = 0;
        this.distance = 0;
        this.isNavigating = false;
        this.limitKeepCurrent = 50;
        this.draggingOver = true;
        this.rows = this.dataset('rows', 1);
        this.gap = this.dataset('gap', 0);
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
        return Promise.all(Array.from(this.$element.querySelectorAll('img')).map(($img) => {
            return new Promise((resolve) => {
                if ($img.complete) {
                    resolve($img);
                }
                $img.onload = () => {
                    resolve($img);
                }
            });
        }));
    }

    init() {
        this.$element.style.display = `flex`;
        this.$element.style.flexDirection = `row`;
        this.$element.style.gap = this.gap + 'px';
        this.$element.style.flexWrap = `nowrap`;
        this.$element.style.overflow = `hidden`;
        this.$element.style.position = `relative`;
        this.itemList = this.$element.querySelectorAll(':scope > div');
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
        this.$element.addEventListener('click', () => {
            this.isNavigating = true;
        });

        document.addEventListener('click', (e) => {
            if (this.$element.contains(e.target)) {
                return;
            }
            this.isNavigating = false;
        });
    }

    addMouseDrag() {
        this.$element.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.startX = e.clientX;

        });

        this.$element.addEventListener('mousemove', (e) => {
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
        }

        this.$element.addEventListener('mouseup', mouseUpHandler);
        this.$element.addEventListener('mouseleave', mouseUpHandler);
    }

    addTouchEvents() {
        document.addEventListener('scroll', (e) => {
            e.preventDefault();
            e.stopPropagation();
        }, { passive: false });
        this.$element.addEventListener('touchstart', (e) => {
            this.startX = e.touches[0].clientX;
        });
        this.$element.addEventListener('touchmove', (e) => {
            if (this.startX) {
                this.endX = e.touches[0].clientX;
                this.distance = this.endX - this.startX;
                this.updateView();
            }
        });
        this.$element.addEventListener('touchend', (e) => {
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
        const navigation = document.createElement('div');
        navigation.classList.add('slider-navigation');

        const nextButton = document.createElement('button');
        navigation.appendChild(nextButton);
        nextButton.classList.add('slider-navigation-button', 'slider-navigation-button-next');

        // Events
        nextButton.addEventListener('click', this.throttle((event) => {
            event.preventDefault();
            event.stopPropagation();
            if (this.index > this.itemList.length - this.rows - 1) {
                this.index = 0;
            } else {
                this.index++;
            }
            this.updateView(true);
        }, 600));

        const prevButton = document.createElement('button');
        navigation.appendChild(prevButton);
        prevButton.classList.add('slider-navigation-button', 'slider-navigation-button-prev');
        // Events
        prevButton.addEventListener('click', this.throttle((event) => {
            event.preventDefault();
            event.stopPropagation();
            // this.index = Math.max(0, this.index - 1);
            if (this.index < 1) {
                this.index = this.itemList.length - this.rows;
            } else {
                this.index--;
            }

            this.updateView(true);
        }, 600));

        this.$element.appendChild(navigation);
    }

    addKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
            if (this.isNavigating === false) return;
            if (e.key === 'ArrowRight') {
                this.index++;
            } else if (e.key === 'ArrowLeft') {
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
                $item.style.transition = 'none';
                const updateDistance = () => {
                    if (this.draggingOver) {
                        distance = this.distance / 6;
                    } else {
                        distance = 0;
                    }
                }
                if (this.index === 0 && this.distance > 0) {
                    updateDistance();
                }

                if (this.index === this.itemList.length - this.rows && this.distance < 0) {
                    updateDistance();
                }
            } else {
                if (isNavigating) {
                    $item.style.transition = 'transform 0.8s cubic-bezier(0.42, 0, 0.58, 1)';
                } else {
                    $item.style.transition = 'transform 0.25s cubic-bezier(0.42, 0, 0.58, 1)';
                }

            }
            $item.style.transform = `translate3d(calc(${(-this.index) * 100}% + ${distance}px - ${(this.gap * this.index)}px), 0, 0)`;
        });

        this.paginationItems.forEach(($item, index) => {
            $item?.classList?.toggle('slider-pagination-item-active', index === this.index);
        });
    }

    addPagination() {
        const pagination = document.createElement('div');
        pagination.classList.add('slider-pagination');

        const paginationContent = document.createElement('div');
        paginationContent.classList.add('slider-pagination-content');


        this.paginationItems = Array.from(this.itemList).map(($item, index) => {
            if (index > this.itemList.length - this.rows) return;
            const paginationItem = document.createElement('div');
            paginationItem.classList.add('slider-pagination-item');
            paginationItem.classList.toggle('slider-pagination-item-active', index === this.index);

            paginationItem.addEventListener('click', () => {
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

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-component="hero-banner"]').forEach(($slider) => {
        new Slider($slider);
    });
});

class VideoPlayer {
    constructor(element) {
        this.$element = element;
        this.ids = element.dataset.ids.split(',');
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
        document.querySelector('[data-next]').addEventListener('click', () => {
            this.next();
        });

        document.querySelector('[data-prev]').addEventListener('click', () => {
            this.prev();
        });
    }

    next() {
        this.index = this.indexIds.includes(this.index + 1) ? this.index + 1 : 0;
        this.player.loadVideoById(this.ids[this.index]);
    }

    prev() {
        this.index = this.indexIds.includes(this.index - 1) ? this.index - 1 : this.indexIds.at(-1);
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
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-component="video-player"]').forEach(($videoPlayer) => {
        new VideoPlayer($videoPlayer);
    });
});