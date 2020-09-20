/**
 * 随机生成一个整数 n
 * min <= n <= max
 * @param {int} min
 * @param {int} max
 */
const randomInteger = (
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER
) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

export default randomInteger;
