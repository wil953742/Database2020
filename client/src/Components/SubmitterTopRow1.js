import React from "react";

import styles from "../CSS/component.module.css";

export const SubmitterTopRow1 = () => {
  return (
    <div className={styles.outer_row}>
      <p>태스크 이름</p>
      <p>설명</p>
      <p>최종 제출일</p>
      <p>제출 파일수</p>
    </div>
  );
};
