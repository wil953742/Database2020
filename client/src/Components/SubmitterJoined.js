import React from "react";
import styles from "../CSS/component.module.css";
import { Link } from "react-router-dom";

export const SubmitterJoined = ({task }) => {
  console.log(task);
  
  return (
    <div>
      <Link to={{ pathname: `/STaskView/${task.taskID}`, task : {task},
                  taskName: `${task.taskName}`,  
                  taskDesc: `${task.taskDesc}`
                }}>
        <div className={styles.row_container}>
          <p>{task.taskName}</p>
          <p>{task.taskDesc}</p>
          <p>{task.taskDate}</p>
          <p>{task.taskNum}</p>
        </div>
      </Link>
      
    </div>
  );
};
