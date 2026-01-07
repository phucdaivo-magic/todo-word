new EventSource("/esbuild").addEventListener("change", () => location.reload());


document.addEventListener("DOMContentLoaded", () => {
    const horizontalScrollings = document.querySelectorAll("[data-component='HorizontalScrolling']");
    horizontalScrollings.forEach(horizontalScrolling => {
        new HorizontalScrolling(horizontalScrolling);
    });
});


class HorizontalScrolling {
    constructor(element) {
        this.$element = element;
        this.$imageWrapper = this.$element.querySelector(".image-wrapper");
        this.$scrollContent = this.$element.querySelector(".scroll-content");

        this.isDragging = false;
        this.scrollLeft = 0;
        this.maxScrollLeft = this.$imageWrapper.offsetWidth - this.$scrollContent.clientWidth + 30;
        this.updateStyles();
        this.registerEvents();
        this.runAnimation();
    }

    runAnimation() {
        const leftStart = this.$imageWrapper.getBoundingClientRect().width - 40;
        this.$imageWrapper.style.setProperty("transform", `translateX(${-leftStart}px)`);
        this.$scrollContent.style.setProperty("--scroll-content-after-left", `${-leftStart - 10}px`);

        setTimeout(() => {
            this.$imageWrapper.style.setProperty("transition", "transform 1s ease-in-out");
            this.$scrollContent.style.setProperty("transition", "transform 1s ease-in-out");

            this.$imageWrapper.style.setProperty("transform", `translateX(${0}px)`);
            this.$scrollContent.style.setProperty("--scroll-content-after-left", `0px`);
        }, 1000);
        setTimeout(() => {
            this.$imageWrapper.style.setProperty("transition", "none");
            this.$scrollContent.style.setProperty("transition", "none");
        }, 2000);
    }

    shouldRegisterEvents(callback) {
        if (this.maxScrollLeft > 0) {
            callback();
        }
    }

    updateStyles() {
        this.$scrollContent.style.setProperty("overflow", "hidden");
        this.$scrollContent.style.setProperty("cursor", "move");
    }

    registerEvents() {
        this.addMouseDrag();
        this.onTouchDrag();
        this.onIntersecting();
    }

    onIntersecting() {
        const options = {
            root: null,
            threshold: 0,
        };

        const callback = (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    console.log('Element is in view');
                } else {
                    console.log('Element is not in view');
                }
            });
        };
        const observer = new IntersectionObserver(callback, options);
        observer.observe(this.$element);
    }

    addMouseDrag() {
        this.$element.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.startX = e.clientX;
            this.isDragging = true;
        });

        this.$element.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                this.endX = e.clientX;
                this.distance = this.endX - this.startX;
                this.updateScroll();
            }
        });

        const mouseUpHandler = (e) => {
            e.preventDefault();
            this.endX = e.clientX;
            this.scrollLeft = Math.max(Math.min(this.scrollLeft + this.distance, 0), -this.maxScrollLeft);
            this.distance = 0;
            this.updateScroll();
            this.isDragging = false;
        }

        this.$element.addEventListener('mouseup', mouseUpHandler);
        this.$element.addEventListener('mouseleave', mouseUpHandler);
    }

    onTouchDrag() {
        this.$element.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.startX = e.touches[0].clientX;
            this.isDragging = true;
        });
        this.$element.addEventListener('touchmove', (e) => {
            if (this.isDragging) {
                this.endX = e.touches[0].clientX;
                this.distance = this.endX - this.startX;
                this.updateScroll();
            }
        });
        const touchUpHandler = (e) => {
            e.preventDefault();
            this.endX = e.changedTouches[0].clientX;
            this.deltaX = this.endX - this.startX;
            this.startX = null;
            this.scrollLeft = Math.max(Math.min(this.scrollLeft + this.distance, 0), -this.maxScrollLeft);
            this.distance = 0;
            this.updateScroll();
            this.isDragging = false;
        }

        this.$element.addEventListener('touchend', touchUpHandler);
    }

    updateScroll() {
        let scrollLeft = this.scrollLeft + this.distance;
        scrollLeft = Math.min(scrollLeft, 0);
        scrollLeft = Math.max(scrollLeft, -this.maxScrollLeft);
        this.$imageWrapper.style.setProperty("transform", `translateX(${scrollLeft}px)`);
        this.$scrollContent.style.setProperty("--scroll-content-after-left", `${scrollLeft - 30}px`);
    }
}