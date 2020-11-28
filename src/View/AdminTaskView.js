import React from "react";
import styles from "../CSS/mainstyle.module.css";
import { useHistory } from "react-router-dom";

import { AdminNav } from "../Components/AdminNav";

const AdminTaskView = (props) => {
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
            <h1>Test</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTaskView;
