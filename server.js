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

app.get("/api/AdminTask", (req, res) => {
  connection.query("SELECT * \
    FROM TASK", (err, rows, fields) => {
    res.send(rows);
  });
});

//태스크 생성 => (태스크 데이터 테이블, 원본 데이터 타입, 실제 태스크 데이터 테이블 생성)
app.post("/api/Admin/CreateTDT", (req, res) => {
  const Description = req.body.newTask.desc;
  const Period = req.body.newTask.period;
  const AllocatedTaskDataTableID = req.body.TDTId; 
  const PreTDTSchema = req.body.newTask.TDTSchema.list;
  const TaskDataTableSchema = JSON.stringify(PreTDTSchema); // object > toString 필요?
  const PassScore = req.body.newTask.passScore;
  const Name = req.body.newTask.name;
  //매핑정보와 속성 object로 받아지는데 어떻게 ?
  const PreRDTSchema = req.body.newTask.RDTSchema;
  const RawDataTypeSchema = JSON.stringify(PreRDTSchema[0].list ,['name', 'type']);
  const RawDataTypeName = PreRDTSchema[0].name;
  const RawDataTypeMappingInfo = JSON.stringify(PreRDTSchema[0].list , ['map']);
  
  console.log(Description, Period, TaskDataTableSchema, PassScore, Name);
  console.log(RawDataTypeSchema, "//" , RawDataTypeName, "//", RawDataTypeMappingInfo);

  connection.query(
    `INSERT IGNORE INTO TASK (TaskID, Description, Period, AllocatedTaskDataTableID, \
    TaskDataTableSchema, PassScore, Name) \
    VALUES (null, '${Description}', ${Period}, 1, \
    '${TaskDataTableSchema}', ${PassScore}, '${Name}');`,
    (err,rows,fields) => {
    if(err) {
      console.log(err);
    }
    res.send(rows);
  })
  
  //태스크 데이터 테이블
  let sqlForTaskDataTable = `INSERT INTO TASK_DATA_TABLE(TaskDataTableID, ResultParsingDataSequenceFileID, ResultTestID) \
  VALUES(null, null, null );`

  connection.query(sqlForTaskDataTable, (err,rows,fields) => {
    if(err){
      console.log(err);
    }
  })
  
  //원본 데이터 타입 RAW_DATA_TYPE ( 서버에 RawDataTypeName 추가하자 )
  let sqlForRawDataType = `INSERT INTO RAW_DATA_TYPE(RawDataTypeID, Schema_Info, TableMappingInfo, CollectedTaskID, RawDataTypeName) \
  VALUES(null, '${RawDataTypeSchema}', '${RawDataTypeMappingInfo}', 1, '${RawDataTypeName}');` 

  connection.query(sqlForRawDataType, (err,rows,fields) => {
    if(err){
      console.log(err);
    }
  })
//제이슨 파일 읽기 JSON.stringify(newTask.TDTSchema.list)
  
  //실제 값이 들어갈 태스크 데이터 테이블 생성 (+FOREIGN_KEY 설정)
  var colDefFront=`CREATE TABLE ${Name} ( ${Name}_KEY INT NOT NULL AUTO_INCREMENT, ${Name}_RawDataTypeID INT, SAccount_ID INT, SName VARCHAR(20), `;
  var colDefLast=`PRIMARY KEY(${Name}_KEY), FOREIGN KEY(SAccount_ID) REFERENCES ACCOUNT(AccountID) ON DELETE CASCADE ON UPDATE CASCADE, \
  FOREIGN KEY(${Name}_RawDataTypeID) REFERENCES RAW_DATA_TYPE(RawDataTypeID) ON DELETE CASCADE ON UPDATE CASCADE) ENGINE=InnoDB DEFAULT CHARSET=utf8;`

  for(var i=0; i<PreTDTSchema.length; i++){
    if(PreTDTSchema[i].maxLength){
      colDefFront = colDefFront.concat(PreTDTSchema[i].name+' '+PreTDTSchema[i].type+'('+PreTDTSchema[i].maxLength+'), ');

    } else{
    colDefFront = colDefFront.concat(PreTDTSchema[i].name+' '+PreTDTSchema[i].type+', ');
    }
  }

  colDefFront = colDefFront.concat(colDefLast);

  console.log("bot is sql");
  console.log(colDefFront);

  connection.query(colDefFront, (err,rows,fields) => {
    if(err){
      console.log(err);
    }
  })

});

