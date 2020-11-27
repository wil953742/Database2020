import React, { useState } from "react";
import styles from "../CSS/component.module.css";
import { Link } from "react-router-dom";

export const SubmitterNew = ({
  taskName,
  taskDesc,
}) => {
  const Apply = () => {
    
  };

  return (
    <div>
      <div className={styles.row_container}>
        <p>{taskName}</p>
        <p>{taskDesc}</p>
        <div>
          <button className={styles.row_button} onClick={() => Apply()}>
            참여신청
          </button>
        </div>
      </div>
    </div>
  );
};
