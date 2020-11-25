import React, { useState } from "react";
import styles from "../CSS/component.module.css";
import { Link } from "react-router-dom";

import { EstimatorEstimate } from "./EstimatorEstimate";

export const EstimateUnfinished = ({
  taskID,
  taskName,
  taskType,
  submitter,
  turn,
}) => {
  const [togglePopUp, setTogglePopUp] = useState(false);
  const Estimate = () => {
    // Get Information About Chosen Task
    setTogglePopUp(true);
  };
  return (
    <div>
      <div className={styles.row_container}>
        <p>{taskName}</p>
        <p>{taskType}</p>
        <p>{submitter}</p>
        <p>{turn}</p>
        <div>
          <button className={styles.row_button} onClick={() => Estimate()}>
            평가하기
          </button>
        </div>
      </div>
      {togglePopUp && (
        <EstimatorEstimate
          taskID={taskID}
          taskName={taskName}
          taskType={taskType}
          submitter={submitter}
          turn={turn}
          setTogglePopUp={setTogglePopUp}
        />
      )}
    </div>
  );
};
