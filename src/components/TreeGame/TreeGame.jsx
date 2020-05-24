import React, { useReducer, useCallback } from "react";

import flow from "../../utils/flow";
import randomInteger from "../../utils/randomInteger.js";
import generateNBinaryTree from "../../utils/generateNBinaryTree";

import TreeNode from "../TreeNode";

import TreeGameContext from "./TreeGameContext";

const getDefaultState = () => {
  return {
    player1Selected: new Set(),
    player2Selected: new Set(),
    treeData: flow(randomInteger, generateNBinaryTree)(1, 20),
    firstPlayer: true,
    finished: false,
  };
};

const checkFinished = (player1Selected, player2Selected) => {
  const isSelected = (node) =>
    player1Selected.has(node) || player2Selected.has(node);

  for (let { left, right, parent } of player1Selected) {
    if (
      (left && !isSelected(left)) ||
      (right && !isSelected(right)) ||
      (parent && !isSelected(parent))
    ) {
      return false;
    }
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

  return true;
};

const reducer = (state, { type, data }) => {
  if (type === "RESTART") {
    return getDefaultState();
  }

  if (type === "SELECT_NODE") {
    if (state.firstPlayer) {
      !state.player2Selected.has(data) && state.player1Selected.add(data);
    } else {
      !state.player1Selected.has(data) && state.player2Selected.add(data);
    }
    return {
      ...state,
      firstPlayer: !state.firstPlayer,
      finished: checkFinished(state.player2Selected, state.player1Selected),
    };
  }

  return state;
};

function TreeGame(props) {
  const [state, dispatch] = useReducer(reducer, getDefaultState());
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
        <button onClick={handleResetBtnClick}>重置</button>
        <br />
        <span>player1: {player1SelectedNum}，</span>
        <span>player2: {player2SelectedNum}</span>
      </div>
      {!!state.finished && (
        <div>
          游戏结束，
          {player1SelectedNum === player2SelectedNum
            ? "平局"
            : player1SelectedNum > player2SelectedNum
            ? "player1"
            : "player2"}
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
