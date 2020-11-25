import React, { useState } from "react";
import styles from "../CSS/component.module.css";

import { EstimatorDetail } from "./EstimatorDetail";

export const EstimateFinished = ({
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
        <div className={styles.button_container}>
          <button className={styles.row_button} onClick={() => Estimate()}>
            상세보기
          </button>
        </div>
      </div>
      {togglePopUp && (
        <EstimatorDetail
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
