// import BinaryTreeNode from "../common/BinaryTreeNode";
import BidirectionalBinaryTreeNode from "../common/BidirectionalBinaryTreeNode";
/**
 * 生成 n 个以内的节点且随机结构的二叉树
 * 该实现实现概率不稳定。
 *
 * => 满足题意但是不合理，看进度改进
 */
const generateNBinaryTree = (n) => {
  if (n < 1) {
    return null;
  }

  let counter = 0;
  const root = new BidirectionalBinaryTreeNode(++counter);

  const queue = [root];

  while (queue.length > 0) {
    const node = queue.shift();
    if (counter >= n) {
      continue;
    }

    const rand = Math.random();

    if (counter < n && rand > 0.25) {
      node.left = new BidirectionalBinaryTreeNode(++counter, null, null, node);
      queue.push(node.left);
    }

    if (counter < n && rand < 0.75) {
      node.right = new BidirectionalBinaryTreeNode(++counter, null, null, node);
      queue.push(node.right);
    }
  }

  //   const core = (root) => {
  //     if (counter >= n || Math.random() < 0.01) {
  //       return root;
  //     }

  //     const rand = Math.random();

  //     if (rand > 0.3) {
  //       root.left = new BinaryTreeNode(++counter);
  //     }

  //     if (rand < 0.6) {
  //       root.rightr = new BinaryTreeNode(++counter);
  //     }
  //   };

  return root;
};

export default generateNBinaryTree;
