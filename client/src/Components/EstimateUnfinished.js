import React, { useState } from "react";
import styles from "../CSS/component.module.css";

import { EstimatorEstimate } from "./EstimatorEstimate";

export const EstimateUnfinished = ({ record }) => {
  const [togglePopUp, setTogglePopUp] = useState(false);
  return (
    <div>
      <div className={styles.row_container}>
        <p>{record.taskName}</p>
        <p>{record.taskType}</p>
        <p>{record.submitter}</p>
        <p>{record.turn}</p>
        <div>
          <button
            className={styles.row_button}
            onClick={() => setTogglePopUp(true)}
          >
            평가하기
          </button>
        </div>
      </div>
      {togglePopUp && (
        <EstimatorEstimate record={record} setTogglePopUp={setTogglePopUp} />
      )}
    </div>
  );
};