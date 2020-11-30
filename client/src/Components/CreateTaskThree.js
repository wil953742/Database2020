import React, { useState } from "react";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import IconButton from "@material-ui/core/IconButton";
import styles from "../CSS/mainstyle.module.css";
import TextField from "@material-ui/core/TextField";
import { Pair } from "../Components/classes";
import { RSC } from "../Components/classes";
import { Schema } from "../Components/Schema";
import { useHistory } from "react-router-dom";

export const CreateTaskThree = ({ setStep, newTask }) => {
  const [name, setName] = useState();
  const [num, setNum] = useState(2);
  const [row, setRow] = useState([1]);
  const [pairList, setPairList] = useState([new Pair()]);
  var history = useHistory();

  const handleRemove = () => {
    if (num === 2) {
      return;
    }
    setNum(num - 1);
    setRow(row.filter((item) => item !== num - 1));
    setPairList(pairList.slice(0, -1));
  };

  const handleNewRDT = () => {
    var finalList = [];
    for (var i = 0; i < pairList.length; i++) {
      if (pairList[i].name !== undefined && pairList[i].type !== undefined) {
        finalList.push(pairList[i]);
      }
    }
    newTask.RDTSchema.push(new RSC(name, finalList));
    setName("");
    setNum(2);
    setRow([1]);
    setPairList([new Pair()]);
  };

  const handleComplete = () => {
    if (name === "" || name === undefined || name === null) {
      history.push("/");
    } else {
      handleNewRDT();
    }
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
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className={`${styles.scrollable_div} ${styles.new_box}`}>
          {row.map((item) => (
            <Schema key={item} pair={pairList[item - 1]} />
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
            setPairList([...pairList, new Pair()]);
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
          onClick={() => handleNewRDT()}
        >
          원본타입추가
        </button>
        <button
          className={`${styles.add_btn} ${styles.button_row}`}
          onClick={() => handleComplete()}
        >
          완료
        </button>
      </div>
    </div>
  );
};