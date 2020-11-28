import React from "react";
import styles from "../CSS/component.module.css";
import { Link } from "react-router-dom";

export const SubmitterJoined = ({
  taskID,
  taskName,
  taskDesc,
  taskDate,
  taskNum,
}) => {
  return (
    <div>
      <Link to={{ pathname: `/STaskView/:${taskID}`, taskID: { taskID },
        taskName:{taskName}, taskDesc:{taskDesc}, taskDate:{taskDate}, taskNum:{taskNum}}}>
        <div className={styles.row_container}>
          <p>{taskName}</p>
          <p>{taskDesc}</p>
          <p>{taskDate}</p>
          <p>{taskNum}</p>
        </div>
      </Link>
      
    </div>
  );
};
