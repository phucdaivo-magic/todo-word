import { parseDOM, injectStyles } from 'css-magi';
import useScroll from '../services/useScroll';
injectStyles(parseDOM({
    mode: 'production'
}));

new EventSource('/esbuild').addEventListener('change', () => {
    location.reload();
});

const collection = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const { addAction } = useScroll({ maxIndex: 10, throttleTime: 100 });
const scrollElements = document.querySelectorAll('[data-event="scroll"]');
const getCssClass = (index) => `scroll-${index}`

addAction((index) => {
    const cssClassInner = collection.filter(item => item <= index).map(getCssClass);
    const cssClassOuter = collection.filter(item => item > index).map(getCssClass);

    scrollElements.forEach((element) => {
        element.classList.remove(...cssClassOuter);
        element.classList.add(...cssClassInner);
    });
});