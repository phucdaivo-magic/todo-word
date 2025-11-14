export const Block = ({ condition, children }) => {
  return condition ? children : null;
};
