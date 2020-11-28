import React, { useState } from "react";
import styles from "../CSS/mainstyle.module.css";

import { SubmitterTaskRowNav } from "../Components/SubmitterTaskRowNav";
import { SubmitterTaskRow } from "../Components/SubmitterTaskRow";
import { SubmitterSubmit } from "../Components/SubmitterSubmit";
import { Nav } from "../Components/Nav";

export const SubmitterTaskView = ({
  taskID,
  taskName,
  taskDesc,
  taskDate,
  taskNum,
 }) => {

  var logInfo;
  const loggedIn = localStorage.getItem("user");
  console.log(loggedIn);
  if (loggedIn) {
    logInfo = JSON.parse(loggedIn);
  }

  const [togglePopUp, setTogglePopUp] = useState(false);
  const Submit = () => {
    // Get Information About Chosen Task
    setTogglePopUp(true);
  };

  return (
    <div className={styles.center_all}>
      <Nav
        userType={loggedIn.userType}
        name={loggedIn.userName}
        userID={loggedIn.userID}
      />
      <h2 className={styles.list_title}>파일 목록</h2>
      <div className={styles.main_container}>
        <div className={styles.sub_container_1}>
          <SubmitterTaskRowNav />
          <div className={styles.scrollable_div}>
            <SubmitterTaskRow
              fileName="코로나.csv"
              fileScore="86"
              fileType="국내 확진자 Type"
              fileDate="20/11/25"
              filePNP="P"
            />
          </div>
        </div>
      </div>
      <button className={styles.add_btn} onClick={() => Submit()}>
            제출하기
      </button>
      {togglePopUp && (
      <SubmitterSubmit
        setTogglePopUp={setTogglePopUp}
        taskID={taskID}
        taskDesc={taskDesc}
      />)
      }
    </div>
  );
};
