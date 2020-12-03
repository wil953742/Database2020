import React from "react";
import styles from "../CSS/component.module.css";

export const AdminUserRowNav = () => {
  return (
    <div className={styles.outer_row}>
      <p>이름</p>
      <p>역할</p>
      <p>나이</p>
      <p>성별</p>
      <p>ID</p>
      <p>참여태스크</p>
      <p> </p>
    </div>
  );
};
