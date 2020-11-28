import React from "react";
import styles from "../CSS/component.module.css";

export const AdminTaskRowNav = () => {
  return (
    <div className={styles.outer_row}>
      <p>이름 </p>
      <p>설명</p>
      <p>기한</p>
      <p>대기자 수</p>
      <p>참여자 수</p>
      <p> </p>
    </div>
  );
};
