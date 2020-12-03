const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
var multer = require('multer');
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
    `SELECT AccountID, Name, Gender, BirthDate, Score, Approval \
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

//submitter
app.get(`/api/submittedTasklist/1/:id`, (req, res) => { // 참여중
  const id = req.params.id;
  connection.query(
    `SELECT TASK.TaskID AS taskID, TASK.Name AS taskName, MAX(Turn) AS taskDate, Description AS taskDesc, Count(*) AS taskNum\
    FROM RAW_DATA_SEQUENCE_FILE,RAW_DATA_TYPE,TASK\
    WHERE RDSFSubmitterID=${id} AND BelongsRawDataTypeID=RawDataTypeID AND TaskID=CollectedTaskID\
    GROUP BY Name`,
    (err, rows, fields) => {
      res.send(rows);
    }
  );
});
app.get(`/api/submittedTasklist/2/:id`, (req, res) => { // 신청
  const id = req.params.id;
  connection.query(
    `SELECT TASK.TaskID AS taskID, TASK.Name AS taskName, TASK.Description AS taskDesc
    FROM TASK
    WHERE TaskID NOT IN (SELECT AppliedTaskID AS TaskID FROM APPLY WHERE AppliedSubmitterID=${id} ) ;`,
    (err, rows, fields) => {
      res.send(rows);
    }
  );
});
app.get(`/api/submittedTasklist/3/:id`, (req, res) => { // 대기
  const id = req.params.id;
  connection.query(
    `SELECT TASK.TaskID AS taskID, TASK.Name AS taskName, TASK.Description AS taskDesc\
    FROM TASK,APPLY\
    WHERE AppliedSubmitterID=${id} AND TASK.TaskID = APPLY.AppliedTaskID AND Approval=0`,
    (err, rows, fields) => {
      res.send(rows);
    }
  );
});

app.get(`/api/submittedTasklist/4/:sid/:tid`, (req, res) => { // 파일목록
  const sid = req.params.sid;
  const tid = req.params.tid;
  connection.query(
    `SELECT Direc AS fileName, QualityScore AS fileScore, RawDataTypeID AS fileType, Turn AS fileDate,PNP AS filePNP\
    FROM PARSING_DATA_SEQUENCE_FILE, QUALITY_TEST, RAW_DATA_TYPE, RAW_DATA_SEQUENCE_FILE \
    WHERE ParsingDataSequenceFileID=ParsingDataSequenceFileID2 AND RawDataSequenceFileID=BeforeRawDataSequenceFileID \
    AND RawDataTypeID=BelongsRawDataTypeID AND RDSFSubmitterID=${sid} AND CollectedTaskID=${tid}`,
    (err, rows, fields) => {
      res.send(rows);
    }
  );
});

app.post(`/api/apply/:SubmitterID/:TaskID`, (req, res) => {
  const SubmitterID = req.body.SubmitterID;
  const TaskID = req.body.TaskID;
  connection.query(
    `INSERT IGNORE INTO APPLY(AppliedSubmitterID, AppliedTaskID, Approval)
      VALUES(${SubmitterID}, ${TaskID}, 0);`,
    (err, rows, fields) => {
      res.send(rows);
    }
  );
});

app.post("/api/createTask", (req, res) => {
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

app.get(`/api/Estimator/:accountID/notYet`, (req, res) => {
  const accountID = req.params.accountID;
  connection.query(
    `SELECT ParsingDataSequenceFileID, CollectedTaskID, BelongsRawDataTypeID, RDSFSubmitterID, Turn, TotalTupleNum, DupTupleNum, NullRatio, QualityScore, Directory
      FROM PARSING_DATA_SEQUENCE_FILE, RAW_DATA_SEQUENCE_FILE, QUALITY_TEST, RAW_DATA_TYPE
      WHERE ParsingDataSequenceFileID in (
                    SELECT AssignedParsingDataSequenceFileID
                    FROM ASSIGN
                    WHERE EAccountID = "${accountID}")
        AND BeforeRawDataSequenceFileID = RawDataSequenceFileID
        AND ParsingDataSequenceFileID = ParsingDataSequenceFileID2
        AND BelongsRawDataTypeID = RawDataTypeID
        AND State=0;`,
        (err, rows, fields) => {
          res.send(rows);
        }
  );
});

app.get(`/api/Estimator/:accountID/finished`, (req, res) => {
  const accountID = req.params.accountID;
  connection.query(
    `SELECT ParsingDataSequenceFileID, CollectedTaskID, BelongsRawDataTypeID, RDSFSubmitterID, Turn, TotalTupleNum, DupTupleNum, NullRatio, QualityScore, Directory
      FROM PARSING_DATA_SEQUENCE_FILE, RAW_DATA_SEQUENCE_FILE, QUALITY_TEST, RAW_DATA_TYPE
      WHERE ParsingDataSequenceFileID in (
                    SELECT AssignedParsingDataSequenceFileID
                    FROM ASSIGN
                    WHERE EAccountID = "${accountID}")
        AND BeforeRawDataSequenceFileID = RawDataSequenceFileID
        AND ParsingDataSequenceFileID = ParsingDataSequenceFileID2
        AND BelongsRawDataTypeID = RawDataTypeID
        AND State=1;`,
        (err, rows, fields) => {
          res.send(rows);
        }
  );
});

app.post(`/api/Estimator/estimate/:ParsingDataSequenceFileID2`, (req, res) => {
  let sql =
  "UPDATE QUALITY_TEST \
  SET QualityScore = ?, \
      State = 1 \
  WHERE ParsingDataSequenceFileID2 = ?;";

  let QualityScore = req.body.QualityScore;
  let ParsingDataSequenceFileID2 = req.body.ParsingDataSequenceFileID;

  let params = [QualityScore, ParsingDataSequenceFileID2];
  connection.query(sql, params, (err, rows, fields) => {
    res.send(rows);
  });
});

var upload = multer({dest : 'uploads/'});


app.listen(port, () => console.log(`Listening on port ${port}`));
