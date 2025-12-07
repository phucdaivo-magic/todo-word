new EventSource("/esbuild").addEventListener("change", () => location.reload());

class Slider {
    constructor($element) {
        this.$element = $element;
        this.index = 0;
        this.distance = 0;
        this.rows = 1;
        this.gap = 0;
        this.init();
        this.shouldAddActions(() => {
            this.addPagination();
            this.addNavigation();
            this.addTouchEvents();
            this.addMouseDrag();
            this.addKeyboardEvents();
        });
    }

    shouldAddActions(callback) {
        if (this.itemList.length > this.rows) {
            callback();
        }
    }

    loadImagesSuccess() {
        return new Promise((resolve) => {
            this.$element.querySelectorAll('img').forEach(($img) => {
                if ($img.complete) {
                    resolve();
                }
                $img.onload = () => {
                    resolve();
                }
            });
        });
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

        this.loadImagesSuccess().then(() => {
            this.$element.style.height = this.$element.getBoundingClientRect().height + 'px';
        });
    }

    addTouchEvents() {
        this.$element.addEventListener('touchstart', (e) => {
            console.log(e)
            this.startX = e.touches[0].clientX;
        });
        this.$element.addEventListener('touchmove', (e) => {
            this.endX = e.touches[0].clientX;
        });
        this.$element.addEventListener('touchend', (e) => {
            this.endX = e.touches[0].clientX;
            this.deltaX = this.endX - this.startX;
            if (this.deltaX > 100) {
                this.index++;
            }
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

        this.$element.addEventListener('mouseup', (e) => {
            e.preventDefault();
            this.endX = e.clientX;
            this.startX = null;
            if (this.distance > 100) {
                this.index--;
                this.distance = 0;
                this.updateView();
            } else if (this.distance < -100) {
                this.index++;
                this.distance = 0;
                this.updateView();
            }
            this.distance = 0;
            this.updateView();

        });

        this.$element.addEventListener('mouseleave', (e) => {
            e.preventDefault();
            this.endX = e.clientX;
            this.startX = null;
            this.distance = 0;
            this.updateView();
        });
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
            if (this.distance > 100) {
                this.index--;
                this.distance = 0;
                this.updateView();
            } else if (this.distance < -100) {
                this.index++;
                this.distance = 0;
                this.updateView();
            }
            this.distance = 0;
            this.updateView();

        });
    }

    addNavigation() {
        const nextButton = document.createElement('button');
        nextButton.innerHTML = 'Next';
        nextButton.style.position = 'absolute';
        nextButton.style.top = '50%';
        nextButton.style.right = '0';
        nextButton.style.transform = 'translateY(-50%)';
        nextButton.style.zIndex = '1000';
        nextButton.style.backgroundColor = 'white';
        nextButton.style.border = 'none';
        nextButton.style.padding = '10px';
        nextButton.style.cursor = 'pointer';
        this.$element.appendChild(nextButton);

        // Events
        nextButton.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            // this.index = Math.min(this.index, this.itemList.length - 1);
            if (this.index > this.itemList.length - this.rows - 1) {
                this.index = 0;
            } else {
                this.index++;
            }
            this.updateView(true);
        });

        const prevButton = document.createElement('button');
        prevButton.innerHTML = 'Prev';
        prevButton.style.position = 'absolute';
        prevButton.style.top = '50%';
        prevButton.style.left = '0';
        prevButton.style.transform = 'translateY(-50%)';
        prevButton.style.zIndex = '1000';
        prevButton.style.backgroundColor = 'white';
        prevButton.style.border = 'none';
        prevButton.style.padding = '10px';
        prevButton.style.cursor = 'pointer';
        this.$element.appendChild(prevButton);

        // Events
        prevButton.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            // this.index = Math.max(0, this.index - 1);
            if (this.index < 1) {
                this.index = this.itemList.length - this.rows;
            } else {
                this.index--;
            }

            this.updateView(true);
        });
    }

    addKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') {
                this.index++;
            } else if (e.key === 'ArrowLeft') {
                this.index--;
            }
            this.updateView(true);
        });
    }

    debounce(func, delay) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    updateView(isNavigating = false) {
        this.index = Math.max(0, this.index);
        this.index = Math.min(this.index, this.itemList.length - this.rows);
        let distance = this.distance;
        this.itemList.forEach(($item, index) => {
            if (this.distance !== 0) {
                $item.style.transition = 'none';
                if (this.index === 0 && this.distance > 0) {
                    distance = this.distance / 6;
                }
                if (this.index === this.itemList.length - this.rows && this.distance < 0) {
                    distance = this.distance / 6;
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
            $item.style.backgroundColor = this.index === index ? '#D6001C' : '#C8C9C7';
            $item.style.scale = index === this.index ? '1' : '0.6';
        });
    }

    addPagination() {
        const pagination = document.createElement('div');
        pagination.classList.add('slider-pagination');
        pagination.style.position = 'absolute';
        pagination.style.bottom = '0';
        pagination.style.left = '0';
        pagination.style.width = '100%';

        const paginationContent = document.createElement('div');
        paginationContent.classList.add('slider-pagination-content');
        paginationContent.style.position = 'relative';
        paginationContent.style.bottom = '0';
        paginationContent.style.left = '0';
        paginationContent.style.height = '20px';
        paginationContent.style.width = 'fit-content';
        paginationContent.style.backgroundColor = '#fff';
        paginationContent.style.borderRadius = '16px';
        paginationContent.style.display = 'flex';
        paginationContent.style.flexDirection = 'row';
        paginationContent.style.alignItems = 'center';
        paginationContent.style.justifyContent = 'center';
        paginationContent.style.gap = '5px';
        paginationContent.style.padding = '12px';
        paginationContent.style.boxSizing = 'border-box';
        paginationContent.style.margin = '5px auto';

        this.paginationItems = Array.from(this.itemList).map(($item, index) => {
            if (index > this.itemList.length - this.rows) return;
            const paginationItem = document.createElement('div');
            paginationItem.style.width = '8px';
            paginationItem.style.height = '8px';
            paginationItem.style.backgroundColor = index === this.index ? '#D6001C' : '#C8C9C7';
            paginationItem.style.transition = 'background-color 0.25s cubic-bezier(0.42, 0, 0.58, 1)';
            paginationItem.style.scale = index === this.index ? '1' : '0.6';
            paginationItem.style.borderRadius = '10px';
            paginationItem.style.display = 'flex';
            paginationItem.style.flexDirection = 'row';
            paginationItem.classList.add('slider-pagination-item');

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
    document.querySelectorAll('[data-component="slider"]').forEach(($slider) => {
        new Slider($slider);
    });
});