import randomInteger from "./randomInteger";

/**
 * 生成随机奇数
 * 待优化
 * @param {*} min
 * @param {*} max
 */
const randomOdd = (min, max) => {
  const rand = randomInteger(min, max);

  if (rand % 2 === 0) {
    return Math.max(rand - 1, min);
  }

  return rand;
};

export default randomOdd;
