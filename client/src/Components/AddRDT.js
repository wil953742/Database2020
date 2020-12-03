import React, { useState } from "react";
import { Link } from "react-router-dom";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import IconButton from "@material-ui/core/IconButton";
import styles from "../CSS/mainstyle.module.css";
import TextField from "@material-ui/core/TextField";

import { Schema } from "../Components/Schema";

export const CreateTaskThree = ({ setStep }) => {
  const [num, setNum] = useState(2);
  const [row, setRow] = useState([1]);

  const handleRemove = () => {
    if (num === 2) {
      return;
    }
    setNum(num - 1);
    setRow(row.filter((item) => item !== num - 1));
  };
  return (
    <div className={`${styles.sub_container_a} ${styles.ninety}`}>
      <div className={styles.title}>
        <h1>원본데이터타입 스키마 설정</h1>
      </div>
      <form noValidate autoComplete="off">
        <div>
          <TextField
            className={styles.input_box}
            id="name"
            label="원본데이터타입 이름"
            placeholder="원본데이터 타입 이름을 입력하시오."
          />
        </div>
        <div className={`${styles.scrollable_div} ${styles.new_box}`}>
          {row.map((item) => (
            <Schema key={item} />
          ))}
        </div>
      </form>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <IconButton
          onClick={() => {
            handleRemove();
          }}
        >
          <RemoveCircleIcon />
        </IconButton>
        <IconButton
          onClick={() => {
            setNum(num + 1);
            setRow([...row, num]);
          }}
        >
          <AddCircleIcon />
        </IconButton>
      </div>
      <div className={styles.button_container}>
        <button
          className={`${styles.add_btn} ${styles.button_row}`}
          onClick={() => setStep(2)}
        >
          이전
        </button>
        <button
          className={`${styles.add_btn} ${styles.button_row}`}
          onClick={() => setStep(3)}
        >
          원본타입추가
        </button>
        <Link to="/">
          <button className={`${styles.add_btn} ${styles.button_row}`}>
            완료
          </button>
        </Link>
      </div>
    </div>
  );
};