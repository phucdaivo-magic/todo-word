const div = ({
  name = "div",
  attrs = [],
  childs,
  callback,
  on = {},
  initState = {},
}) => {
  let $innerDiv = document.createElement(name);
  let state = { ...(initState || {}) };

  const setState = (_state) => {
    state = _state;
    update();
  };

  const create = () => {
    const _childs = state.childs || childs;
    const $div = document.createElement(name);
    Object.entries(attrs).forEach(([key, value]) => {
      if (typeof value === "string" && value.includes("{{")) {
        value = value.replace(/{{(\w+)}}/g, (match, p1) => state[p1] || match);
      }
      $div.setAttribute(key, value || "");
    });

    if (Array.isArray(_childs)) {
      [..._childs].map((child) => {
        $div.append(div(child));
      });
    } else if (typeof _childs === "object") {
      $div.append(div(_childs));
    } else if (typeof _childs === "string" || typeof _childs === "number") {
      let childString = _childs.toString();
      Object.entries(state).forEach(([key, value]) => {
        childString = childString.replace(`{{${key}}}`, value);
      });
      $div.innerHTML = childString || null;
    }

    Object.entries(on).forEach(([key, func]) => {
      $div.addEventListener(key, (event) => {
        func(event, { setState });
      });
    });

    $innerDiv.replaceWith($div);
    $innerDiv = $div;

    return (callback) => {
      callback?.($div, {
        update,
        destroy,
        setState,
      });
    };
  };

  const update = () => {
    destroy();
    create();
  };

  const destroy = () => {
    Object.entries(on).forEach(([key, func]) => {
      $innerDiv.removeEventListener(key, func);
    });
    // $innerDiv.remove();
    // $innerDiv = document.createElement(name);
  };

  // 1.[Create]
  create()(callback);

  return $innerDiv;
};

export default div;
