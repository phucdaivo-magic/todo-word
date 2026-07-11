
import { init, parseDOM, injectStyles } from '../libs/css-magi';

const uniqueClasses = parseDOM();
injectStyles(uniqueClasses);


new EventSource('/esbuild').addEventListener('change', () => {
    location.reload();
});

Array.from(document.querySelectorAll('iframe')).forEach($frame => {

    const div = document.createElement('div');
    $frame.parentElement.append(div);
    div.style.setProperty('background', '#eee');
    div.style.setProperty('position', 'absolute');
    div.style.setProperty('top', $frame.parentElement.getBoundingClientRect().top + 'px');
    div.style.setProperty('left', $frame.parentElement.getBoundingClientRect().left + 'px');
    div.style.setProperty('width', $frame.parentElement.getBoundingClientRect().width + 'px');
    div.style.setProperty('height', $frame.parentElement.getBoundingClientRect().height + 'px');
    div.textContent = 'khong xem duoc'

    div.onclick = () => {
        $frame.src = $frame.dataset.src;
        div.remove();
    }

})

