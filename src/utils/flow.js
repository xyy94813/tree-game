/**
 * do something like lodash flow
 * @param {function} fn0
 * @param  {...function} fns
 */
const flow = (fn0, ...fns) => {
  if (!fn0) {
    return;
  }

  return fns.reduce(
    (lastFn, fn) => (arg0, ...args) => fn(lastFn(arg0, ...args), ...args),
    fn0
  );
};

export default flow;
