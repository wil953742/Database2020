const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
// const cors = require("cors");
const app = express();
const port = process.env.PORT || 3023;

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: false }));

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

connection.connect({ multipleStatements: true });

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
  console.log(AccountID);
  console.log(newValue);
  console.log(newValue);
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
      WHERE RDT_ID = RawDataTypeID
      GROUP BY RawDataTypeName`;
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

//submitter
app.get(`/api/submittedTasklist/1/:id`, (req, res) => {
  // 참여중
  const id = req.params.id;
  var sql = `CREATE VIEW TMP AS
              SELECT TaskID, Name, Description
              FROM TASK
              WHERE TaskID IN (SELECT AppliedTaskID FROM APPLY 
                              WHERE AppliedSubmitterID = ${id} AND Approval = 1);

            SELECT
                TMP.TaskID                       AS taskID,
                TMP.Name                         AS taskName,
                TMP.Description                  AS taskDesc,
                MAX(Turn)                    AS taskDate,
                COUNT(RawDataSequenceFileID) AS taskNum

            FROM RAW_DATA_SEQUENCE_FILE, RAW_DATA_TYPE, TMP

            WHERE RDSFSubmitterID       = ${id}
              AND BelongsRawDataTypeID  = RawDataTypeID
              AND CollectedTaskID       = TaskID
              
            GROUP BY CollectedTaskID;

            DROP VIEW TMP;`;
  connection.query(sql, [1, 2, 3], function (err, results, fields) {
    if (!err) {
      res.send(results[1]);
    } else {
      console.log(err);
    }
  });
});

app.get(`/api/submittedTaskList/1/:id/a`, (req, res) => {
  const id = req.params.id;
  connection.query(
    `SELECT TaskID        AS  taskID,
            Name          AS  taskName,
            Description   AS  taskDesc
     FROM TASK
     WHERE TaskID IN (SELECT AppliedTaskID FROM APPLY
                      WHERE AppliedSubmitterID = ${id} AND Approval = 1);`,
    (err, rows, fields) => {
      res.send(rows);
    }
  );
});

app.get(`/api/submittedTaskList/1/:id/b`, (req, res) => {
  const id = req.params.id;
  connection.query(
    `SELECT CollectedTaskID              AS collectedTaskID,
            MAX(Turn)                    AS taskDate,
            COUNT(RawDataSequenceFileID) AS taskNum

     FROM RAW_DATA_SEQUENCE_FILE, RAW_DATA_TYPE
    
     WHERE RDSFSubmitterID       = ${id}
       AND BelongsRawDataTypeID  = RawDataTypeID
  
     GROUP BY CollectedTaskID;`,
    (err, rows, fields) => {
      res.send(rows);
    }
  );
});

app.get(`/api/submittedTasklist/2/:id`, (req, res) => {
  // 신청
  const id = req.params.id;
  connection.query(
    `SELECT TaskID      AS taskID, 
            Name        AS taskName, 
            Description AS taskDesc
    
    FROM TASK

    WHERE   TaskID NOT IN (SELECT AppliedTaskID AS TaskID 
                           FROM APPLY 
                           WHERE AppliedSubmitterID = ${id} 
                          );`,
    (err, rows, fields) => {
      res.send(rows);
    }
  );
});

app.get(`/api/submittedTasklist/3/:id`, (req, res) => {
  // 대기
  const id = req.params.id;
  connection.query(
    `SELECT TaskID      AS taskID, 
          Name        AS taskName, 
          Description AS taskDesc

  FROM TASK,    APPLY

  WHERE AppliedSubmitterID  = ${id} 
    AND TaskID              = AppliedTaskID 
    AND Approval            is null`,
    (err, rows, fields) => {
      res.send(rows);
    }
  );
});

app.get(`/api/submittedTasklist/4/:sid/:tid`, (req, res) => {
  // 파일목록
  const sid = req.params.sid;
  const tid = req.params.tid;
  connection.query(
    `SELECT Direc         AS fileName, 
            QualityScore  AS fileScore, 
            RawDataTypeID AS fileType, 
            Turn          AS fileDate,
            PNP           AS filePNP
    
    FROM PARSING_DATA_SEQUENCE_FILE, QUALITY_TEST, RAW_DATA_TYPE, RAW_DATA_SEQUENCE_FILE
    
    WHERE ParsingDataSequenceFileID = ParsingDataSequenceFileID2 
      AND RawDataSequenceFileID     = BeforeRawDataSequenceFileID 
      AND RawDataTypeID             = BelongsRawDataTypeID 
      AND RDSFSubmitterID           = ${sid} 
      AND CollectedTaskID           = ${tid}`,
    (err, rows, fields) => {
      res.send(rows);
    }
  );
});

app.get(`/api/submittedTasklist/4/:tid`, (req, res) => {
  // 파일목록
  const tid = req.params.tid;
  connection.query(
    `SELECT Name, Description
      FROM TASK
      WHERE TaskID = ${tid};`,
    (err, rows, fields) => {
      res.send(rows);
    }
  );
});

app.post(`/api/apply/:SubmitterID/:TaskID`, (req, res) => {
  // 제출자가 특정 Task에 참가 신청 (APPLY)
  const SubmitterID = req.body.SubmitterID;
  const TaskID = req.body.TaskID;
  connection.query(
    `INSERT IGNORE INTO APPLY(AppliedSubmitterID, AppliedTaskID, Approval)
      VALUES(${SubmitterID}, ${TaskID}, NULL);`,
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

app.post(
  `/api/Estimator/estimate/:ParsingDataSequenceFileID2/:tid`,
  (req, res) => {
    let sql = `UPDATE QUALITY_TEST \
    SET QualityScore = ?, State = 1 ,PNP = CASE WHEN QualityScore > (SELECT PassScore FROM TASK WHERE TaskID=?) THEN 1 ELSE 0 END\
    WHERE ParsingDataSequenceFileID2 = ? `;

    let tid = req.params.tid;
    let QualityScore = req.body.QualityScore;
    let ParsingDataSequenceFileID2 = req.body.ParsingDataSequenceFileID;

    let params = [QualityScore, tid, ParsingDataSequenceFileID2];
    connection.query(sql, params, (err, rows, fields) => {
      res.send(rows);
    });
  }
);

app.get(`/api/RDTtypes/:taskName`, (req, res) => {
  const taskName = req.params.taskName;
  connection.query(
    `SELECT RawDataTypeID   AS value,
            RawDataTypeName AS label
    FROM RAW_DATA_TYPE, TASK
    WHERE CollectedTaskID = TaskID
      AND Name            = '${taskName}';`,
    (err, rows, field) => {
      res.send(rows);
    }
  );
});
app.get(`/api/TRMap/:RDTID`, (req, res) => {
  const RDTID = req.params.RDTID;
  connection.query(
    `SELECT SchemaInfo AS Pair , 
      TableMappingInfo AS RPair 
      FROM RAW_DATA_TYPE WHERE RawDataTypeId = ${RDTID}`,
    (err, rows, fields) => {
      res.send(rows);
    }
  );
});

app.get(`/api/getLastRDSFID/:SubmitterID`, (req, res) => {
  const SubmitterID = req.params.SubmitterID;
  connection.query(
    `SELECT MAX(RawDataSequenceFileID)    AS LastRDSFID
     FROM RAW_DATA_SEQUENCE_FILE;`,
    (err, rows, field) => {
      res.send(rows);
    }
  );
});

app.get(`/api/test`, (req, res) => {
  connection.query(
    `SELECT SchemaInfo FROM RAW_DATA_TYPE`,
    (err, rows, field) => {
      res.send(rows);
    }
  );
});

const multer = require("multer");
const { query } = require("express");
const upload = multer({ dest: "uploads" });

app.use("/uploads", express.static("uploads"));

app.post(
  `/api/file/SubmitterID_:SubmitterID/:TaskName/RDTID_:RDTID`,
  upload.single("myfile"),
  (req, res) => {
    // POST 함수로 데이터를 받아와서 필요한 정보들을 추출한다
    const SubmitterID = req.body.SubmitterID;
    const TaskName = req.body.TaskName;
    const RDTID = req.body.RDTID;
    const RDSFID = req.body.RDSFID;
    const file = req.body.file;

    // 날짜, 파일명, 파일 경로 등을 생성한다
    var date = new Date();
    date =
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

    var filename = `SubmitterID_${SubmitterID}_${TaskName}_RDTID_${RDTID}_RSDFID_${RDSFID}.txt`;
    var filePath = "uploads/" + filename;

    // Raw Data Sequence File을 제출하면 DB의 RAW_DATA_SEQUENCE_FILE에 row가 추가된다
    let sql = `INSERT INTO RAW_DATA_SEQUENCE_FILE
                          (RawDataSequenceFileID, RDSFSubmitterID, BelongsRawDataTypeID, Directory, Turn)
              VALUES(null, ${SubmitterID}, ${RDTID}, "${filePath}", "${date}")`;

    connection.query(sql, (err, rows, fields) => {
      res.send(rows);
    });
    // 파싱한다

    // 파싱한 데이터를 uploads 폴더에 저장한다
    var writeFile = fs.createWriteStream(filePath);
    writeFile.on("error", function (err) {
      console.log(err);
    });
    file.forEach((v) => writeFile.write(JSON.stringify(v) + ",\n"));
    writeFile.end();
  }
);

app.post(`/api/file/RDSF`, upload.single("myfile"), (req, res) => {
  let SubmitterID = req.body.SubmitterID;
  let RawDataType = req.body.RawDataType;

  let sql =
    'INSERT INTO RAW_DATA_SEQUENCE_FILE VALUE (null,?,?,"Direc",NOW()) ';
  let params = [SubmitterID, RawDataType];
  connection.query(sql, params, (err, rows, fields) => {
    res.send(rows);
  });
});

app.post(`/api/file/PDSF`, upload.single("myfile"), (req, res) => {
  let SubmitterID = req.body.SubmitterID;
  let RawDataType = req.body.RawDataType;

  let sql =
    'INSERT INTO PARSING_DATA_SEQUENCE_FILE VALUE (null,?,?,?,?,"Direc") ';
  let params = [SubmitterID, RawDataType];
  connection.query(sql, params, (err, rows, fields) => {
    res.send(rows);
  });
});

////////////////12.06.0700 PDSF&QT&ASSIGN
app.post("/api/assign/:pid/:qid", (req, res) => {
  let pid = req.params.pid;
  let qid = req.params.qid;
  connection.query(
    `INSERT INTO ASSIGN SELECT ${pid} AS APDSFID,EstimatorID,${qid} AS QTESTID 
  FROM ESTIMATOR ORDER BY RAND() LIMIT 1;`,
    (err, rows, fields) => {
      res.send(rows);
    }
  );
});

app.post("/api/addQT/:pID", (req, res) => {
  let pID = req.params.pID;
  connection.query(
    `INSERT INTO QUALITY_TEST SELECT ${pID},MAX(TestID)+1,null,0,0 
      FROM QUALITY_TEST;`,
    (err, rows, fields) => {
      res.send(rows);
    }
  );
});

app.get(`/api/getPDSFID/:rdsfid`, (req, res) => {
  let rdsfid = req.params.rdsfid;

  //   console.log(sid);
  // console.log(rdtid);

  connection.query(
    `SELECT ParsingDataSequenceFileID AS PDSFID
      FROM PARSING_DATA_SEQUENCE_FILE
      WHERE BeforeRawDataSequenceFileID=${rdsfid}`,
    (err, rows, fields) => {
      console.log(rows);
      res.send(rows);
    }
  );
});

app.post("/api/parse/:rdsfid", (req, res) => {
  let rdsfid = req.params.rdsfid;
  console.log(rdsfid);
  connection.query(
    `INSERT INTO PARSING_DATA_SEQUENCE_FILE 
    VALUE (null,${rdsfid},null,null,null,'')`,
    (err, rows, fields) => {
      res.send(rows);
    }
  );
});

app.get(`/api/getQTESTID/:pid`, (req, res) => {
  let pid = req.params.pid;
  console.log(pid);
  connection.query(
    `SELECT TestID FROM QUALITY_TEST WHERE ParsingDataSequenceFileID2=${pid}`,
    (err, rows, fields) => {
      res.send(rows);
    }
  );
});

app.listen(port, "165.132.105.46", () =>
  console.log(`Listening on port ${port}`)
);
