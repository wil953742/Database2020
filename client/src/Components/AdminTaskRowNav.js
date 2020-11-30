import React from "react";
import styles from "../CSS/component.module.css";

export const AdminTaskRowNav = () => {
  return (
    <div className={styles.outer_row}>
      <p>ID </p>
      <p style={{ flexGrow: "2" }}>설명</p>
      <p>기한</p>
      <p>패스기준</p>
      <p> </p>
    </div>
  );
};
