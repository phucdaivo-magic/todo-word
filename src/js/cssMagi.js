import { init, parseDOM, injectStyles } from "css-magi";
const uniqueClasses = parseDOM({
    mode: 'development'
});
injectStyles(uniqueClasses);

// Reload page when css-magi changes
new EventSource("/esbuild").addEventListener("change", () => location.reload());

/**
 * Event scroll
 */
class EventScroll {
    constructor({ element }) {
        this.element = element;
        this.scrollElements = document.querySelectorAll('[data-event="scroll"]');
        this.index = 0;

        this.options = {
            maxIndex: 10,
            minIndex: 0,
        }
        this.handleScroll = this.handleScroll.bind(this);
        this.init();
    }

    /**
     * Initialize event scroll
     */
    init() {
        this.updateClasses();
        this.element.addEventListener('wheel', this.handleScroll);
    }

    /**
     * Handle scroll event
     */
    handleScroll(event) {
        const { maxIndex, minIndex } = this.options;
        const { index } = this;

        if (event.deltaY > 0) {
            this.index = Math.min(index + 1, maxIndex);
        } else {
            this.index = Math.max(index - 1, minIndex);
        }

        this.updateClasses();
    }

    /**
     * Update class of scroll elements
     */
    updateClasses() {
        const { index } = this;
        const { maxIndex } = this.options;
        const getCssClass = (number) => `scroll-${number}`;

        this.scrollElements.forEach(element => {
            const classInner = Array.from({ length: maxIndex }, (_, i) => i);
            element.classList.remove(...classInner.filter(item => item > index).map(getCssClass));
            element.classList.add(...classInner.filter(item => item <= index).map(getCssClass));
        });
    }
}

/**
 * Initialize event scroll
 */
document.querySelectorAll('body').forEach(element => {
    new EventScroll({
        element
    });
});