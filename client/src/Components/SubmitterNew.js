import React, { useState } from "react";
import styles from "../CSS/component.module.css";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

export const SubmitterNew =  ({task })  => {
  var logInfo;
  var history = useHistory();
  const loggedIn = localStorage.getItem("user");
  if (loggedIn) {
    logInfo = JSON.parse(loggedIn);
  } else {
    history.push("/");
  }
  

  const SubmitterID = logInfo.accountID;
  const TaskID = task.taskID;

  const axios = require('axios');
  const Apply = async () => {
    await axios.post(`/api/apply/${SubmitterID}/${TaskID}`, {
      SubmitterID : SubmitterID,
      TaskID : TaskID 
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error){
      console.log(error);
    });
  };
  
  
  return (
    <div>
      <div className={styles.row_container}>
        <p>{task.taskName}</p>
        <p>{task.taskDesc}</p>
        <div>
          <button className={styles.row_button} onClick={() => Apply()}>
            참여신청
          </button>
        </div>
      </div>
    </div>
  );
};
