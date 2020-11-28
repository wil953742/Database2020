import React from "react";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import styles from "../CSS/mainstyle.module.css";
import { Link } from "react-router-dom";

export const CreateTaskFirst = () => {
  return (
    <div className={`${styles.sub_container_a} ${styles.ninety}`}>
      <div className={styles.title}>
        <h1>태스크 생성</h1>
      </div>
      <form noValidate autoComplete="off">
        <div>
          <TextField
            className={styles.input_box}
            id="name"
            label="이름"
            placeholder="태스크 이름을 입력하시오."
          />
        </div>
        <div>
          <TextField
            className={styles.input_box}
            id="description"
            label="설명"
            multiline
            rows={4}
            placeholder="태스크 설명을 입력하시오."
          />
        </div>
        <div>
          <TextField
            className={styles.input_box}
            id="period"
            label="업로드 주기"
            placeholder="업로드 주기를 입력하시오."
            type="number"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">일마다 제출</InputAdornment>
              ),
            }}
          />
        </div>
        <div>
          <TextField
            className={styles.input_box}
            id="pass_score"
            label="패스 기준 점수"
            placeholder="패스기준을 입력하시오."
            type="number"
            shrink
          />
        </div>
      </form>
      <div className={styles.button_container}>
        <Link to="/">
          <button className={`${styles.add_btn} ${styles.button_row}`}>
            닫기
          </button>
        </Link>
        <button className={`${styles.add_btn} ${styles.button_row}`}>
          다음
        </button>
      </div>
    </div>
  );
};
