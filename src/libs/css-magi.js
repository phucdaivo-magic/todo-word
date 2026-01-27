export const id6 = () => 'v1-' + Math.random().toString(36).substring(2, 8);


export const PSEUDO_SELECTORS = [
  'hover', 'focus', 'active', 'visited', 'after', 'before',
  'first', 'last', 'nth-child', 'nth-last-child', 'nth-of-type', 'nth-last-of-type',
  'only-child', 'only-of-type', 'empty', 'target', 'checked', 'disabled', 'enabled',
  'required', 'optional', 'valid', 'invalid', 'in-range', 'out-of-range',
  'read-only', 'read-write', 'placeholder-shown', 'autofill', 'user-invalid',
  'user-valid', 'blank', 'valid', 'invalid', 'in-range', 'out-of-range',
  'read-only', 'read-write', 'placeholder-shown', 'autofill', 'user-invalid',
];

export const cssPropertyMapping = {
  m: 'margin',
  mt: 'margin-top',
  mr: 'margin-right',
  mb: 'margin-bottom',
  ml: 'margin-left',

  p: 'padding',
  pt: 'padding-top',
  pr: 'padding-right',
  pb: 'padding-bottom',
  pl: 'padding-left',

  w: 'width',
  h: 'height',

  bg: 'background',
  "bg-color": "background-color",

  z: 'z-index',

  d: 'display',
  direction: 'flex-direction'
};

export const DEFAULT_MEDIA_QUERY = {
  sm: '@media(min-width:640px)',
  md: '@media(min-width:768px)',
  lg: '@media(min-width:1024px)',
  xl: '@media(min-width:1280px)',
  xxl: '@media(min-width:1536px)',
};

export function parseDOM(configs = {
  mode: 'development',
  mediaQuery: DEFAULT_MEDIA_QUERY
}) {
  if (typeof document === "undefined") {
    console.warn("parseDOM() only works in the browser environment.");
    return {};
  }

  const defineClasses = Array.from(document.querySelectorAll("[class]"))
    .flatMap(el => Array.from(el.classList).filter(cls => cls.includes(":")));

  const uniqueClasses = useUniqueClass({ classList: defineClasses, configs: configs });

  return uniqueClasses;
}

export function parseFile(classFromCodes, configs = {
  mode: 'development',
  mediaQuery: DEFAULT_MEDIA_QUERY
}) {
  const defineClasses = Array.from(classFromCodes).filter(cls => cls.includes(":"));
  const uniqueClasses = useUniqueClass({ classList: defineClasses, configs: configs });

  return uniqueClasses;
}

const useUniqueClass = ({
  classList,
  configs = {
    mode: 'development',
    mediaQuery: DEFAULT_MEDIA_QUERY
  }
}) => {
  let id = 0;
  return classList.reduce((acc, cls) => {
    id++;
    try {
      const { className: classExcludedMedia, media } = useMediaQuery(cls, configs?.mediaQuery || DEFAULT_MEDIA_QUERY);
      const { className: classExcludedPseudo, pseudoSelector } = usePseudoSelector(classExcludedMedia, configs);
      const { value, property, cssQuery } = useClassString(classExcludedPseudo, cls);
      const queryId = 'v1-' + id.toString();

      if (acc[cssQuery]) return acc;

      if (configs.mode === 'production') {
        // document.querySelectorAll(`.${cssQuery}`).forEach(el => {
        //   el.classList.add(queryId);
        //   el.classList.remove(cls);
        // });
      }

      if (pseudoSelector) {
        acc[cssQuery] = {
          media: media,
          query: [(configs.mode === 'production' ? queryId : cssQuery), pseudoSelector].join(':'),
          property: cssPropertyMapping[property] || property,
          value: value.replace(/[\[\]]/g, "").replace(/_/g, " ")
        };
      } else {
        acc[cssQuery] = {
          media: media,
          query: configs.mode === 'production' ? queryId : cssQuery,
          property: cssPropertyMapping[property] || property,
          value: value.replace(/[\[\]]/g, "").replace(/_/g, " ")
        };
      }
    } catch (error) {
      console.error(error);
    }

    return acc;
  }, {});
}


const useMediaQuery = (_className, mediaQuery) => {
  let className = _className;
  Object.entries(mediaQuery).forEach(([key, value]) => {
    className = className.replace(`${key}:`, value + ':');
  });

  const result = {
    media: null,
    className: className,
  };

  const match = className.match(/@media\([^)]*\)/);
  if (match) {
    result.media = match[0];
    result.className = className.replace(`${match[0]}:`, '');
  }
  return result;

}

const usePseudoSelector = (className, configs) => {
  const result = {
    pseudoSelector: null,
    className: className,
  };

  const pseudoSelector = [
    ...PSEUDO_SELECTORS,
    ...configs?.pseudoSelectors || []
  ].find(p => className.includes(p + ':'));

  if (pseudoSelector) {
    result.pseudoSelector = pseudoSelector;
    result.className = className.replace(`${pseudoSelector}:`, '');
  }
  return result;
}

const useClassString = (className, clsOriginal) => {
  const [classString, value] = className.split(/:(.+)/); // scroll-1.background:[red] => scroll-1.background, [red]
  const classList = classString.split('.'); // [scroll-1, background]
  const property = classList.pop(); // background
  const cssQuery = [...classList, clsOriginal.replace(/[^a-zA-Z0-9_-]/g, (char) => '\\' + char)].join('.');

  return {
    value,
    property,
    cssQuery,
    queryId: id6(),
  };
}

export function injectStyles(uniqueClasses) {
  if (typeof document === "undefined") return;

  const tag = document.createElement("style");
  tag.innerHTML = Object.entries(uniqueClasses)
    .map(([_, { media, query, property, value }]) =>
      media ? `${media}{.${query}{${property}:${value};}}` : `.${query}{${property}:${value};}`
    )
    .join("");

  document.body.appendChild(tag);
}

export function init() {
  const uniqueClasses = parseDOM();
  injectStyles(uniqueClasses);
}