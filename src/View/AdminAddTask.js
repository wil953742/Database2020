import React, { useState } from "react";
import styles from "../CSS/mainstyle.module.css";
import { useHistory } from "react-router-dom";

import { AdminNav } from "../Components/AdminNav";
import { CreateTaskFirst } from "../Components/CreateTaskFirst";
import { CreateTaskTwo } from "../Components/CreateTaskTwo";
import { CreateTaskThree } from "../Components/CreateTaskThree";

const AdminAddTask = () => {
  const [step, setStep] = useState(1);
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
          {step === 1 && <CreateTaskFirst setStep={setStep} />}
          {step === 2 && <CreateTaskTwo setStep={setStep} />}
          {step === 3 && <CreateTaskThree setStep={setStep} />}
        </div>
      </div>
    </div>
  );
};

export default AdminAddTask;
