import React, { useEffect, useState } from "react";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import styles from "../CSS/mainstyle.module.css";
import { Link } from "react-router-dom";

export const CreateTaskFirst = ({ setStep, newTask }) => {
  const axios = require("axios").default;
  const [dup, setDup] = useState();
  const [name, setName] = useState();

  const check = async () => {
    if (name === undefined || !name) return;
    var check = /^[A-Za-z][A-Za-z0-9_]*$/;
    if (name.match(check)) {
      newTask.name = name;
    } else {
      alert("이름은 영문자와 숫자, '_' 로만 구성해주세요.");
      return;
    }
    await axios.get(`/api/NewTask/${name}`).then((res) => setDup(res.data));
  };

  useEffect(() => {
    if (!dup) return;
    if (dup[0].N === 1) {
      alert("이미 같은 이름의 태스크가 존재합니다.");
    } else {
      if (newTask.name && newTask.desc && newTask.period && newTask.passScore) {
        setStep(2);
      } else alert("빈칸을 채워주세요.");
    }
  }, [dup]);

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
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
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
            value={newTask.desc}
            onChange={(e) => (newTask.desc = e.target.value)}
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
            value={newTask.period}
            onChange={(e) => (newTask.period = e.target.value)}
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
            value={newTask.passScore}
            onChange={(e) => (newTask.passScore = e.target.value)}
          />
        </div>
      </form>
      <div className={styles.button_container}>
        <Link to="/">
          <button className={`${styles.add_btn} ${styles.button_row}`}>
            닫기
          </button>
        </Link>
        <button
          className={`${styles.add_btn} ${styles.button_row}`}
          onClick={() => check()}
        >
          다음
        </button>
      </div>
    </div>
  );
};
