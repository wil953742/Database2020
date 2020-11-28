import React from "react";
import styles from "../CSS/mainstyle.module.css";
import { useHistory } from "react-router-dom";

import { AdminNav } from "../Components/AdminNav";
import { CreateTaskFirst } from "../Components/CreateTaskFirst";

const AdminAddTask = () => {
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
          <CreateTaskFirst />
        </div>
      </div>
    </div>
  );
};

export default AdminAddTask;
