import React, { useState } from "react";
import styles from "../CSS/component.module.css";
import { Link } from "react-router-dom";

export const SubmitterWaiting = ({
  taskName,
  taskDesc,
}) => {
  
  return (
    <div>
      <div className={styles.row_container}>
        <p>{taskName}</p>
        <p>{taskDesc}</p>
        <div>
          <button className={styles.row_button}>
            승인 대기중
          </button>
        </div>
      </div>
    </div>
  );
};
