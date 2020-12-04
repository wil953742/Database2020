const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
// const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cors);

const data = fs.readFileSync("./database.json");
const conf = JSON.parse(data);
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: conf.host,
  user: conf.user,
  password: conf.password,
  port: conf.port,
  database: conf.database,
});

connection.connect();

app.get("/api/loginAuth/:id&:password", (req, res) => {
  const id = req.params.id;
  const pw = req.params.password;
  connection.query(
    `SELECT * \
        FROM ACCOUNT \
        WHERE UserID = "${id}" AND Password="${pw}"`,
    (err, rows, fields) => {
      res.send(rows);
    }
  );
});

app.post("/api/userQueue/Admit", (req, res) => {
  const AccountID = req.body.AccountID;
  const newValue = req.body.newValue;
  const targetTaskID = req.body.targetTaskID;
  connection.query(
    `UPDATE APPLY \
      SET Approval = ${newValue} \
      WHERE AppliedSubmitterID = ${AccountID} AND AppliedTaskID = ${targetTaskID};`,
    (err, rows, fields) => {
      res.send(rows);
    }
  );
});

app.post("/api/AdminTask/SetScore", (req, res) => {
  const taskID = req.body.taskID;
  const newValue = req.body.newValue;
  connection.query(
    `UPDATE TASK \
        SET PassScore = ${newValue} \
        WHERE TaskID = ${taskID}`,
    (err, rows, fields) => {
      res.send(rows);
    }
  );
});

app.post("/api/Admin/CreateTDT", (req, res) => {
  const list = req.body.list;
  console.log(list);
});

app.get("/api/userList", (req, res) => {
  connection.query(
    "SELECT AccountID, Name, Role, BirthDate, Gender, UserID \
        FROM ACCOUNT",
    (err, rows, fields) => {
      res.send(rows);
    }
  );
});

app.get("/api/userTask", (req, res) => {
  connection.query(
    "SELECT AppliedSubmitterID, Name\
    FROM APPLY, TASK\
    WHERE Approval=1 AND AppliedTaskID = TaskID",
    (err, rows, fields) => {
      res.send(rows);
    }
  );
});

app.get("/api/userList/task/:taskName", (req, res) => {
  const taskName = req.params.taskName;
  let url = `SELECT AccountID, A.Name, Role, BirthDate, Gender, UserID, T.Name\
  FROM TASK AS T, ACCOUNT AS A, APPLY\
  WHERE AccountID = AppliedSubmitterID AND TaskID = AppliedTaskID AND APPROVAL=1 AND T.Name = "${taskName}"`;
  connection.query(url, (err, rows, fields) => {
    res.send(rows);
  });
});

app.get(`/api/userList/:category=:value`, (req, res) => {
  const category = req.params.category;
  const value = req.params.value;
  connection.query(
    `SELECT AccountID, Name, Role, BirthDate, Gender, UserID \
        FROM ACCOUNT\
        WHERE ${category} = ${value}`,
    (err, rows, fields) => {
      res.send(rows);
    }
  );
});

app.get(`/api/userList/:category&:value`, (req, res) => {
  const category = req.params.category;
  const value = req.params.value;
  connection.query(
    `SELECT AccountID, Name, Role, BirthDate, Gender, UserID \
        FROM ACCOUNT\
        WHERE ${category} LIKE "%${value}%"`,
    (err, rows, fields) => {
      res.send(rows);
    }
  );
});

app.get("/api/userQueue/:taskID", (req, res) => {
  const taskId = req.params.taskID;
  connection.query(
    `SELECT AccountID, Name, Role, Gender, BirthDate, Score, Approval \
    FROM ACCOUNT, SUBMITTER, APPLY \
    WHERE AppliedTaskID = ${taskId} AND AppliedSubmitterID = SubmitterID and AccountID = SubmitterID`,
    (err, rows, fields) => {
      res.send(rows);
    }
  );
});

app.get("/api/AdminTask", (req, res) => {
  connection.query("SELECT * \
    FROM TASK", (err, rows, fields) => {
    res.send(rows);
  });
});

app.get("/api/loginAuth/:id&:password", (req, res) => {
  const id = req.params.id;
  const pw = req.params.password;
  connection.query(
    `SELECT * \
        FROM ACCOUNT \
        WHERE UserID = "${id}" AND Password="${pw}"`,
    (err, rows, fields) => {
      res.send(rows);
    }
  );
});
app.get("/api/loginAuth/:id&:password", (req, res) => {
  const id = req.params.id;
  const pw = req.params.password;
  connection.query(
    `SELECT * \
        FROM ACCOUNT \
        WHERE UserID = "${id}" AND Password="${pw}"`,
    (err, rows, fields) => {
      res.send(rows);
    }
  );
});
app.get("/api/loginAuth/:id&:password", (req, res) => {
  const id = req.params.id;
  const pw = req.params.password;
  connection.query(
    `SELECT * \
        FROM ACCOUNT \
        WHERE UserID = "${id}" AND Password="${pw}"`,
    (err, rows, fields) => {
      res.send(rows);
    }
  );
});

