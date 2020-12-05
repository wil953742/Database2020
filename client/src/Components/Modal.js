import React from "react";
import styles from "../CSS/modal.module.css";

export const Modal = () => {
  return (
    <div className={styles.main_container}>
      <div className={styles.center}>
        <p>정말로 삭제하시겠습니까?</p>
        <div className={styles.btn_container}>
          <button>예</button>
          <button>아니요</button>
        </div>
      </div>
    </div>
  );
};
