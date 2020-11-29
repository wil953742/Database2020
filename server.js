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

app.get('/api/sample1', (req, res) => {
    connection.query(
        "SELECT Name, Role, BirthDate, Gender, UserID \
        FROM ACCOUNT",
        (err, rows, fields) => {
            res.send(rows);
        }
    )
});
app.post('/api/signup', (req, res) => {
    
    let sql = "INSERT INTO ACCOUNT VALUES (null, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    let BirthDate = req.body.BirthDate;
    let UserID = req.body.UserID;
    let Phone = req.body.Phone;
    let Password = req.body.Password;
    let Name = req.body.Name;
    let Gender = req.body.Gender;
    let Address = req.body.Address;
    let Role = req.body.Role;
    let params = [BirthDate, UserID, Phone, Password, Name, Gender, Address, Role];

    console.log(UserID);
    console.log(Phone);
    console.log(Password);
    console.log(Role);
    connection.query(sql, params,
        (err, rows, fields) => {
            res.send(rows);
        })
})

app.listen(port, () => console.log(`Listening on port ${port}`));