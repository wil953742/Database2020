import React from "react";
import styles from "../CSS/component.module.css";

export const UserDetailSubmitter = ({ top, uds }) => {
  const color = top ? "rgba(163, 163, 163, 0.15)" : "whitesmoke";
  return (
    <div className={styles.row_container} style={{ backgroundColor: color }}>
      <p>{uds.name}</p>
      <p>{uds.totalSub}</p>
      <p>{uds.avgTub}</p>
      <p>{uds.avgDup}</p>
      <p>{uds.avgNullRatio}</p>
      <p>{uds.saveTup}</p>
      <p>{uds.avgPassRatio}</p>
    </div>
  );
};
