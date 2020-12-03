import React from "react";
import styles from "../CSS/component.module.css";
import SearchIcon from "@material-ui/icons/Search";
import IconButton from "@material-ui/core/IconButton";
import { Link } from "react-router-dom";

export const AdminUserRow = ({ user }) => {
  return (
    <div className={styles.row_container}>
      <p>{user.name}</p>
      <p>{user.type}</p>
      <p>{user.age}</p>
      <p>{user.sex}</p>
      <p>{user.userID}</p>
      {user.type === "제출자" && (
        <div className={styles.drop_down}>
          <button className={styles.row_button}>보기</button>
          <div className={styles.drop_down_content}>
            {user.task.map((item) => {
              return <p>{item}</p>;
            })}
          </div>
        </div>
      )}
      {!(user.type === "제출자") && <p> </p>}
      <div>
        <Link
          to={{
            pathname: `/UserDetail/${user.accountID}`,
            user: user,
            taskID: null,
            newProps: null,
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