app.get("/api/signup/:id", (req, res) => {
  const id = req.params.id;
  connection.query(
    `SELECT *
    FROM ACCOUNT
    WHERE UserID = "${id}"`,
    (err, rows, fields) => {
      res.send(rows);
    }
  );
});

app.post("/api/signup", (req, res) => {
  let sql =
    "INSERT IGNORE INTO ACCOUNT(AccountID, BirthDate, UserID, Phone, Password, Name, Gender, Address, Role) \
    VALUES(null, ?, ?, ?, ?, ?, ?, ?, ?)";
  let BirthDate = req.body.BirthDate;
  let UserID = req.body.UserID;
  let Phone = req.body.Phone;
  let Password = req.body.Password;
  let Name = req.body.Name;
  let Gender = req.body.Gender;
  let Address = req.body.Address;
  let Role = req.body.Role;

  console.log(BirthDate);
  let params = [
    BirthDate,
    UserID,
    Phone,
    Password,
    Name,
    Gender,
    Address,
    Role,
  ];
  connection.query(sql, params, (err, rows, fields) => {
    res.send(rows);
  });
});

app.post("/api/editUserInfo", (req, res) => {
  let BirthDate = req.body.BirthDate;
  let AccountID = req.body.AccountID;
  let Phone = req.body.Phone;
  let Password = req.body.Password;
  let Name = req.body.Name;
  let Gender = req.body.Gender;
  let Address = req.body.Address;
  let Role = req.body.Role;
  let clickSignout = req.body.clickSignout;
  let sql;

  if (clickSignout) {
    sql = `DELETE FROM ACCOUNT WHERE AccountID = ${AccountID}`;
  } else if (Password) {
    sql = `UPDATE ACCOUNT \
    SET Password = '${Password}', \
    Address = '${Address}', \
    Phone = '${Phone}', \
    BirthDate = '${BirthDate}' \
    WHERE AccountID = ${AccountID}`;
  } else {
    sql = `UPDATE ACCOUNT \
    SET Address = '${Address}', \
    Phone = '${Phone}', \
    BirthDate = '${BirthDate}' \
    WHERE AccountID = ${AccountID}`;
  }

  connection.query(sql, (err, rows, field) => {
    console.log(err);
    res.send(rows);
  });
});

app.get("/api/UserDetail/content/:type/:accountID", (req, res) => {
  const type = req.params.type;
  const accountID = req.params.accountID;
  let sql;
  if (type === "제출자") {
    sql = ``;
  }
  if (type === "평가자") {
    sql = `SELECT ParsingDataSequenceFileID AS PDSFID, TotalTupleNum, DupTupleNum, NullRatio, Direc, QualityScore AS Score
            FROM PARSING_DATA_SEQUENCE_FILE, ASSIGN, QUALITY_TEST
            WHERE EAccountID = ${accountID} AND 
            AssignedParsingDataSequenceFileID = ParsingDataSequenceFileID AND
            ParsingDataSequenceFileID2 = AssignedParsingDataSequenceFileID`;
  }

  connection.query(sql, (err, rows, field) => {
    console.log(err);
    res.send(rows);
  });
});

app.get("/api/UserDetail/main/:type/:accountID", (req, res) => {
  const type = req.params.type;
  const accountID = req.params.accountID;
  let sql;
  if (type === "평가자") {
    sql = `SELECT Name, \
      (SELECT COUNT(*) AS Total_File FROM ASSIGN WHERE EAccountID = ${accountID}) AS Total_File, \
      (SELECT COUNT(*) AS Total_Queue FROM QUALITY_TEST, ASSIGN WHERE EAccountID = ${accountID} AND \
      (AssignedParsingDataSequenceFileID, QTestID) = (ParsingDataSequenceFileID2, TestID) \
      AND STATE = 0) AS Total_Queue \
      FROM ACCOUNT\
      WHERE AccountID = ${accountID}`;
  }
  if (type === "제출자") {
    sql = `SELECT Score, 
      (SELECT COUNT(*) FROM RAW_DATA_SEQUENCE_FILE WHERE RDSFSubmitterID = ${accountID}) AS Total_Sub,\
      (SELECT COUNT(*) FROM APPLY WHERE AppliedSubmitterID=${accountID}) AS Part_Num\
      FROM SUBMITTER \
      WHERE SubmitterID = ${accountID}`;
  }
  connection.query(sql, (err, rows, field) => {
    res.send(rows);
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