/*
// 태스크 수정(원본 데이터 타입 추가)
app.post("/api/AdminEditRawDataType", (req, res) => {
  const RawDataTypeName = req.body.RDTName;
  const RawDataTypeSchema = req.body.RDTSchema;
  const RawDataTypeMappingInfo = req.body.RDTMappingInfo;
  //태스크 수정할 때 TaskID 변수명으로 해당 태스크 ID를 같이 넘겨줘야함 
  const CollectedTaskID = req.body.TaskID;
  let sqlForEditRawDataType = `SET FOREIGN_KEY_CHECKS = 0; \
  INSERT INTO Covid_Database.RAW_DATA_TYPE(RawDataTypeID, Schema_Info, TableMappingInfo, CollectedTaskID, RawDataTypeName) \
  VALUES(null, 'RawDataTypeSchema′,′{RawDataTypeMappingInfo}', CollectedTaskID,′{RawDataTypeName}'); \
  SET FOREIGN_KEY_CHECKS = 1;` 
  connection.query(sqlForEditRawDataType, (err,rows,fields) => {
    if(err){
      console.log(err);
    }
    res.send(rows);
  })
})*/

// 저장된 튜플 수 확인 (RDT 별로 확인)

// 태스크에 참여한 통계 정보 (제출자)

// 평가한 PDSF 목록 뷰 (평가자)



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

//submitter
app.get(`/api/submittedTasklist/1/:id`, (req, res) => { // 참여중
  const id = req.params.id;
  connection.query(
    `SELECT TaskID      AS  taskID, 
            TASK.Name   AS  taskName, 
            MAX(Turn)   AS  taskDate, 
            Description AS  taskDesc, 
            Count(*)    AS  taskNum

    FROM RAW_DATA_SEQUENCE_FILE,  RAW_DATA_TYPE,  TASK

    WHERE RDSFSubmitterID       =   ${id} 
      AND BelongsRawDataTypeID  =   RawDataTypeID 
      AND TaskID                =   CollectedTaskID

    GROUP BY Name`,
    (err, rows, fields) => {
      res.send(rows);
    }
  );
});
app.get(`/api/submittedTasklist/2/:id`, (req, res) => { // 신청
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
app.get(`/api/submittedTasklist/3/:id`, (req, res) => { // 대기
  const id = req.params.id;
  connection.query(
    `SELECT TaskID      AS taskID, 
            Name        AS taskName, 
            Description AS taskDesc

    FROM TASK,    APPLY

    WHERE AppliedSubmitterID  = ${id} 
      AND TaskID              = AppliedTaskID 
      AND Approval            = 0`,
    (err, rows, fields) => {
      res.send(rows);
    }
  );
});

app.get(`/api/submittedTasklist/4/:sid/:tid`, (req, res) => { // 파일목록
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

app.get(`/api/submittedTasklist/4/:tid`, (req, res) => { // 파일목록
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


app.post(`/api/apply/:SubmitterID/:TaskID`, (req, res) => { // 제출자가 특정 Task에 참가 신청 (APPLY)
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

app.get(`/api/RDTtypes`, (req, res) => {
  connection.query(
    `SELECT RawDataTypeID   AS value,
            RawDataTypeName AS label
    FROM RAW_DATA_TYPE`,
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

const multer = require('multer');
const { query } = require("express");
const upload = multer({dest : 'uploads'});

app.use('/uploads', express.static('uploads'));

app.post(`/api/file`, upload.single('myfile'), (req, res) => {
  let file = req.body.file;
  // console.log(file);
  // console.log(req.file);
  console.log(file);
  let sql = 'SELECT * FROM ACCOUNT;';
  connection.query(sql, (err, rows, fields) => {
    res.send(rows);
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));





