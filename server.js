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
const { Console } = require("console");
const { response } = require("express");

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

app.get("/api/secret/:AccountID", (req, res) => {
  const accountID = req.params.AccountID;
  connection.query(
    `SELECT * FROM ACCOUNT WHERE AccountID =${accountID}`,
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

app.get("/api/AdminTask", (req, res) => {
  connection.query("SELECT * \
    FROM TASK", (err, rows, fields) => {
    res.send(rows);
  });
});

app.get("/api/NewTask/:Name", (req, res) => {
  const name = req.params.Name;
  connection.query(
    `SELECT COUNT(*) AS N FROM TASK WHERE Name="${name}"`,
    (err, rows, fields) => {
      res.send(rows);
    }
  );
});

app.get("/api/DownloadTask/:taskID", (req, res) => {
  const taskID = req.params.taskID;
  const getTDTName = () => {
    return new Promise((res, rej) => {
      connection.query(
        `SELECT TDTName FROM TASK WHERE TaskID=${taskID}`,
        (err, rows, fields) => {
          res(rows);
        }
      );
    });
  };
  getTDTName().then((response) => {
    const TDTName = response[0].TDTName;
    connection.query(`SELECT * FROM ${TDTName}`, (err, rows, fields) => {
      if (err) console.log(err);
      res.send(rows);
    });
  });
});

//태스크 생성 => (태스크 데이터 테이블, 원본 데이터 타입, 실제 태스크 데이터 테이블 생성)
app.post("/api/Admin/CreateTask", (req, res) => {
  const newTask = req.body.newTask;

  // 1. Create New Task Row
  const insert_task_sql = `INSERT IGNORE INTO TASK (TaskID, Name, Description, Period, AllocatedTaskDataTableID, \
    TDTName, TaskDataTableSchema, PassScore) \
    VALUES (null, '${newTask.name}', '${newTask.desc}', ${newTask.period}, 1, \
    '${newTask.name}','${JSON.stringify(newTask.TDTSchema.list)}', ${
    newTask.passScore
  })`;

  connection.query(insert_task_sql, (err, rows, fields) => {
    if (err) console.log(err);
    res.send(rows);
  });

  // Function to get newly created taskID
  const getNewTaskID = () => {
    return new Promise((res, rej) => {
      connection.query(
        `SELECT TaskID FROM TASK WHERE Name='${newTask.name}'`,
        (err, rows, fields) => {
          res(rows);
        }
      );
    });
  };

  // If got taskID, do the rest of the work
  getNewTaskID().then((res) => {
    const newTaskID = res[0].TaskID;

    // 2. Create New Raw Data Type
    const RDTSchema = newTask.RDTSchema;
    for (var i = 0; i < newTask.RDTSchema.length; i++) {
      let insert_rdt_sql = `INSERT IGNORE INTO RAW_DATA_TYPE (RawDataTypeID, SchemaInfo, TableMappingInfo, CollectedTaskID, RawDataTypeName) \
      VALUES (null, '${JSON.stringify(RDTSchema[i].list)}', '${JSON.stringify(
        newTask.RDTSchema[i].list
      )}', ${newTaskID}, '${RDTSchema[i].name}')`;
      connection.query(insert_rdt_sql, (err, rows, fields) => {
        if (err) console.log(err);
      });
    }
    // 3. Create New Task Data Table
    var create_TDT_sql = `CREATE TABLE ${newTask.name} \
    (ID INT NOT NULL AUTO_INCREMENT, \
      Submitter_ID INT NOT NULL, \
      Submitter_name VARCHAR(20) NOT NULL,\
      RDT_ID INT NOT NULL,`;

    for (var i = 0; i < newTask.TDTSchema.list.length; i++) {
      if (newTask.TDTSchema.list[i].maxLength) {
        create_TDT_sql = create_TDT_sql.concat(
          newTask.TDTSchema.list[i].name +
            " " +
            newTask.TDTSchema.list[i].type +
            "(" +
            newTask.TDTSchema.list[i].maxLength +
            "), "
        );
      } else {
        create_TDT_sql = create_TDT_sql.concat(
          newTask.TDTSchema.list[i].name +
            " " +
            newTask.TDTSchema.list[i].type +
            ", "
        );
      }
    }

    const restriction = `PRIMARY KEY (ID), FOREIGN KEY (Submitter_ID) REFERENCES ACCOUNT(AccountID) ON DELETE CASCADE ON UPDATE CASCADE, \
    FOREIGN KEY (RDT_ID) REFERENCES RAW_DATA_TYPE(RawDataTypeID) ON DELETE CASCADE ON UPDATE CASCADE) ENGINE=InnoDB DEFAULT CHARSET=utf8;`;

    create_TDT_sql = create_TDT_sql.concat(restriction);

    connection.query(create_TDT_sql, (err, rows, fields) => {
      if (err) console.log(err);
    });
  });
});

app.get("/api/TaskDataTable/:taskID", (req, res) => {
  const taskID = req.params.taskID;
  let sql = `SELECT TaskDataTableSchema FROM TASK WHERE TaskID=${taskID}`;
  connection.query(sql, (err, rows, fields) => {
    res.send(rows);
  });
});

app.post("/api/UpdateRDT", (req, res) => {
  const taskID = req.body.taskID;
  const newRDT = req.body.newRDT;
  let sql = `INSERT IGNORE INTO RAW_DATA_TYPE VALUES (NULL, '${JSON.stringify(
    newRDT.list
  )}', '${JSON.stringify(newRDT.list)}', ${taskID}, '${newRDT.name}')`;
  connection.query(sql, (err, rows, fields) => {
    res.send(rows);
  });
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

app.get("/api/taskQueue/:taskID", (req, res) => {
  const taskID = req.params.taskID;
  connection.query(
    `SELECT RawDataTypeName AS RDTName, COUNT(RawDataSequenceFileID) AS totalSub, SUM(TotalTupleNum) AS totalTupNum
     FROM RAW_DATA_TYPE, RAW_DATA_SEQUENCE_FILE, PARSING_DATA_SEQUENCE_FILE
     WHERE
     ${taskID} = CollectedTaskID AND
     RawDataTypeID = BelongsRawDataTypeID AND
     RawDataSequenceFileID = BeforeRawDataSequenceFileID 
     GROUP BY RawDataTypeName
     ;`,
    (err, rows, field) => {
      if (err) {
        console.log(err);
      }
      res.send(rows);
    }
  );
});

app.get("/api/GetTuple/:taskID", (req, res) => {
  const taskID = req.params.taskID;
  const getTDTName = () => {
    return new Promise((res, rej) => {
      connection.query(
        `SELECT TDTName FROM TASK WHERE TaskID=${taskID}`,
        (err, rows, fields) => {
          res(rows);
        }
      );
    });
  };
  getTDTName().then((response) => {
    const TDTName = response[0].TDTName;
    let sql = `SELECT RawDataTypeName AS RDTName, COUNT(RDT_ID) AS totalSub\
      FROM ${TDTName}, RAW_DATA_TYPE\
      WHERE RDT_ID = RawDataTypeID`;
    connection.query(sql, (err, rows, fields) => {
      res.send(rows);
    });
  });
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
    sql = `SELECT TaskID AS name, COUNT(*) AS totalSub, round(AVG(TotalTupleNum),2) AS avgTup, 
          round(AVG(DupTupleNum),2) AS avgDup, round(AVG(NullRatio),2) AS avgNullRatio, SUM(TotalTupleNum) AS saveTup
            FROM APPLY, TASK, RAW_DATA_TYPE, RAW_DATA_SEQUENCE_FILE, PARSING_DATA_SEQUENCE_FILE
            WHERE AppliedSubmitterID = ${accountID} AND 
            AppliedTaskID = TaskID AND
            TaskID = CollectedTaskID AND
            RawDataTypeID = BelongsRawDataTypeID AND
            RawDataSequenceFileID = BeforeRawDataSequenceFileID 
            GROUP BY TaskID`;
  }
  if (type === "평가자") {
    sql = `SELECT ParsingDataSequenceFileID AS ID, TotalTupleNum AS totalTup, DupTupleNum AS dupTup,
           NullRatio AS nullRatio, Direc AS directory, QualityScore AS score
            FROM PARSING_DATA_SEQUENCE_FILE, ASSIGN, QUALITY_TEST
            WHERE EAccountID = ${accountID} AND 
            ParsingDataSequenceFileID = ParsingDataSequenceFileID2 AND
            (AssignedParsingDataSequenceFileID, QTestID) = (ParsingDataSequenceFileID2, TestID)`;
  }

  connection.query(sql, (err, rows, field) => {
    console.log(err);
    console.log("Data of Content : ", rows);
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
    console.log("Data of main : ", rows);
    res.send(rows);
    console.log(err);
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
