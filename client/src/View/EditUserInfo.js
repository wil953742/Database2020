import React from "react";
import { useHistory } from "react-router-dom";

import { AdminNav } from "../Components/AdminNav";

const EditUserInfo = () => {
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
        userType={logInfo.userType}
        name={logInfo.name}
        userID={logInfo.userID}
      />
      <h1>Edit User Info Page</h1>
    </div>
  );
};

export default EditUserInfo;
