import { bfs } from "../../utils/treeSearch";

/**
 * 找出最可能胜利的节点
 * 0 父节点
 * -1 左节点
 * 1 右节点
 *
 * @param {*} root 根节点
 * @param {int} n 二叉树的总节点数
 * @param {BinaryTreeNode} x player1 选择的第一个节点
 */
const btreeGameWinningMove = (root, n, x) => {
  let leftNum = 0;
  let rightNum = 0;

  bfs(x.left, () => {
    leftNum++;
  });
  bfs(x.right, () => {
    rightNum++;
  });

  const parentNum = n - leftNum - rightNum - 1;

  if (leftNum > parentNum && leftNum > rightNum) {
    return -1;
  }

  if (rightNum > parentNum && rightNum > leftNum) {
    return 1;
  }

  return 0;
};

export default btreeGameWinningMove;
