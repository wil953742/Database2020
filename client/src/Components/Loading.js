import React from "react";
import styles from "../CSS/component.module.css";

import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

export const Loading = () => {
  return (
    <div className={styles.loading}>
      <CircularProgress style={{ color: "black" }} />
    </div>
  );
};
