import React from "react";

import styles from "../CSS/component.module.css";

export const SubmitterTaskRow = ({
  fileName,
  fileScore,
  fileType,
  fileDate,
  filePNP,
}) => {
  return (
    <div>
        <div className={styles.row_container} style={{ cursor: "pointer" }}>
          <p>{fileName}</p>
          <p>{fileScore}</p>
          <p>{fileType}</p>
          <p>{fileDate}</p>
          <p>{filePNP}</p>
        </div>
    </div>
  );
};
