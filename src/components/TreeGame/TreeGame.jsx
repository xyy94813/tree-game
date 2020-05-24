import React, { useReducer, useCallback } from "react";

// import flow from "../../utils/flow";
import randomOdd from "../../utils/randomOdd.js";
import generateNBinaryTree from "../../utils/generateNBinaryTree";
import { bfs } from "../../utils/treeSearch.js";
import TreeNode from "../TreeNode";
import GameResult from "../GameResult";

import TreeGameContext from "./TreeGameContext";

import canBeChoiced from "./canBeChoiced";
import btreeGameWinningMove from "./btreeGameWinningMove";

const getDefaultState = () => {
  const dataSize = randomOdd(1, 100);
  return {
    dataSize,
    treeData: generateNBinaryTree(dataSize),
    player1Selected: new Set(),
    player2Selected: new Set(),
    firstPlayer: true,
    finished: false,
  };
};

/**
 * 检查玩家是否还能选择
 * @param {*} firstPlayer
 * @param {*} player1Selected
 * @param {*} player2Selected
 */
const checkPlayerFinish = (
  firstPlayer = true,
  player1Selected,
  player2Selected
) => {
  const isSelected = (node) =>
    player1Selected.has(node) || player2Selected.has(node);

  if (firstPlayer) {
    if (player1Selected.size === 0) {
      return false;
    }
    for (let { left, right, parent } of player1Selected) {
      if (
        (left && !isSelected(left)) ||
        (right && !isSelected(right)) ||
        (parent && !isSelected(parent))
      ) {
        return false;
      }
    }
  } else {
    if (player2Selected.size === 0) {
      return false;
    }
    for (let { left, right, parent } of player2Selected) {
      if (
        (left && !isSelected(left)) ||
        (right && !isSelected(right)) ||
        (parent && !isSelected(parent))
      ) {
        return false;
      }
    }
  }

  return true;
};

/**
 * 游戏结束时填满剩余的点
 * 待优化
 * @param {*} firstPlayer
 * @param {*} player1Selected
 * @param {*} player2Selected
 */
const fillNode = (firstPlayer, player1Selected, player2Selected) => {
  if (firstPlayer) {
    for (let { left, right, parent } of player1Selected) {
      if (canBeChoiced(left, firstPlayer, player1Selected, player2Selected)) {
        player1Selected.add(left);
      }
      if (canBeChoiced(right, firstPlayer, player1Selected, player2Selected)) {
        player1Selected.add(right);
      }
      if (canBeChoiced(parent, firstPlayer, player1Selected, player2Selected)) {
        player1Selected.add(parent);
      }
    }
  } else {
    for (let { left, right, parent } of player2Selected) {
      if (canBeChoiced(left, firstPlayer, player1Selected, player2Selected)) {
        player2Selected.add(left);
      }
      if (canBeChoiced(right, firstPlayer, player1Selected, player2Selected)) {
        player2Selected.add(right);
      }
      if (canBeChoiced(parent, firstPlayer, player1Selected, player2Selected)) {
        player2Selected.add(parent);
      }
    }
  }
};

