import React, { useState } from "react";
import styles from "../CSS/component.module.css";

import { EstimatorDetail } from "./EstimatorDetail";

export const EstimateFinished = ({ record }) => {
  const [togglePopUp, setTogglePopUp] = useState(false);
  return (
    <div>
      <div className={styles.row_container}>
        <p>{record.taskName}</p>
        <p>{record.taskType}</p>
        <p>{record.submitter}</p>
        <p>{record.turn}</p>
        <div className={styles.button_container}>
          <button
            className={styles.row_button}
            onClick={() => setTogglePopUp(true)}
          >
            상세보기
          </button>
        </div>
      </div>
      {togglePopUp && (
        <EstimatorDetail record={record} setTogglePopUp={setTogglePopUp} />
      )}
    </div>
  );
};
