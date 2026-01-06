document.addEventListener('DOMContentLoaded', () => {
    masonry();
});

const masonry = () => {
    const $masonry = document.querySelector('.masonry');
    const $masonryItems = document.querySelectorAll('.masonry-item');
    const masonryBoundingClientRect = $masonry.getBoundingClientRect();

    const masonryRect = {
        top: masonryBoundingClientRect.top,
        left: masonryBoundingClientRect.left,
        width: masonryBoundingClientRect.width,
        height: masonryBoundingClientRect.height
    };

    const position = {
        top: 0,
        left: 0,
    };


    console.log($masonry.getBoundingClientRect());

    const { pushTop, tops } = useTop();
    let isFullBase = false;


    $masonryItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.setProperty('position', 'absolute');
            item.style.setProperty('top', `${position.top}px`);
            item.style.setProperty('left', `${position.left}px`);
            item.style.setProperty('z-index', `${index + 1}`);

            pushTop({
                top: position.top + item.offsetHeight,
                left: position.left
            });

            const rect = item.getBoundingClientRect();
            position.left = position.left + (rect.width);
            if (isFullBase) {

            } else if (position.left >= masonryRect.width) {
                isFullBase = true;
            }
        }, index * 500);
    });
};

const useTop = () => {
    const tops = [];
    const pushTop = (top) => {
        tops.push(top);
    }

    const getTop = (left) => {
        const itemTop = tops.reduce((current, acc) => {
        }, {});

        return itemTop.top;
    };

    return { pushTop, tops, getTop };
};

new EventSource('/esbuild').addEventListener('change', () => location.reload());