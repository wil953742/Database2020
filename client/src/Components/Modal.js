import React from "react";
import styles from "../CSS/modal.module.css";

export const Modal = ({ setTogglaModal, setClickSignout }) => {
  return (
    <div className={styles.bg}>
      <div className={styles.main_container}>
        <div className={styles.center}>
          <p style={{ color: "gray", fontWeight: "bold" }}>
            정말로 삭제하시겠습니까?
          </p>
          <div className={styles.btn_container}>
            <button
              onClick={() => {
                setClickSignout(true);
                setTogglaModal(false);
              }}
            >
              예
            </button>
            <button onClick={() => setTogglaModal(false)}>아니요</button>
          </div>
        </div>
      </div>
    </div>
  );
};
