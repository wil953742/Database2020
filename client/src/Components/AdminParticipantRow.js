import Axios from "axios";
import React from "react";
import styles from "../CSS/component.module.css";

export const AdminParticipantRow = ({ user }) => {
  const Admit = (admit) => {};
  return (
    <div className={styles.row_container}>
      <p>{user.name}</p>
      <p>{user.sex}</p>
      <p>{user.birth}</p>
      <p>{user.score}</p>
      {user.admit && <p>수락됨</p>}
      {!user.admit && (
        <div className={styles.btn_row}>
          <button onClick={() => Admit(true)}>승인</button>
          <button onClick={() => Admit(false)}>거절</button>
        </div>
      )}
    </div>
  );
};
