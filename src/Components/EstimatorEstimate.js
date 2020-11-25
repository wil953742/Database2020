import React, { useState } from "react";
import styles from "../CSS/component.module.css";
import CloseIcon from "@material-ui/icons/Close";
import { IconButton } from "@material-ui/core";

export const EstimatorEstimate = ({
  taskID,
  taskName,
  taskType,
  submitter,
  turn,
  setTogglePopUp,
}) => {
  const [score, setScore] = useState(0);
  console.log();
  const DomainCheck = (value) => {
    if (value > 10) {
      setScore(10);
    } else if (value < 0) {
      setScore(0);
    } else {
      setScore(value);
    }
  };

  const Submit = () => {
    // process submitting
    setTogglePopUp(false);
  };
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
      <p>임시 이름</p>
      <h3>태스크 타입</h3>
      <p>임시 타입</p>
      <h3>제출자</h3>
      <p>홍길동</p>
      <h3>회차</h3>
      <p>99</p>
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
            <th>100</th>
            <th>5</th>
            <th>0.5</th>
          </tr>
        </tbody>
      </table>
      <h3 style={{ textAlign: "center" }}>점수</h3>
      <div className={styles.evaluate}>
        <button onClick={() => DomainCheck(score - 1)}>-</button>
        <input
          type="number"
          value={score}
          onChange={(e) => DomainCheck(e.target.value)}
        />
        <button onClick={() => DomainCheck(score + 1)}>+</button>
      </div>

      <button className={styles.complete_btn} onClick={() => Submit()}>
        완료
      </button>
    </div>
  );
};
