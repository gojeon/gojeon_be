const express = require('express');
const app = express();
const port = 3001; // 백엔드 포트는 3001로 설정

app.get('/', (req, res) => {
    res.send('Hello from Backend!');
});

app.listen(port, () => {
    console.log(`Backend server is running on http://localhost:${port}`);
});
