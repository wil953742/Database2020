import React, { useState } from "react";
import styles from "../CSS/mainstyle.module.css";
import TextField from "@material-ui/core/TextField";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import IconButton from "@material-ui/core/IconButton";
import { useHistory } from "react-router-dom";

import { Schema } from "../Components/Schema";
import { AdminNav } from "../Components/AdminNav";

const AdminTaskEdit = (props) => {
  const task = props.location.task;
  const [toggleAdd, setToggleAdd] = useState(false);
  console.log(task);

  var logInfo;
  var history = useHistory();
  const loggedIn = localStorage.getItem("user");
  if (loggedIn) {
    logInfo = JSON.parse(loggedIn);
  } else {
    history.push("/");
  }

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
    <div>
      <AdminNav
        userType={"관리자"}
        name={logInfo.name}
        userID={logInfo.userID}
      />
      <div className={styles.center_all}>
        <div className={styles.main_container}>
          {!toggleAdd && (
            <div className={styles.sub_container_1}>
              <div className={styles.ca}>
                <form noValidate autoComplete="off">
                  <div className={styles.nbc}>
                    <TextField
                      className={styles.name_box}
                      id="name"
                      label="태스크 이름"
                      defaultValue="임시 이름"
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </div>
                  <div className={styles.nbc}>
                    <TextField
                      className={styles.name_box}
                      id="pass_score"
                      label="패스 기준 점수"
                      defaultValue={5}
                      type="number"
                      shrink
                    />
                  </div>
                </form>
                <div className={styles.button_container}>
                  <button
                    className={`${styles.add_btn} ${styles.button_row}`}
                    onClick={() => setToggleAdd(!toggleAdd)}
                  >
                    원본데이터타입 추가
                  </button>
                  <button
                    className={`${styles.add_btn} ${styles.button_row}`}
                    onClick={() => history.push("/")}
                  >
                    완료
                  </button>
                </div>
              </div>
            </div>
          )}
          {toggleAdd && (
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
                  onClick={() => setToggleAdd(!toggleAdd)}
                >
                  완료
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTaskEdit;
