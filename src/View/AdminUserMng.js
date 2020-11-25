import React from "react";
import { useHistory } from "react-router-dom";
import { AdminNav } from "../Components/AdminNav";

const AdminUserMng = (props) => {
  var history = useHistory();
  if (props.location.userType !== "관리자") {
    history.push("/");
  }

  console.log(props.location.userID);

  return (
    <div>
      <AdminNav
        userType={"관리자"}
        name={props.location.name}
        userID={props.location.userID}
      />
      <h1>userpage</h1>
    </div>
  );
};

export default AdminUserMng;
