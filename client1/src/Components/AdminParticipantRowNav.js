import React from "react";
import styles from "../CSS/component.module.css";

export const AdminParticipantRowNav = () => {
  return (
    <div className={styles.outer_row}>
      <p>이름</p>
      <p>성별</p>
      <p>생일</p>
      <p>점수</p>
      <p></p>
    </div>
  );
};
