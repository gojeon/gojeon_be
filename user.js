const express = require('express');
const mysql = require('mysql2');

const router = express.Router();
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

router.post('/signup', (req, res) => {
    const { email, password, nickName } = req.body;
    if (!email || !password || !nickName) {
        return res.status(400).json({ error: '모든 필드를 입력해야 합니다.' });
    }
    const query = 'INSERT INTO user (email, password, nickName, created_at) VALUES (?, ?, ?, ?)';
    const date = new Date();
    connection.query(query, [email, password, nickName, date], (err, result) => {
        if (err) {
            return res.status(500).json({ error: '사용자 등록 실패' });
        }
        res.status(201).json({ message: '사용자가 성공적으로 등록되었습니다.' });
    });
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: '모든 필드를 입력해야 합니다.' });
    }
    const query = `SELECT email, password from USER where EMAIL='${email}'`;
    console.log(query);
    connection.query(query, (err, result) => {
        console.log('result', result[0].password);
        if (result && result[0].password === password) {
            return res.status(200).json({ message: '로그인에 성공하였습니다.' });
        }
        return res.status(500).json({ error: '로그인 정보가 일치하지 않습니다' });
    });
});

module.exports = router;
