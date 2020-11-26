import React, { useEffect, useState } from "react";
import styles from "../CSS/template.module.css";
import { Nav } from "../Components/Nav";
import { AdminNav } from "../Components/AdminNav";

import { Login } from "../Components/Login";
import { EstimatorMain } from "./EstimatorMain";
import { AdminMain } from "./AdminMain";
import { SubmitterMain } from "./SubmitterMain";

export const Template = () => {
  const [log, setLog] = useState();
  const [userType, setUserType] = useState(null);
  const [name, setName] = useState(null);
  const [userID, setUserID] = useState(null);

  var logInfo;
  const loggedIn = localStorage.getItem("user");
  if (loggedIn) {
    logInfo = JSON.parse(loggedIn);
  }

  return (
    <div>
      {!logInfo && (
        <Login
          setName={setName}
          setUserType={setUserType}
          setUserID={setUserID}
          setLog={setLog}
        />
      )}
      {logInfo && (
        <div className={styles.main_container}>
          {logInfo.userType === "평가자" && (
            <Nav
              userType={logInfo.userType}
              name={logInfo.name}
              userID={logInfo.userID}
            />
          )}
          {logInfo.userType === "평가자" && <EstimatorMain />}
          {logInfo.userType === "관리자" && (
            <AdminNav
              userType={logInfo.userType}
              name={logInfo.name}
              userID={logInfo.userID}
            />
          )}
          {logInfo.userType === "관리자" && <AdminMain />}
          {logInfo.userType === "제출자" && (
            <Nav
              userType={logInfo.userType}
              name={logInfo.name}
              userID={logInfo.userID}
            />
          )}
          {logInfo.userType === "제출자" && <SubmitterMain />}
        </div>
      )}
    </div>
  );
};
