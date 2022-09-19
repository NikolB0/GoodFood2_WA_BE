import express from 'express'
import express from 'express';
import connect from './db.js'
import cors from "cors"
import mongo from 'mongodb';
import auth from './auth.js';
import * as dotenv  from 'dotenv';
dotenv.config()

const app = express()
const port = process.env.PORT ||3000 
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
        res.status(201).json(result);
    } catch (e) {
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

app.post('/recipes', [auth.verify], async (req, res) => {
    let db = await connect();
    let doc = req.body;
    let result = await db.collection('recipes').insertOne(doc);
    res.json(doc);
});

app.post('/comments', [auth.verify],  async (req, res) => {
    let db = await connect();
    let doc = req.body;



    let result = await db.collection('comments').insertOne(doc);

    res.json(doc);
});

app.delete('/recipes/:id', [auth.verify], async (req, res) => {
    let db = await connect();
    let id = req.params.id;

    let result = await db.collection('recipes').deleteOne(
        { _id: mongo.ObjectId(id) })

});

app.delete('/comments/:id', [auth.verify], async (req, res) => {
    let db = await connect();
    let id = req.params.id;

    let result = await db.collection('comments').deleteOne(
        { _id: mongo.ObjectId(id) })
});

app.get('/recipes', [auth.verify], async (req, res) => {
    let db = await connect() 
    let cursor = await db.collection("recipes").find().sort({postedAt: -1})
    let results = await cursor.toArray()
    res.json(results)
   })


app.get('/recipe/:id', [auth.verify],  async (req, res) => {
    let id = (req.params.id).trim();
    let db = await connect();
    let document = await db.collection('recipes').findOne({_id: new mongo.ObjectID(id)});

    res.json(document);
});

app.get('/comments/:id', [auth.verify], async (req, res) => {
    let db = await connect() 
    let id = (req.params.id).trim();       
    
    let cursor = await db.collection("comments").find({oglasid: id})
    let results = await cursor.toArray()
    res.json(results)    
    })


app.listen(port, () => console.log(`Listening on port ${port}`)) //intrtpolacija stringa u js ${sa backtick navodnicima}
