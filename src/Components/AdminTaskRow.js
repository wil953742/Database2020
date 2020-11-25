import React from "react";
import { Link } from "react-router-dom";

import styles from "../CSS/component.module.css";

export const AdminTaskRow = ({
  taskID,
  taskName,
  desc,
  period,
  waiting,
  participants,
}) => {
  return (
    <div>
      <Link to={{ pathname: `/TaskView/:${taskID}`, taskId: { taskID } }}>
        <div className={styles.row_container} style={{ cursor: "pointer" }}>
          <p>{taskName}</p>
          <p>{desc}</p>
          <p>{period}</p>
          <p>{waiting}</p>
          <p>{participants}</p>
          <div>
            <Link to={{ pathname: `/TaskEdit/:${taskID}`, taskId: { taskID } }}>
              <button className={styles.row_button}>수정</button>
            </Link>
          </div>
        </div>
      </Link>
    </div>
  );
};
