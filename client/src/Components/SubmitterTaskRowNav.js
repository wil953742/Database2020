import React from "react";
import styles from "../CSS/component.module.css";

export const SubmitterTaskRowNav = () => {
  return (
    <div className={styles.outer_row}>
      <p>이름 </p>
      <p>점수</p>
      <p>TYPE</p>
      <p>제출일</p>
      <p>P/NP</p>
    </div>
  );
};
