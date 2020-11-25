import React, { useState } from "react";
import styles from "../CSS/component.module.css";
import CloseIcon from "@material-ui/icons/Close";
import { IconButton } from "@material-ui/core";

export const SubmitterSubmit = ({
  period,
  setTogglePopUp,
}) => {
  const [score, setScore] = useState(0);
  console.log();

  const EvalTurn = () => {

    let today = new Date(); 
    period *= 1;

    return today.getDay / period;
  }

  const Upload = () => {
    // process uploading
    setTogglePopUp(false);
  };
  return (
    <div className={styles.popup_sub}>
      <IconButton
        className={styles.close_btn}
        style={{ position: "absolute" }}
        onClick={() => setTogglePopUp(false)}
      >
        <CloseIcon fontSize="large" />
      </IconButton>
      <div className={styles.info}>
        <h3>태스크 이름</h3>
        <p>임시 이름</p>
      </div>
      <div className={styles.info}>
        <h3>태스크 정보</h3>
        <p>서울 거주 확진자 들의 데이터 csv 파일</p>
      </div>
      <div className={styles.info}>
        <h3>회차</h3>
        <p>{() => EvalTurn()}</p>
      </div>

      <button className={styles.complete_btn} onClick={() => Upload()}>
        완료
      </button>
    </div>
  );
};
