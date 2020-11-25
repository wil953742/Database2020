import React from "react";
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
      <h1>Task View</h1>
    </div>
  );
};

export default AdminTaskView;