const reducer = (state, { type, data }) => {
  if (type === "RESTART") {
    return getDefaultState();
  }

  if (type === "SELECT_NODE") {
    if (
      !canBeChoiced(
        data,
        state.firstPlayer,
        state.player1Selected,
        state.player2Selected
      )
    ) {
      return state;
    }

    if (state.firstPlayer) {
      !state.player2Selected.has(data) && state.player1Selected.add(data);
    } else {
      !state.player1Selected.has(data) && state.player2Selected.add(data);
    }

    let nextPlayer = !state.firstPlayer;

    const finished =
      checkPlayerFinish(false, state.player1Selected, state.player2Selected) ||
      checkPlayerFinish(true, state.player1Selected, state.player2Selected);

    if (finished) {
      fillNode(true, state.player1Selected, state.player2Selected);
      fillNode(false, state.player1Selected, state.player2Selected);
    }

    return {
      ...state,
      finished,
      firstPlayer: nextPlayer,
    };
  }

  if (type === "SELECT_NODE_BY_AI") {
    // AI is player2
    if (
      checkPlayerFinish(false, state.player1Selected, state.player2Selected)
    ) {
      return state;
    }

    if (state.player2Selected.size === 0 && state.player1Selected.size === 1) {
      const player1Selected = state.player1Selected.values().next().value;

      const choice = btreeGameWinningMove(
        state.treeData,
        state.dataSize,
        player1Selected
      );

      if (choice === 0) {
        player1Selected.parent &&
          state.player2Selected.add(player1Selected.parent);
      } else if (choice < 0) {
        player1Selected.left && state.player2Selected.add(player1Selected.left);
      } else {
        player1Selected.right &&
          state.player2Selected.add(player1Selected.right);
      }
    } else {
      for (let { left, right, parent } of state.player2Selected) {
        if (
          canBeChoiced(
            left,
            false,
            state.player1Selected,
            state.player2Selected
          )
        ) {
          state.player2Selected.add(left);
          break;
        }
        if (
          canBeChoiced(
            right,
            false,
            state.player1Selected,
            state.player2Selected
          )
        ) {
          state.player2Selected.add(right);
          break;
        }
        if (
          canBeChoiced(
            parent,
            false,
            state.player1Selected,
            state.player2Selected
          )
        ) {
          state.player2Selected.add(parent);
          break;
        }
      }
    }

    const finished =
      checkPlayerFinish(false, state.player1Selected, state.player2Selected) ||
      checkPlayerFinish(true, state.player1Selected, state.player2Selected);

    if (finished) {
      fillNode(true, state.player1Selected, state.player2Selected);
      fillNode(false, state.player1Selected, state.player2Selected);
    }

    return {
      ...state,
      finished,
      firstPlayer: true,
    };
  }

  return state;
};

const init = getDefaultState();

function TreeGame(props) {
  const [state, dispatch] = useReducer(reducer, init);
  const {
    player1Selected,
    player2Selected,
    finished,
    treeData,
    firstPlayer,
  } = state;
  const resetGame = useCallback(
    (e) => {
      dispatch({ type: "RESTART" });
    },
    [dispatch]
  );
  const handleResetBtnClick = resetGame;

  // 或许不需要事件委托
  const handlePanelClick = useCallback(
    (e) => {
      const { target } = e;
      if (target.tagName === "SPAN" && target.className === "tree-node-val") {
        console.log("节点" + target.textContent + "被选中");
        bfs(treeData, (node) => {
          if (
            target.textContent - node.val === 0 &&
            canBeChoiced(node, firstPlayer, player1Selected, player2Selected)
          ) {
            dispatch({ type: "SELECT_NODE", data: node });
            dispatch({ type: "SELECT_NODE_BY_AI" });
          }
        });
      }
    },
    [treeData, firstPlayer, player1Selected, player2Selected]
  );

  const player1SelectedNum = player1Selected.size;
  const player2SelectedNum = player2Selected.size;

  return (
    <>
      <div>
        <button onClick={handleResetBtnClick}>重新开始</button>
        <br />
        <span>player1: {player1SelectedNum}，</span>
        <span>player2[AI]: {player2SelectedNum}。</span>
        <span>current player: {firstPlayer ? "player1" : "player2"}</span>
      </div>
      {!!finished && (
        <GameResult
          onClick={resetGame}
          winner={
            player1SelectedNum === player2SelectedNum
              ? null
              : player1SelectedNum > player2SelectedNum
              ? "player1"
              : "player2"
          }
        />
      )}
      <div onClick={handlePanelClick}>
        <TreeGameContext.Provider
          value={{
            state,
            dispatch,
          }}
        >
          <TreeNode data={treeData} />
        </TreeGameContext.Provider>
      </div>
    </>
  );
}

export default React.memo(TreeGame);
