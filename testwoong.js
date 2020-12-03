class Pair2 {
    constructor(name, type) {
      this.name = name;
      this.type = type;
    }
}

let first = new Pair2('key', 'int');
let second = new Pair2('desc', 'CHAR');
let third = new Pair2('name', 'VARCHAR');

const testArr = [first, second, third];

var colStr = 'CREATE TABLE NAME (';

for(var i=0; i<testArr.length; i++){
    console.log(testArr[i].name);
    colStr = colStr.concat(testArr[i].name+' '+testArr[i].type+',');
}

console.log();
console.log(colStr);

CREATE TABLE {NAME}(
    {NAME}_KEY  INT  NOT NULL  AUTO INCREMENT,
    
    "{c.Name} {c.Type} ,"
    
    
    NO_EMP VARCHAR(10),
    NM_KOR VARCHAR(40),
    AGE         INT                     NULL DEFAULT (0),
    PRIMARY KEY({NAME}_KEY),
    FOREIGN KEY ({NAME}_KEY),
    REFERENCES TASK (TaskD)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    