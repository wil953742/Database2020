import React from "react";
import styles from "../CSS/component.module.css";

export const UserDetailSubmitterNav = () => {
  return (
    <div className={styles.outer_row}>
      <p>태스크/원본이름</p>
      <p>제출파일수</p>
      <p>평균튜플수</p>
      <p>평균중복튜플수</p>
      <p>평균NULLRATIO</p>
      <p>저장튜플수</p>
      <p>평균PASSRATIO</p>
    </div>
  );
};
