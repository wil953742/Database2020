import React from "react";
import styles from "../CSS/mainstyle.module.css";
import { Record } from "../Components/classes";
import { QT } from "../Components/classes";

import { EstimatorTopRow } from "../Components/EstimatorTopRow";
import { EstimateUnfinished } from "../Components/EstimateUnfinished";
import { EstimateFinished } from "../Components/EstimateFinished";

export const EstimatorMain = ({ loginfo }) => {
  const testRecord = new Record(
    1,
    "임시이름",
    "임시 타입",
    "둘리",
    1,
    new QT(100, 10, 0.4),
    null,
    "/"
  );

  var unfinished = [];
  var finished = [];
  unfinished.push(testRecord);
  unfinished.push(testRecord);
  unfinished.push(testRecord);
  finished.push(testRecord);
  finished.push(testRecord);
  finished.push(testRecord);

  const LoadTasks = (unfinished, finished) => {
    /*  function to initially load tasks to lists
        userID is in "loginfo.userID"
    */
  };

  return (
    <div className={styles.center_all}>
      <h2 className={styles.list_title}>평가 현황</h2>
      <div className={styles.main_container}>
        <div className={styles.sub_container_2}>
          <EstimatorTopRow />
          <div className={styles.scrollable_div}>
            {unfinished.map((record) => (
              <EstimateUnfinished record={record} />
            ))}
          </div>
        </div>
        <div className={styles.sub_container_2} style={{ marginTop: 0 }}>
          <EstimatorTopRow />
          <div className={styles.scrollable_div}>
            {finished.map((record) => (
              <EstimateFinished record={record} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
