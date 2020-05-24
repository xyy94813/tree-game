import React, { useContext, useCallback } from "react";
import classNames from "classnames";

import "./TreeNode.css";

import TreeGameContext from "../TreeGame/TreeGameContext";

function TreeNode({ data, className }) {
  if (!data) {
    return null;
  }
  const { left, val, right } = data;
  const {
    state: { player1Selected, player2Selected },
    dispatch,
  } = useContext(TreeGameContext);
  // console.log(player1Selected, player2Selected);
  const selectedByPlayer1 = player1Selected.has(data);
  const selectedByPlayer2 = player2Selected.has(data);

  const handleNodeClick = useCallback(() => {
    if (selectedByPlayer1 || selectedByPlayer1) {
      return;
    } else {
      dispatch({ type: "SELECT_NODE", data });
    }
  }, [dispatch, data, selectedByPlayer1, selectedByPlayer1]);

  return (
    <div
      className={classNames("tree-node", className, {
        ["player1-selected"]: selectedByPlayer1,
        ["player2-selected"]: selectedByPlayer2,
      })}
    >
      <span className="tree-node-val" onClick={handleNodeClick}>
        {val}
      </span>
      {(!!left || !!right) && (
        <div className="tree-node-child">
          {!!left && <TreeNode data={left} className="tree-node-left" />}
          {!!right && <TreeNode data={right} className="tree-node-right" />}
        </div>
      )}
    </div>
  );
}

// export default React.memo(TreeNode);
export default TreeNode;
