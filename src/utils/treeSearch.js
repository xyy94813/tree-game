export function bfs(root, callback) {
  if (!root) {
    return;
  }
  const queue = [root];

  while (queue.length > 0) {
    const node = queue.shift();
    // do something
    callback && callback(node);
    if (node.left) {
      queue.push(node.left);
    }
    if (node.right) {
      queue.push(node.right);
    }
  }
}
