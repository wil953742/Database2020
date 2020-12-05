import React, { useState } from "react";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import IconButton from "@material-ui/core/IconButton";
import styles from "../CSS/mainstyle.module.css";
import TextField from "@material-ui/core/TextField";
import { RPair } from "../Components/classes";
import { RSC } from "../Components/classes";
import { Schema } from "../Components/Schema";
import { useHistory } from "react-router-dom";

export const CreateTaskThree = ({ setStep, newTask }) => {
  const axios = require("axios").default;
  const [name, setName] = useState();
  const [num, setNum] = useState(2);
  const [row, setRow] = useState([1]);
  const [pairList, setPairList] = useState([new RPair()]);
  var history = useHistory();

  const handleRemove = () => {
    if (num === 1) {
      return;
    }
    setNum(num - 1);
    setRow(row.filter((item) => item !== num - 1));
    setPairList(pairList.slice(0, -1));
  };

  const createTask = async () => {
    await axios
      .post("/api/Admin/CreateTask", { newTask: newTask })
      .then((res) => console.log(res))
      .catch((err) => {
        console.log(err);
      });
  };

  const handleNewRDT = () => {
    var dup = [];
    for (var i = 0; i < pairList.length; i++) {
      if (dup.includes(pairList[i].map)) {
        alert("중복 매핑이 있습니다.");
        return;
      }
      dup.push(pairList[i].map);
    }
    var finalList = [];
    for (var i = 0; i < pairList.length; i++) {
      if (pairList[i].name !== undefined && pairList[i].type !== undefined) {
        finalList.push(pairList[i]);
      }
    }
    if (finalList.length === 0) {
      alert("스키마를 추가해주세요.");
      return;
    }
    var nameList = [];
    for (var i = 0; i < finalList.length; i++) {
      if (nameList.includes(finalList[i].name)) {
        alert("중복 속성 이름이 있습니다.");
        return;
      }
      nameList.push(finalList[i].name);
    }
    newTask.RDTSchema.push(new RSC(name, finalList));
    setName("");
    setNum(2);
    setRow([]);
    setPairList([new RPair()]);
    alert("원본 타입이 추가되었습니다.");
  };

  const handleComplete = () => {
    if (!(name === "" || name === undefined || name === null)) {
      handleNewRDT();
    }
    if (newTask.RDTSchema.length === 0) {
      alert("최소 하나의 원본 타입을 추가해야합니다.");
      return;
    }
    createTask();
    history.push("/");
    alert("태스크가 생성되었습니다.");
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
            <Schema
              key={item}
              pair={pairList[item - 1]}
              raw={true}
              tdt={newTask.TDTSchema.list}
            />
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
            setPairList([...pairList, new RPair()]);
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
          onClick={() => {
            setStep(2);
            newTask.RDTSchema = undefined;
          }}
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