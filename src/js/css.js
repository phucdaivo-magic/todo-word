import { init, parseDOM, injectStyles } from '../libs/css-magi';

const uniqueClasses = parseDOM({});
injectStyles(uniqueClasses);


new EventSource('/esbuild').addEventListener('change', () => {
  location.reload();
});