const throttle = (func, limit) => {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

const useScroll = (config = {}) => {
    let index = config.initialIndex || 0;
    const throttleTime = config.throttleTime || 500;
    const scrollEvent = config.scrollEvent || 'wheel';
    const minIndex = config.minIndex || 0;
    const maxIndex = config.maxIndex || 10;
    const actions = [];

    const addAction = (action) => {
        actions.push(action);
    }

    const onScroll = throttle((event) => {
        if (event.deltaY > 0) {
            index = Math.min(index + 1, maxIndex);
        } else {
            index = Math.max(index - 1, minIndex);
        }
        actions.forEach(action => action(index, event));
    }, throttleTime);

    window.addEventListener(scrollEvent, onScroll);

    return {
        addAction
    }
}

export default useScroll;