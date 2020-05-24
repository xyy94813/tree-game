import React, { useReducer, useCallback } from "react";

// import flow from "../../utils/flow";
import randomInteger from "../../utils/randomInteger.js";
import generateNBinaryTree from "../../utils/generateNBinaryTree";

import TreeNode from "../TreeNode";

import TreeGameContext from "./TreeGameContext";

import canBeChoiced from "./canBeChoiced";
import btreeGameWinningMove from "./btreeGameWinningMove";

const getDefaultState = () => {
  const dataSize = randomInteger(1, 20);
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
 * 检查游戏是否结束
 * 待优化
 * @param {*} player1Selected
 * @param {*} player2Selected
 */
// const checkFinished = (player1Selected, player2Selected) => {
//   const isSelected = (node) =>
//     player1Selected.has(node) || player2Selected.has(node);

//   for (let { left, right, parent } of player1Selected) {
//     if (
//       (left && !isSelected(left)) ||
//       (right && !isSelected(right)) ||
//       (parent && !isSelected(parent))
//     ) {
//       return false;
//     }
//   }

//   for (let { left, right, parent } of player2Selected) {
//     if (
//       (left && !isSelected(left)) ||
//       (right && !isSelected(right)) ||
//       (parent && !isSelected(parent))
//     ) {
//       return false;
//     }
//   }

//   return true;
// };

const checkFinished = (player1Selected, player2Selected, max) => {
  console.log(player1Selected.size + player2Selected.size, max);
  return player1Selected.size + player2Selected.size >= max;
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
    let nextPlayerFinish = checkPlayerFinish(
      nextPlayer,
      state.player1Selected,
      state.player2Selected
    );

    nextPlayer = nextPlayerFinish ? !nextPlayer : nextPlayer;

    return {
      ...state,
      firstPlayer: nextPlayer,
      finished: checkFinished(
        state.player1Selected,
        state.player2Selected,
        state.dataSize
      ),
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
        state.player2Selected.add(player1Selected.parent);
      } else if (choice < 0) {
        state.player2Selected.add(player1Selected.left);
      } else {
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
    return {
      ...state,
      firstPlayer: true,
      finished: checkFinished(
        state.player1Selected,
        state.player2Selected,
        state.dataSize
      ),
    };
  }

  return state;
};

const init = getDefaultState();

function TreeGame(props) {
  const [state, dispatch] = useReducer(reducer, init);
  const handleResetBtnClick = useCallback(
    (e) => {
      dispatch({ type: "RESTART" });
    },
    [dispatch]
  );
  // 或许不需要事件委托
  //   const handlePanelClick = useCallback((e) => {
  //     const { target } = e;
  //     if (target.tagName === "SPAN" && target.className === "tree-node-val") {
  //       console.log("节点" + target.textContent + "被选中");
  //     }
  //   });

  const player1SelectedNum = state.player1Selected.size;
  const player2SelectedNum = state.player2Selected.size;

  return (
    <>
      <div>
        <button onClick={handleResetBtnClick}>重新开始</button>
        <br />
        <span>player1: {player1SelectedNum}，</span>
        <span>player2[AI]: {player2SelectedNum}</span>
      </div>
      {!!state.finished && (
        <div>
          游戏结束，
          {player1SelectedNum === player2SelectedNum
            ? "平局"
            : player1SelectedNum > player2SelectedNum
            ? "player1 winned"
            : "player2 winned"}
        </div>
      )}
      <div>
        <TreeGameContext.Provider
          value={{
            state,
            dispatch,
          }}
        >
          <TreeNode data={state.treeData} />
        </TreeGameContext.Provider>
      </div>
    </>
  );
}

export default TreeGame;
