const express = require('express');
const app = express();
const mysql = require('mysql2');
const mongoose = require('mongoose');

const connection = mysql.createPool({
  connectionLimit: 100,
  host: "mysql-service",
  user: "bahar",
  port: "3306",
  password: "123456",
  database: 'socialApp_db'
});

connection.getConnection((err) => {
    if (err) {
        console.error('MySQL bağlanti basarili: ' + err);
    } else {
        console.log('MySQL bağlantisi başarili.');
    }
});
mongoose.connect('mongodb://mongodb-service:55942/social_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const mongodb = mongoose.connection;
mongodb.on('error', console.error.bind(console, 'MongoDB bağlanti hatasi:'));

// Yorum ekleme işlemi (MongoDB)
app.post('/posts/:postId/comments', (req, res) => {
    const { postId, content, userId } = req.body;
    const comment = {
        content,
        userId,
        postId
    };
    Comment.create(comment, (err, newComment) => {
        if (err) {
            console.error('Yorum ekleme hatası: ' + err);
            res.status(500).send('Yorum ekleme hatası.');
        } else {
            res.status(201).json(newComment);
        }
    });
});

// Beğeni ekleme işlemi (MongoDB)
app.post('/posts/:postId/likes', (req, res) => {
    const { postId, userId } = req.body;
    const like = {
        userId,
        postId
    };
    Like.create(like, (err, newLike) => {
        if (err) {
            console.error('Beğeni ekleme hatası: ' + err);
            res.status(500).send('Beğeni ekleme hatası.');
        } else {
            res.status(201).json(newLike);
        }
    });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda çalişiyor.`);
});
