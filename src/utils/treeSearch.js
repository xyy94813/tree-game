/**
 * breadth-first search binary tree
 *
 * pass a campare function,
 *
 * return the `BinaryTreeNode` instance, if comparator return a truthy value.
 * else return `null`
 *
 * @param {BinaryTreeNode} root required
 * @param {function} comparator required
 */
export function bfs(root, comparator) {
  if (!root) {
    return null;
  }
  const queue = [root];

  while (queue.length > 0) {
    const node = queue.shift();
    // do something
    if (comparator(node)) {
      return node;
    }
    if (node.left) {
      queue.push(node.left);
    }
    if (node.right) {
      queue.push(node.right);
    }
  }

  return null;
}
