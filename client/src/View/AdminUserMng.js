import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { AdminNav } from "../Components/AdminNav";
import { AdminUserRowNav } from "../Components/AdminUserRowNav";
import { AdminUserRow } from "../Components/AdminUserRow";
import styles from "../CSS/mainstyle.module.css";
import SearchIcon from "@material-ui/icons/Search";
import IconButton from "@material-ui/core/IconButton";

const AdminUserMng = () => {
  var user = {
    name: "홍길동",
    type: "제출자",
    age: 22,
    sex: "M",
    id: "gildong123",
    task: ["task1", "task2", "task3"],
  };
  const [category, setCategory] = useState("");
  const [text, setText] = useState("");

  var logInfo;
  var history = useHistory();
  const loggedIn = localStorage.getItem("user");
  if (loggedIn) {
    logInfo = JSON.parse(loggedIn);
  } else {
    history.push("/");
  }

  const Search = () => {
    var source = document.getElementById("sources");
    var value = source.value;

    // Find matching users with value and text
  };

  return (
    <div>
      <AdminNav
        userType={"관리자"}
        name={logInfo.name}
        userID={logInfo.userID}
      />
      <div className={styles.center_all}>
        <h2 className={styles.list_title}>회원 목록</h2>
        <div className={styles.main_container}>
          <div className={styles.sub_container_1}>
            <AdminUserRowNav />
            <div className={styles.scrollable_div}>
              <AdminUserRow user={user} />
              <AdminUserRow user={user} />
            </div>
          </div>
        </div>
        <div className={styles.last_row}>
          <div>
            <select
              name="sources"
              id="sources"
              className={`${styles.custom_select} ${styles.sources}`}
              placeholder="검색 옵션: "
            >
              <option value="0">검색 옵션:</option>
              <option value="name">이름</option>
              <option value="type">역할</option>
              <option value="age">나이</option>
              <option value="sex">성별</option>
              <option value="id">ID</option>
              <option value="task">참여태스크</option>
            </select>
          </div>
          <div>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          <div>
            <IconButton onClick={() => Search()}>
              <SearchIcon className={styles.search_button} />
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserMng;
