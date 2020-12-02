import React from "react";
import { Link } from "react-router-dom";

import styles from "../CSS/component.module.css";

export const AdminTaskRow = ({ task }) => {
  return (
    <div>
      <Link to={{ pathname: `/TaskView/:${task.taskID}`, task: task }}>
        <div className={styles.row_container} style={{ cursor: "pointer" }}>
          <p>{task.name}</p>
          <p style={{ fontSize: "10px", flexGrow: "2" }}>{task.desc}</p>
          <p>{task.period}</p>
          <p>{task.passScore}</p>
          <div>
            <Link to={{ pathname: `/TaskEdit/:${task.taskID}`, task: task }}>
              <button className={styles.row_button}>수정</button>
            </Link>
          </div>
        </div>
      </Link>
    </div>
  );
};
