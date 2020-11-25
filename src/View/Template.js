import React, { useState } from "react";
import styles from "../CSS/template.module.css";
import { Nav } from "../Components/Nav";

import { Login } from "../Components/Login";
import { EstimatorMain } from "./EstimatorMain";
import { AdminMain } from "./AdminMain";

export const Template = () => {
  const [login, setLogin] = useState(false);
  const [userType, setUserType] = useState(null);
  const [name, setName] = useState(null);

  return (
    <div>
      {!login && (
        <Login
          setName={setName}
          setLogin={setLogin}
          setUserType={setUserType}
        />
      )}
      {login && (
        <div className={styles.main_container}>
          <Nav userType={userType} name={name} />
          {userType === "평가자" && <EstimatorMain />}
          {userType === "관리자" && <AdminMain />}
        </div>
      )}
    </div>
  );
};
