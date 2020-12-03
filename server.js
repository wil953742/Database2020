const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

app.get("/s_task", (req, res) => {
  connection.query("SELECT * FROM ACCOUNT", (err, rows, fields) => {
    res.send(rows);
  });
});
// ----- admin code ----------

// 관리자가 제출자 참여 여부 결정 
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
//관리자가 패스 점수 설정하는 경우
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
//관리자가 모든 태스크 불러오는 경우(태스크 관리)
app.get("/api/AdminTask", (req, res) => {
  connection.query("SELECT * \
    FROM TASK", (err, rows, fields) => {
    res.send(rows);
  });
});

//태스크 생성 => (태스크 데이터 테이블, 원본 데이터 타입, 실제 태스크 데이터 테이블 생성)
app.post("/api/AdminMakeTask", (req, res) => {
  const Description = req.body.desc;
  const Period = req.body.period;
  const AllocatedTaskDataTableID = req.body.TDTId; //삭제 후 auto increment로
  const TaskDataTableSchema = req.body.TDTSchema;
  const PassScore = req.body.passScore;
  const Name = req.body.name;
  //서버(+erd)에 RDTName, RDTSchema column 추가 필요 and 프론트에 RDTMappingInfo 변수 추가 필요 //원본데이터 타입 매핑 정보 추가
  const RawDataTypeName = req.body.RDTName;
  const RawDataTypeSchema = req.body.RDTSchema;
  const RawDataTypeMappingInfo = req.body.RDTMappingInfo;

  let sqlForTask = `SET FOREIGN_KEY_CHECKS = 0;\
  INSERT IGNORE INTO Covid_Database.TASK (TaskID, Description, Period, AllocatedTaskDataTableID, \
    TaskDataTableSchema, PassScore, Name, RawDataTypeSchema) \
  VALUES (null, '${Description}', ${Period}, ${AllocatedTaskDataTableID}, \
  '${TaskDataTableSchema}', ${PassScore}, '${Name}', '${RawDataTypeSchema}'); \
  SET FOREIGN_KEY_CHECKS = 1;`

  connection.query(sqlForTask, (err,rows,fields) => {
    if(err) {
      console.log(err);
    }
    res.send(rows);
  })

  //태스크 데이터 테이블 ( Value 값들 어떻게? )
  let sqlForTaskDataTable = `SET FOREIGN_KEY_CHECKS = 0; \
  INSERT INTO Covid_Database.TASK_DATA_TABLE(TaskDataTableID, ResultParsingDataSequenceFileID, ResultTestID) \
  VALUES(null, 여기 두 값 어떻게? ); \
  SET FOREIGN_KEY_CHECKS = 1;`

  connection.query(sqlForTaskDataTable, (err,rows,fields) => {
    if(err){
      console.log(err);
    }
    res.send(rows);
  })

  //원본 데이터 타입 RAW_DATA_TYPE ( 서버에 RawDataTypeName 추가하자, CollectedTaskID 는 auto_Incre로 바꾸기 )
  let sqlForRawDataType = `SET FOREIGN_KEY_CHECKS = 0; \
  INSERT INTO Covid_Database.RAW_DATA_TYPE(RawDataTypeID, Schema_Info, TableMappingInfo, CollectedTaskID, RawDataTypeName) \
  VALUES(null, '${RawDataTypeSchema}', '${RawDataTypeMappingInfo}', null, '${RawDataTypeName}'); \
  SET FOREIGN_KEY_CHECKS = 1;` 

  connection.query(sqlForRawDataType, (err,rows,fields) => {
    if(err){
      console.log(err);
    }
    res.send(rows);
  })

  //실제 값이 들어갈 태스크 데이터 테이블 생성 (+FOREIGN_KEY 설정)
  var colDefFront=`CREATE TABLE ${Name} ( ${NAME}_KEY INT NOT NULL AUTO_INCREMENT, RawDataTypeID INT AUTO_INCREMENT, `;
  var colDefLast=`PRIMARY KEY(${NAME}_KEY), FOREIGN KEY(${NAME}_KEY) REFERENCES TASK(Name) ON DELETE CASCADE ON UPDATE CASCADE, \
  FOREIGN KEY(RawDataTypeID) REFERENCES RAW_DATA_TYPE(RawDataTypeID) ON DELETE CASCADE ON UPDATE CASCADE);`

  for(var i=0; i<TaskDataTableSchema.length; i++){
    colDefFront = colDefFront.concat(TaskDataTableSchema[i].name+' '+TaskDataTableSchema[i].type+', ');
  }

  colDefFront = colDefFront.concat(colDefLast);

  connection.query(colDefFront, (err,rows,fields) => {
    if(err){
      console.log(err);
    }
    res.send(rows);
  })

});

// 태스크 수정(원본 데이터 타입 추가)

app.post("/api/AdminEditRawDataType", (req, res) => {

  const RawDataTypeName = req.body.RDTName;
  const RawDataTypeSchema = req.body.RDTSchema;
  const RawDataTypeMappingInfo = req.body.RDTMappingInfo;
  //태스크 수정할 때 TaskID 변수명으로 해당 태스크 ID를 같이 넘겨줘야함 
  const CollectedTaskID = req.body.TaskID;

  let sqlForEditRawDataType = `SET FOREIGN_KEY_CHECKS = 0; \
  INSERT INTO Covid_Database.RAW_DATA_TYPE(RawDataTypeID, Schema_Info, TableMappingInfo, CollectedTaskID, RawDataTypeName) \
  VALUES(null, '${RawDataTypeSchema}', '${RawDataTypeMappingInfo}', ${CollectedTaskID}, '${RawDataTypeName}'); \
  SET FOREIGN_KEY_CHECKS = 1;` 

  connection.query(sqlForEditRawDataType, (err,rows,fields) => {
    if(err){
      console.log(err);
    }
    res.send(rows);
  })
})

// 저장된 튜플 수 확인 (RDT 별로 확인)

// 태스크에 참여한 통계 정보 (제출자)


// 평가한 PDSF 목록 뷰 (평가자)


////////----------------------------------
app.get("/api/sample1", (req, res) => {
  connection.query(
    "SELECT AccountID, Name, Role, BirthDate, Gender, UserID \
        FROM ACCOUNT",
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

app.get(`/api/sample1/:category=:value`, (req, res) => {
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

app.get(`/api/sample1/:category&:value`, (req, res) => {
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
  let UserID = req.body.UserID;
  let Phone = req.body.Phone;
  let Password = req.body.Password;
  let Name = req.body.Name;
  let Gender = req.body.Gender;
  let Address = req.body.Address;
  let Role = req.body.Role;
  let clickSignout = req.body.clickSignout;

  console.log(clickSignout);
  let sql;

  if(clickSignout){
    sql= `DELETE FROM ACCOUNT WHERE UserID = '${UserID}'`;
  } else {
    sql =
    `UPDATE ACCOUNT \
    SET Password = '${Password}', \
    Address = '${Address}', \
    Phone = '${Phone}', \
    BirthDate = '${BirthDate}' \
    WHERE UserID = '${UserID}'`;
  }

    connection.query(sql,
    (err, rows, field) => {
      console.log(err);
      res.send(rows);
    })
    
})

app.listen(port, () => console.log(`Listening on port ${port}`));