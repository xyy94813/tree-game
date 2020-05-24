/**
 * 节点是否允许被玩家选择
 * @param {*} node
 * @param {*} firstPlayer 是否是第一个玩家
 * @param {*} player1Selected 第一个玩家已选择
 * @param {*} player2Selected 第二个玩家已选择
 */
const canBeChoiced = (node, firstPlayer, player1Selected, player2Selected) => {
  if (!node || player1Selected.has(node) || player2Selected.has(node)) {
    return false;
  }

  if (firstPlayer) {
    if (player1Selected.size === 0) {
      return true;
    }

    for (let { left, right, parent } of player1Selected) {
      if (left === node || right === node || parent === node) {
        return true;
      }
    }
  } else {
    if (player2Selected.size === 0) {
      return true;
    }

    for (let { left, right, parent } of player2Selected) {
      if (left === node || right === node || parent === node) {
        return true;
      }
    }
  }

  return false;
};

export default canBeChoiced;
