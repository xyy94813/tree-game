/**
 * 随机生成一个整数 n
 * min <= n <= max
 * @param {int} min
 * @param {int} max
 */
const randomInterger = (
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER
) => {
  return Math.round(Math.random() * (max - min)) + min;
};

export default randomInterger;
