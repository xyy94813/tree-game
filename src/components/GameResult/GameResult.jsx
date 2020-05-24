import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import "./GameResult.css";

function GameResult({ winner, className, ...restProps }) {
  return (
    <div {...restProps} className={classNames("game-result-panel", className)}>
      <div>
        游戏结束，
        {!!winner ? `${winner} winned` : "平局"}
      </div>
    </div>
  );
}

GameResult.propTypes = {
  winner: PropTypes.string,
};

export default GameResult;
