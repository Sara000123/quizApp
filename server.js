const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
const port = 3000;
app.use(cors());
// Add this line to your server.js


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // your MySQL user
    password: 'stockhus1', // your MySQL password
    database: 'GeoQuiz'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to the database.');
});

app.get('/api/questions', (req, res) => {
    const query = `
        SELECT q.question_id, q.question_text, c.choice_id, c.choice_text, c.is_correct 
        FROM questions q 
        JOIN choices c ON q.question_id = c.question_id
        ORDER BY q.question_id, c.choice_id
    `;
    
    db.query(query, (err, results) => {
        if (err) throw err;

        const questions = {};
        results.forEach(row => {
            if (!questions[row.question_id]) {
                questions[row.question_id] = {
                    text: row.question_text,
                    choices: []
                };
            }
            
            questions[row.question_id].choices.push({
                id: row.choice_id,
                text: row.choice_text,
                isCorrect: !!row.is_correct
            });
        });
        
        res.json(Object.values(questions));
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
