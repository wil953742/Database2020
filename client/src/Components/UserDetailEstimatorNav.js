import React from "react";
import styles from "../CSS/component.module.css";

export const UserDetailEstimatorNav = () => {
  return (
    <div className={styles.outer_row}>
      <p>파일ID</p>
      <p>총튜플수</p>
      <p>중복튜플수</p>
      <p>NULL RATIO</p>
      <p> </p>
      <p>부여점수</p>
    </div>
  );
};
