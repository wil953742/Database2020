const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

const data = fs.readFileSync('./database.json');
const conf = JSON.parse(data);
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: conf.host,
    user: conf.user,
    password: conf.password,
    port: conf.port,
    database: conf.database
});
connection.connect();

app.get('/s_task', (req, res) => {
    connection.query(
        "SELECT * FROM ACCOUNT",
        (err, rows, fields) => {
            res.send(rows);
        }
    );
});

var n = 1;
app.get(`/api/sample${n}`, (req, res) => {
    connection.query(
        `SELECT Name, Role, BirthDate, Gender, UserID FROM ACCOUNT WHERE AccountID=${n}`,
        (err, rows, fields) => {
            res.send(rows);
        }
        
    )
});

app.get('/api/signup', (req, res) => {
    res.send({[
        999,
        "gildong123",
        "평가자",
        "홍길동",
        "M",
        "서울 어딘가라능",
        "2000-01-01",
        "010-1234-1234",
    ]});
})

app.post('/api/signup', (req, res) => {
    let sql = "INSERT IGNORE INTO ACCOUNT(AccountID, BirthDate, UserID, Phone, Password, Name, Gender, Address, Role) \
    VALUES(null, ?, ?, ?, ?, ?, ?, ?, ?)";
    let userType = req.body.userType;
    let userID = req.body.userID;
    let password = req.body.password;
    let name = req.body.name;
    let sex = req.body.sex;
    let birthday = req.body.birthday;
    let address = req.body.address;
    let phone = req.body.phone;

    let params = [birthday, userID, phone, password, name, sex, address, userType];

    console.log(birthday);
    console.log(userID);
    console.log(phone);
    console.log(password);
    console.log(name);
    console.log(sex);
    console.log(address);
    console.log(userType);

    connection.query(sql, params,
        (err, rows, fields) => {
            res.send(rows);
        })
})

app.listen(port, () => console.log(`Listening on port ${port}`));