import BidirectionalBinaryTreeNode from '../common/BidirectionalBinaryTreeNode';
import { bfs } from './treeSearch';
import randomInteger from './randomInteger';

/**
 * 生成 n 个以内的节点且随机结构的二叉树
 * 参考：
 * http://www.cs.otago.ac.nz/staffpriv/mike/Papers/RandomGeneration/RandomBinaryTrees.pdf
 */
const generateNBinaryTree = (n, startVal = 1) => {
  if (n < 1) {
    return null;
  }

  const root = new BidirectionalBinaryTreeNode(startVal);

  if (n === 1) {
    return root;
  }

  const childCount = n - 1;
  const leftCount = randomInteger(0, childCount);
  const rightCount = childCount - leftCount;

  if (leftCount !== 0) {
    root.left = generateNBinaryTree(leftCount, startVal + 1);
    root.left.parent = root; // 双向二叉树便于后续计算
  }

  if (rightCount !== 0) {
    root.right = generateNBinaryTree(rightCount, startVal + leftCount + 1);
    root.right.parent = root; // 双向二叉树便于后续计算
  }

  return root;
};

export default (n) => {
  /**
   * 广度优先遍历将树的值改为以下格式
   *
   *    1
   *  2   3
   * 4 5 6 7
   *
   */
  const root = generateNBinaryTree(n);
  let curVal = 1;
  bfs(root, (node) => {
    node.val = curVal;
    curVal++;
  });

  return root;
};
