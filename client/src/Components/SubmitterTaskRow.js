import React from "react";

import styles from "../CSS/component.module.css";

export const SubmitterTaskRow = ({ task}, {loginfo}) => {


  return (
    <div>
        <div className={styles.row_container} style={{ cursor: "pointer" }}>
          <p>{task.fileName}</p>
          <p>{task.fileScore}</p>
          <p>{task.fileType}</p>
          <p>{task.fileDate}</p>
          <p>{task.filePNP}</p>
        </div>
    </div>
  );
};
