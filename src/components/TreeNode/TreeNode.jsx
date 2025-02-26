import React, { useContext } from "react";
import classNames from "classnames";

import TreeGameContext from "../TreeGame/TreeGameContext";
import canBeChoiced from "../TreeGame/canBeChoiced";

import "./TreeNode.css";

function TreeNode({ data, className }) {
  const {
    firstPlayer,
    player1Selected,
    player2Selected,
    // dispatch,
  } = useContext(TreeGameContext);
  if (!data) {
    return null;
  }
  const { left, val, right } = data;

  // console.log(player1Selected, player2Selected);
  const selectedByPlayer1 = player1Selected.has(data);
  const selectedByPlayer2 = player2Selected.has(data);
  const active = canBeChoiced(
    data,
    firstPlayer,
    player1Selected,
    player2Selected
  );
  // const handleNodeClick = useCallback(() => {
  //   if (selectedByPlayer1 || selectedByPlayer1) {
  //     return;
  //   } else {
  //     dispatch({ type: "SELECT_NODE", data });
  //     dispatch({ type: "SELECT_NODE_BY_AI" });
  //   }
  // }, [dispatch, data, selectedByPlayer1, selectedByPlayer1]);

  return (
    <div
      className={classNames("tree-node", className, {
        "player1-selected": selectedByPlayer1,
        "player2-selected": selectedByPlayer2,
        disabled: !active,
      })}
    >
      <span
        className="tree-node-val"
        // onClick={active ? handleNodeClick : undefined}
      >
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

export default React.memo(TreeNode);
// export default TreeNode;
