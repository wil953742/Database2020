class User {
  constructor(userID, ID, userType, name, sex, address, birthdate, phone, password) {
    this.userID = userID;
    this.ID = ID;
    this.userType = userType;
    this.name = name;
    this.sex = sex;
    this.address = address;
    this.birthdate = birthdate;
    this.phone = phone;
    this.password = password;
  }
}

class Record {
  constructor(
    PDSFID,
    taskName,
    taskType,
    submitter,
    turn,
    qt,
    score,
    directory
  ) {
    this.PDSFID = PDSFID;
    this.taskName = taskName;
    this.taskType = taskType;
    this.submitter = submitter;
    this.turn = turn;
    this.qt = qt;
    this.score = score;
    this.directory = directory;
  }
}

class QT {
  constructor(total_tup, dup_tup, null_ratio) {
    this.total_tup = total_tup;
    this.dup_tup = dup_tup;
    this.null_ratio = null_ratio;
  }
}

class AdminTask {
  constructor(taskID, desc, period, passScore) {
    this.taskID = taskID;
    this.desc = desc;
    this.period = period;
    this.passScore = passScore;
  }
}

class AdminUser {
  constructor(userID, name, type, age, sex, id, task) {
    this.userID = userID;
    this.name = name;
    this.type = type;
    this.age = age;
    this.sex = sex;
    this.id = id;
    this.task = task;
  }
}

class NewTask {
  constructor(name, desc, period, passScore, TDTSchema, RDTSchema) {
    this.name = name;
    this.desc = desc;
    this.period = period;
    this.passScore = passScore;
    this.TDTSchema = TDTSchema;
    this.RDTSchema = RDTSchema;
    //TDTid 추가 필요
  }
}

class TaskUser {
  constructor(AccountID, name, sex, birth, score, admit) {
    this.AccountID = AccountID;
    this.name = name;
    this.sex = sex;
    this.birth = birth;
    this.score = score;
    this.admit = admit;
  }
}

class Pair {
  constructor(name, type) {
    this.name = name;
    this.type = type;
  }
}

class SC {
  constructor(list) {
    this.list = list;
  }
}

class RSC extends SC {
  constructor(name, SC) {
    super(SC);
    this.name = name;
  }
}

export {
  TaskUser,
  User,
  Record,
  QT,
  AdminTask,
  AdminUser,
  Pair,
  SC,
  RSC,
  NewTask,
};