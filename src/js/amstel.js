new EventSource("/esbuild").addEventListener("change", () => location.reload());

class Slider {
    constructor($element) {
        this.$element = $element;
        this.index = 0;
        this.distance = 0;
        this.init();
        this.addNavigation();
        this.addTouchEvents();
        this.addMouseDrag();
        this.addKeyboardEvents();

    }

    init() {
        this.$element.style.display = `flex`;
        this.$element.style.flexDirection = `row`;
        this.$element.style.flexWrap = `nowrap`;
        this.$element.style.overflow = `hidden`;
        this.$element.style.position = `relative`;
        this.itemList = this.$element.querySelectorAll(':scope > div');
        this.itemList.forEach(($item) => {
            $item.style.width = `100%`
            $item.style.maxWidth = `100%`
            $item.style.minWidth = `100%`
            $item.style.position = `relative`

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
            this.index++;
            this.index = Math.min(this.index, this.itemList.length - 1);
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
            this.index = Math.max(0, this.index-1);
            
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
        this.index = Math.min(this.index, this.itemList.length - 1);
        this.itemList.forEach(($item, index) => {
            if (this.distance !== 0) {
                $item.style.transition = 'none';
                if (this.index === 0 && this.distance > 100) {
                    this.distance = 100;
                }
                if (this.index === this.itemList.length - 1 && this.distance < -100) {
                    this.distance = -100;
                }
            } else {
                if (isNavigating) {
                    $item.style.transition = 'transform 0.8s cubic-bezier(0.42, 0, 0.58, 1)';
                } else {
                    $item.style.transition = 'transform 0.25s cubic-bezier(0.42, 0, 0.58, 1)';
                }
            }
            $item.style.transform = `translate3d(calc(${(-this.index) * 100}% + ${this.distance}px), 0, 0)`;
        });
    }

}

document.addEventListener('DOMContentLoaded', () => {
    new Slider(document.querySelector('[data-component="slider"]'));
});