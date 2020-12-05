import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import styles from "../CSS/loading.module.css";

export const Loading = () => {
  return (
    <div className={styles.main}>
      <CircularProgress />
    </div>
  );
};