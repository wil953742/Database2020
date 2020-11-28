import React from "react";
import styles from "../CSS/mainstyle.module.css";
import TextField from "@material-ui/core/TextField";
import { useHistory } from "react-router-dom";

import { AdminNav } from "../Components/AdminNav";

const AdminTaskEdit = (props) => {
  const task = props.location.task;
  console.log(task);

  var logInfo;
  var history = useHistory();
  const loggedIn = localStorage.getItem("user");
  if (loggedIn) {
    logInfo = JSON.parse(loggedIn);
  } else {
    history.push("/");
  }
  return (
    <div>
      <AdminNav
        userType={"관리자"}
        name={logInfo.name}
        userID={logInfo.userID}
      />
      <div className={styles.center_all}>
        <div className={styles.main_container}>
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
                <button className={`${styles.add_btn} ${styles.button_row}`}>
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
        </div>
      </div>
    </div>
  );
};

export default AdminTaskEdit;
