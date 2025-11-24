const id6 = () => 'v1-' + Math.random().toString(36).substring(2, 8);

const styles = {};
const PSEUDO_SELECTORS = ['hover', 'focus', 'active', 'visited', 'after', 'before'];
const cssPropertyMapping = {
    /* Margin */
    m: 'margin',
    mt: 'margin-top',
    mr: 'margin-right',
    mb: 'margin-bottom',
    ml: 'margin-left',

    /* Padding */
    p: 'padding',
    pt: 'padding-top',
    pr: 'padding-right',
    pb: 'padding-bottom',
    pl: 'padding-left',

    /* Width / Height */
    w: 'width',
    h: 'height',

    'bg': 'background',

    'bg-color': 'background-color',

    /* Position */
    z: 'z-index',

    /* Display / Flex */
    d: 'display',
    'direction': 'flex-direction'
};

const defineClasses = Array.from(document.querySelectorAll('[class]')).flatMap((element) => {
    const classList = Array.from(element.classList).filter((cls) => [':', '[', ']'].every((t) => cls.includes(t)));
    return classList;
});

const uniqueClasses = defineClasses.reduce((acc, cls) => {
    const [property, value] = cls.split(/:(.+)/);
    const cssQuery = ':[]#()/.%,\'!@'.split('').reduce((acc, cur) => acc.replaceAll(cur, '\\' + cur), cls);

    const pseudoSelector = PSEUDO_SELECTORS.find((p) => property.includes(p));
    const queryId = id6();
    if (acc[cssQuery]) {
        return acc;
    } else {
        document.querySelectorAll(`.${cssQuery}`).forEach((element) => {
            element.classList.add(`${queryId}`);
            element.classList.remove(`${cls}`);
        });

        if (pseudoSelector) {
            return {
                ...acc,
                [cssQuery]: {
                    query: [queryId, pseudoSelector].join(':'),
                    originalQuey: [cssQuery, pseudoSelector].join(':'),
                    property: cssPropertyMapping[property.replace(`${pseudoSelector}-`, '')] || property.replace(`${pseudoSelector}-`, ''),
                    value: value.replace(/[\[\]]/g, '').replace(/_/g, ' '),
                }
            };
        } else {
            return {
                ...acc,
                [cssQuery]: {
                    query: queryId,
                    originalQuery: cssQuery,
                    property: cssPropertyMapping[property] || property,
                    value: value.replace(/[\[\]]/g, '').replace(/_/g, ' '),
                }
            };
        }
    }
}, {});

console.log(uniqueClasses);


const tag = document.createElement('style');
tag.innerHTML = Object.entries(uniqueClasses).map(([cssName, { query, property, value }]) => {
    return `.${query}{${property}: ${value};}`;
}).join('')
document.body.appendChild(tag);

new EventSource("/esbuild").addEventListener("change", () => location.reload());

