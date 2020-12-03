import React, { useState } from "react";
import styles from "../CSS/component.module.css";
import CloseIcon from "@material-ui/icons/Close";
import { IconButton } from "@material-ui/core";
import styles2 from "../CSS/mainstyle.module.css";

export const EstimatorEstimate = ({ record, setTogglePopUp }) => {
  const [score, setScore] = useState(0);
  const DomainCheck = (value) => {
    if (value > 10) {
      setScore(10);
    } else if (value < 0) {
      setScore(0);
    } else {
      setScore(value);
    }
  };

  const download = (record) => {
    // download file
    setTogglePopUp(false);
  };

  const submit = () => {
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
        <button onClick={() => DomainCheck(score - 1)}>-</button>
        <input
          type="number"
          value={score}
          onChange={(e) => DomainCheck(e.target.value)}
        />
        <button onClick={() => DomainCheck(score + 1)}>+</button>
      </div>

      <div className={styles2.button_container}>
        <button
          className={`${styles2.add_btn} ${styles2.button_row}`}
          onClick={() => download(record)}
        >
          다운로드
        </button>
        <button
          className={`${styles2.add_btn} ${styles2.button_row}`}
          onClick={() => submit()}
        >
          완료
        </button>
      </div>
    </div>
  );
};