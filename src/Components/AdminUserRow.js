import React from "react";
import styles from "../CSS/component.module.css";

export const AdminUserRow = ({ user }) => {
  return (
    <div className={styles.row_container}>
      <p>{user.name}</p>
      <p>{user.type}</p>
      <p>{user.age}</p>
      <p>{user.sex}</p>
      <p>{user.id}</p>
      <div className={styles.drop_down}>
        <button className={styles.row_button}>보기</button>
        <div className={styles.drop_down_content}>
          {user.task.map((item) => {
            return <p>{item}</p>;
          })}
        </div>
      </div>
    </div>
  );
};
