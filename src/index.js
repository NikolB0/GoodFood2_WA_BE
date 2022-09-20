import * as dotenv from 'dotenv';
dotenv.config()
import express from 'express';
import connect from './db.js'
import cors from "cors"
import mongo from 'mongodb';
import auth from './auth.js';
import db from './db.js';

const app = express()
const port = 3001
app.use(cors())
app.use(express.json());

app.get('/tajna', [auth.verify], async (req, res) => {
    res.status(200).send('tajna korisnika ' + req.jwt.username);
});


app.post('/auth', async (req, res) => {
    let user = req.body;
    let username = user.username;
    let password = user.password;

    try {
        let result = await auth.authenticateUser(username, password);
        console.log("drek")
        res.status(201).json(result);
    } catch (e) {
        console.log(e)

        res.status(500).json({
            error: e.message,
        });
    }
});

app.post('/user', async (req, res) => {
    let user = req.body;

    try {
        let result = await auth.registerUser(user);
        res.status(201).send();
    } catch (e) {
        res.status(500).json({
            error: e.message,
        });
    }

});

app.delete('/comments/:id', [auth.verify], async (req, res) => {
    let db = await connect();
    let id = req.params.id;

    let result = await db.collection('comments').deleteOne(
        { _id: mongo.ObjectId(id) })
    res.sendStatus(200);
});

app.get('/posts', [auth.verify], async (req, res) => {
    let db = await connect()
    let drek = await db.collection("posts");
    // console.log(drek);
    // console.log(drek.toArray())
    let cursor = await db.collection("posts").find().sort({ postedAt: -1 })
    let results = await cursor.toArray()
    res.json(results)
})


app.post('/posts', async (req, res) => {
    let data = req.body

    let db = await connect();
    let result = await db.collection("posts").insertOne(data);
    data.id = 1 + db.collection("posts").count();
    res.json(result) // vrati podatke za referencu
})

app.get('/selectedrecipe/:id', [auth.verify], async (req, res) => {
    let id = req.params.id;
    let db = await connect();

    let post = await db.collection('posts').findOne({ _id: mongo.ObjectId(id) });
    let commentsCursor = await db.collection("comments").find({ postId: id })
    let comments = await commentsCursor.toArray();
    console.log(comments)
    post.comments = comments;
    res.json(post);
});

app.post('/comments', [auth.verify], async (req, res) => {
    let db = await connect();
    let doc = req.body;
    doc.posted_at = new Date(Date.now());
    let result = await db.collection('comments').insertOne(doc);

    res.json(doc);
});

app.listen(port, () => console.log(`Slušam na portu ${port}!`))
