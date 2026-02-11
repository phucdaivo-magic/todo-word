const div = ({ name = "div", attrs = [], childs, callback, on = {} }) => {
  const $div = document.createElement(name);
  Object.entries(attrs).forEach(([key, value]) => {
    $div.setAttribute(key, value || "");
  });

  if (Array.isArray(childs)) {
    [...childs].map((child) => {
      $div.append(div(child));
    });
  } else if (typeof childs !== "object") {
    $div.innerHTML = childs || null;
  } else {
    $div.append(div(childs));
  }
  callback?.($div);
  Object.entries(on).forEach(([key, func]) => {
    $div.addEventListener(key, func);
  });
  return $div;
};

export default div;
