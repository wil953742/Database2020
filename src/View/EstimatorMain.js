import React from "react";
import styles from "../CSS/mainstyle.module.css";

import { EstimatorTopRow } from "../Components/EstimatorTopRow";
import { EstimateUnfinished } from "../Components/EstimateUnfinished";
import { EstimateFinished } from "../Components/EstimateFinished";

export const EstimatorMain = () => {
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
            <EstimateUnfinished
              taskName="임시이름"
              taskType="임시타입"
              submitter="홍길동"
              turn="9"
            />
            <EstimateUnfinished
              taskName="임시이름"
              taskType="임시타입"
              submitter="홍길동"
              turn="9"
            />
          </div>
        </div>
        <div className={styles.sub_container_2} style={{ marginTop: 0 }}>
          <EstimatorTopRow />
          <div className={styles.scrollable_div}>
            <EstimateFinished
              taskName="임시이름"
              taskType="임시타입"
              submitter="홍길동"
              turn="9"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
