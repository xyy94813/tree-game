import randomInteger from "./randomInteger";

const swapArr = (arr, i, j) => {
  const tmp = arr[i];
  arr[j] = arr[i];
  arr[i] = tmp;
};

/**
 * 生成随机顺序的 1-n 数组
 *
 * n = 3
 *
 * [2,3,1]
 * or [1,2,3]
 * or [3,2,1]
 * or...
 *
 * @param {int} n
 */
const randomNLengthArr = (n) => {
  const result = [];
  if (n < 1) {
    return result;
  }
  for (let i = 1; i <= n; ++i) {
    result.push(i);
  }

  //   result.sort(() => Math.random() - Math.random())
  // 洗牌
  for (let i = 0; i < n; ++i) {
    swapArr(result, i, randomInteger(0, n));
  }

  return result;
};

export default randomNLengthArr;
