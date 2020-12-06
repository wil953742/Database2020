import React, { useState } from "react";
import styles from "../CSS/component.module.css";
import { Link } from "react-router-dom";

export const SubmitterWaiting = ({task }) => {
  
  return (
    <div>
      <div className={styles.row_container}>
        <p>{task.taskName}</p>
        <p>{task.taskDesc}</p>
        <div>
          <button className={styles.row_button}>
            승인 대기중
          </button>
        </div>
      </div>
    </div>
  );
};
