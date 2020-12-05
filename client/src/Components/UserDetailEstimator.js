import React from "react";
import styles from "../CSS/component.module.css";

export const UserDetailEstimator = ({ ude }) => {
  const download = async () => {
    return 0;
  };

  return (
    <div className={styles.row_container}>
      <p>{ude.ID}</p>
      <p>{ude.totalTup}</p>
      <p>{ude.dupTup}</p>
      <p>{ude.nullRatio}</p>
      <p>{ude.score}</p>
    </div>
  );
};