require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mysql = require('mysql2');

const port = process.env.PORT; // 백엔드 포트는 4001로 설정

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

connection.connect((err) => {
    if (err) {
        console.error('MySQL 연결 실패: ', err);
        return;
    }
    console.log('MySQL 연결 성공!');
});

app.use(cors());

app.listen(port, () => {
    console.log(`Backend server is running on http://localhost:${port}`);
});

app.get('/api/data', (req, res) => {
    connection.query('SELECT * FROM oneline_list', (err, result, fields) => {
        if (err) {
            res.status(500).json({ error: '쿼리 실행 실패' });
            return;
        }
        res.json(result);
    });
});
