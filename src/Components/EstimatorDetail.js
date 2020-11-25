import React, { useState, useEffect } from "react";
import styles from "../CSS/component.module.css";
import CloseIcon from "@material-ui/icons/Close";
import { IconButton } from "@material-ui/core";

export const EstimatorDetail = ({ record, setTogglePopUp }) => {
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Load Score and Set Score
  }, []);
  return (
    <div className={styles.popup}>
      <IconButton
        className={styles.close_btn}
        style={{ position: "absolute" }}
        onClick={() => setTogglePopUp(false)}
      >
        <CloseIcon fontSize="large" />
      </IconButton>
      <h3>태스크 이름</h3>
      <p>{record.taskName}</p>
      <h3>태스크 타입</h3>
      <p>{record.taskType}</p>
      <h3>제출자</h3>
      <p>{record.submitter}</p>
      <h3>회차</h3>
      <p>{record.turn}</p>
      <table className={styles.qualitative_test}>
        <thead>
          <tr>
            <th>총 튜플 수</th>
            <th>총 중복 튜플 수</th>
            <th>Null Ratio</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>{record.qt.total_tup}</th>
            <th>{record.qt.dup_tup}</th>
            <th>{record.qt.null_ratio}</th>
          </tr>
        </tbody>
      </table>
      <h3 style={{ textAlign: "center" }}>점수</h3>
      <div className={styles.evaluate}>
        <button disabled>-</button>
        <input type="number" value={score} disabled />
        <button disabled>+</button>
      </div>

      <button className={styles.complete_btn} disabled>
        완료
      </button>
    </div>
  );
};
