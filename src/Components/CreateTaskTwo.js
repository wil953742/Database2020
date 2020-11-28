import React, { useState } from "react";
import styles from "../CSS/mainstyle.module.css";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import IconButton from "@material-ui/core/IconButton";

import { Schema } from "../Components/Schema";

export const CreateTaskTwo = ({ setStep }) => {
  const [num, setNum] = useState(2);
  const [row, setRow] = useState([1]);

  const handleRemove = () => {
    if (num == 1) {
      return;
    }
    setNum(num - 1);
    setRow(row.filter((item) => item !== num - 1));
  };

  return (
    <div className={`${styles.sub_container_a} ${styles.ninety}`}>
      <div className={styles.title}>
        <h1>태스크 데이터 테이블 스키마 설정</h1>
        <form noValidate autoComplete="off">
          <div className={styles.scrollable_div}>
            {row.map((item) => (
              <Schema key={item} />
            ))}
          </div>
        </form>
        <div className={styles.button_row}>
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
        <div>
          <button>d</button>
          <button>d</button>
        </div>
      </div>
    </div>
  );
};
