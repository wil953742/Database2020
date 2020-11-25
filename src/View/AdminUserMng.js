import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Nav } from "../Components/Nav";

const AdminUserMng = (props) => {
  var history = useHistory();
  if (props.location.userType !== "관리자") {
    history.push("/");
  }

  return (
    <div>
      <Nav userType={"관리자"} name={props.location.name} />
      <h1>userpage</h1>
    </div>
  );
};

export default AdminUserMng;
