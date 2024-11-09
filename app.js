require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mysql = require('mysql2');

const userRoutes = require('./user');

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
app.use(express.json());
app.use('/api/user', userRoutes);

app.listen(port, () => {
    console.log(`Backend server is running on http://localhost:${port}`);
});

app.get('/api/data', (req, res) => {
    connection.query('SELECT id, text, writer FROM oneline_list', (err, result) => {
        if (err) {
            res.status(500).json({ error: '쿼리 실행 실패' });
            return;
        }
        res.json(result);
    });
});

app.post('/api/list', (req, res) => {
    const { text, writer } = req.body;
    if (!text) {
        return res.status(400).json({ error: '문장을 입력하세요.' });
    }
    const query = 'INSERT INTO oneline_list (text, writer, reg_Id) VALUES (?,?)';
    connection.query(query, [text, writer, 1], (err, result) => {
        if (err) {
            return res.status(500).json({ error: '쿼리 실행 실패' });
        }
        res.status(201).json({ message: '데이터가 성공적으로 추가되었습니다.' });
    });
});

app.delete('/api/list/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM oneline_list WHERE id = ?';
    connection.query(query, [id], (err, result) => {
        console.log('result', result);
        if (err) {
            return res.status(500).json({ error: '쿼리 실행 실패' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: '명언이 없습니다' });
        }
        res.status(200).json({ message: '명언이 성공적으로 삭제되었습니다.' });
    });
});

app.put('/api/list/:id', (req, res) => {
    const { id } = req.params;
    const { text } = req.body; // 클라이언트에서 보낸 텍스트를 가져옵니다.

    const query = 'UPDATE oneline_list SET text = ?, reg_Id = ? WHERE id = ?';

    connection.query(query, [text, 1, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: '쿼리 실행 실패' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: '명언이 없습니다' });
        }
        res.status(200).json({ message: '명언이 성공적으로 수정되었습니다.' });
    });
});
