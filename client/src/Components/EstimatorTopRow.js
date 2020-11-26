import React from "react";

import styles from "../CSS/component.module.css";

export const EstimatorTopRow = () => {
  return (
    <div className={styles.outer_row}>
      <p>이름</p>
      <p>타입</p>
      <p>제출자</p>
      <p>회차</p>
      <p> </p>
    </div>
  );
};
