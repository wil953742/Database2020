import React from "react";
import styles from "../CSS/mainstyle.module.css";

import { EstimatorTopRow } from "../Components/EstimatorTopRow";
import { EstimateUnfinished } from "../Components/EstimateUnfinished";
import { EstimateFinished } from "../Components/EstimateFinished";

export const EstimatorMain = () => {
  const testRecord = {
    taskID: 1,
    taskName: "임시 이름",
    taskType: "임시 타입",
    submitter: "둘리",
    turn: 1,
    qt: {
      total_tup: 100,
      dup_tup: 10,
      null_ratio: 0.4,
    },
  };

  var unfinished = [];
  var finished = [];

  const LoadTasks = (unfinished, finished) => {
    // function to initially load tasks to lists;
  };

  return (
    <div className={styles.center_all}>
      <h2 className={styles.list_title}>평가 현황</h2>
      <div className={styles.main_container}>
        <div className={styles.sub_container_2}>
          <EstimatorTopRow />
          <div className={styles.scrollable_div}>
            <EstimateUnfinished record={testRecord} />
            <EstimateUnfinished record={testRecord} />
          </div>
        </div>
        <div className={styles.sub_container_2} style={{ marginTop: 0 }}>
          <EstimatorTopRow />
          <div className={styles.scrollable_div}>
            <EstimateFinished record={testRecord} />
          </div>
        </div>
      </div>
    </div>
  );
};
