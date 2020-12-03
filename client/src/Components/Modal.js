import React from "react";
import styles from "../CSS/modal.module.css";

export const Modal = (setBool) => {
  return (
    <div className={styles.main_container}>
      <div className={styles.center}>
        <p>정말로 삭제하시겠습니까?</p>
        <div className={styles.btn_container}>
          <button onClick={() => setBool(true)}>예</button>
          <button onClick={() => setBool(false)}>아니요</button>
        </div>
      </div>
    </div>
  );
};