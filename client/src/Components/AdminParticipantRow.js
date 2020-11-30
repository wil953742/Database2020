import Axios from "axios";
import React from "react";
import styles from "../CSS/component.module.css";

export const AdminParticipantRow = ({ reload, user, taskID, setReload }) => {
  const axios = require("axios").default;
  const Admit = async (admit) => {
    await axios
      .post("/api/userQueue/Admit", {
        AccountID: user.AccountID,
        newValue: admit,
        targetTaskID: taskID,
      })
      .then((res) => console.log(res));
    setReload(!reload);
  };
  return (
    <div className={styles.row_container}>
      <p>{user.name}</p>
      <p>{user.sex}</p>
      <p>{user.birth}</p>
      <p>{user.score}</p>
      {user.admit == 1 && <p>수락됨</p>}
      {user.admit == 0 && <p>거절됨</p>}
      {!user.admit && (
        <div className={styles.btn_row}>
          <button onClick={() => Admit(1)}>승인</button>
          <button onClick={() => Admit(0)}>거절</button>
        </div>
      )}
    </div>
  );
};
