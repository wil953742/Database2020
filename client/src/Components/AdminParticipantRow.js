import React from "react";
import { Link } from "react-router-dom";
import styles from "../CSS/component.module.css";
import SearchIcon from "@material-ui/icons/Search";
import IconButton from "@material-ui/core/IconButton";

export const AdminParticipantRow = ({
  user,
  taskID,
  setReload,
  reload,
  props,
}) => {
  console.log(user);
  const axios = require("axios").default;
  const Admit = async (admit) => {
    await axios
      .post("/api/userQueue/Admit", {
        AccountID: user.accountID,
        newValue: admit,
        targetTaskID: taskID,
      })
      .then((res) => {
        setReload(!reload);
      });
  };

  return (
    <div className={styles.row_container}>
      <p>{user.name}</p>
      <p>{user.sex}</p>
      <p>{user.birth}</p>
      <p>{user.score}</p>
      {user.admit == 1 && <p>수락됨</p>}
      {user.admit == 0 && <p>거절됨</p>}
      {!user.admit && (
        <div className={styles.btn_row}>
          <button onClick={() => Admit(1)}>승인</button>
          <button onClick={() => Admit(0)}>거절</button>
        </div>
      )}
      <div>
        <Link
          to={{
            pathname: `/UserDetail/${user.accountID}`,
            user: user,
            taskID: taskID,
            newProps: props,
          }}
        >
          <IconButton>
            <SearchIcon />
          </IconButton>
        </Link>
      </div>
    </div>
  );
};
