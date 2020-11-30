import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { AdminNav } from "../Components/AdminNav";
import { AdminUserRowNav } from "../Components/AdminUserRowNav";
import { AdminUserRow } from "../Components/AdminUserRow";
import styles from "../CSS/mainstyle.module.css";
import SearchIcon from "@material-ui/icons/Search";
import IconButton from "@material-ui/core/IconButton";
import { AdminUser } from "../Components/classes";
import { Loading } from "../Components/Loading";
import axios from "../axios";

const AdminUserMng = () => {
  var logInfo;
  var history = useHistory();
  const axios = require("axios").default;
  const [data, setData] = useState();
  const [userList, setUserList] = useState([]);
  const [text, setText] = useState("");
  const [url, setURL] = useState("/api/sample1");
  const loggedIn = localStorage.getItem("user");

  if (loggedIn) {
    logInfo = JSON.parse(loggedIn);
  } else {
    history.push("/");
  }

  const Search = () => {
    var source = document.getElementById("sources");
    var value = source.value;
    var input;
    if (value === "BirthDate") {
      input = calculateYear(text);
      setURL(`api/sample1/${value}&${input}`);
    } else if (value === "Gender") {
      input = text === "남자" ? 0 : 1;
      setURL(`api/sample1/${value}=${input}`);
    } else {
      if (value === "Role") {
        input = text === "제출자" ? "Submitter" : "Estimator";
      } else {
        input = text;
      }
      setURL(`api/sample1/${value}="${input}"`);
    }
  };

  const calculateAge = (year) => {
    return 2020 - parseInt(year);
  };

  const calculateYear = (age) => {
    return 2020 - parseInt(age);
  };

  useEffect(() => {
    async function fetchData() {
      console.log(url);
      await axios.get(url).then((res) => {
        console.log(res);
        setData(res.data);
      });
    }
    fetchData();
  }, [url]);

  useEffect(() => {
    if (!data) return;
    var list = [];
    for (var i = 0; i < data.length; i++) {
      list.push(
        new AdminUser(
          data[i].AccountID,
          data[i].Name,
          data[i].Role === "Submitter" ? "제출자" : "평가자",
          calculateAge(data[i].BirthDate.slice(0, 4)),
          data[i].Gender.data == 0 ? "남자" : "여자",
          data[i].UserID,
          []
        )
      );
    }
    setUserList(list);
  }, [data]);

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
              {userList.map((user) => (
                <AdminUserRow user={user} />
              ))}
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
              <option value="Name">이름</option>
              <option value="Role">역할</option>
              <option value="BirthDate">나이</option>
              <option value="Gender">성별</option>
              <option value="UserID">ID</option>
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
