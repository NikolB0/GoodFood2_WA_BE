// import * as dotenv  from 'dotenv';
// dotenv.config();

// import express from "express";
// import storage  from "./memory_storage.js"
// import cors from "cors"
// import connect from './db.js'
// import mongo from 'mongodb'
// import auth from './auth'

// const app = express();
// const port = 3000;

// app.use(cors());
// app.use(express.json());

// app.get('/tajna', [auth.verify], async (req, res) => {
//     res.status(200).send('tajna korisnika ' + req.jwt.username);
// });

// app.post('/auth', async (req, res) => {
//     let user = req.body;
//     let username = user.username;
//     let password = user.password;

//     try {
//         let result = await auth.authenticateUser(username, password);
//         res.status(201).json(result);
//     } catch (e) {
//         res.status(500).json({
//             error: e.message,
//         });
//     }
// });

// app.post('/user', async (req, res) => {
//     let user = req.body;

//     try {
//         let result = await auth.registerUser(user);
//         res.status(201).send();
//     } catch (e) {
//         res.status(500).json({
//             error: e.message,
//         });
//     }    
// });

// app.post('/posts', [auth.verify], async (req, res) => {
//     let db = await connect();
//     let doc = req.body;
//     let result = await db.collection('recipes').insertOne(doc);
//     if (result.insertedCount == 1) {
//         res.json({
//             status: 'success',
//             id: result.insertedId,
//         });
//     } else {
//         res.json({
//             status: 'fail',
//         });
//     }
// });


// app.get("/posts", (req,res) => {
//     let posts = storage.posts;
//     let query = req.query;

//     if (query.title) {
//         posts = posts.filter((e) => e.title.indexOf(query.title) >= 0);
//     }

//     if (query.createdBy) {
//         posts = posts.filter((e) => e.createdBy.indexOf(query.createdBy) >= 0);
//     }

//     if (query._any) {
//         let terms = query._any.split(' ');
//         posts = posts.filter((doc) => {
//             let info = doc.title + ' ' + doc.createdBy;
//             return terms.every((term) => info.indexOf(term) >= 0);
//         });
//     }

//     res.json(posts);
// });

// app.listen(port, () => console.log(`slušam na portu ${port}`));


// // app.post('/comments', [auth.verify],  async (req, res) => {
// //     let db = await connect();
// //     let doc = req.body;
// //     let result = await db.collection('comments').insertOne(doc);

// //     res.json(doc);
// // });

// // app.delete('/recipes/:id', [auth.verify], async (req, res) => {
// //     let db = await connect();
// //     let id = req.params.id;

// //     let result = await db.collection('recipes').deleteOne(
// //         { _id: mongo.ObjectId(id) })

// // });

// // app.delete('/comments/:id', [auth.verify], async (req, res) => {
// //     let db = await connect();
// //     let id = req.params.id;

// //     let result = await db.collection('comments').deleteOne(
// //         { _id: mongo.ObjectId(id) })
// // });

// // app.get('/posts', [auth.verify], async (req, res) => {
// //     let db = await connect() 
// //     let cursor = await db.collection("recipes").find().sort({postedAt: -1})
// //     let results = await cursor.toArray()
// //     res.json(results)
// //    })


// // app.get('/post/:id', [auth.verify],  async (req, res) => {
// //     let id = (req.params.id).trim();
// //     let db = await connect();
// //     let document = await db.collection('recipes').findOne({_id: new mongo.ObjectID(id)});

// //     res.json(document);
// // });

// // app.get('/comments/:id', [auth.verify], async (req, res) => {
// //     let db = await connect() 
// //     let id = (req.params.id).trim();       

// //     let cursor = await db.collection("comments").find({oglasid: id})
// //     let results = await cursor.toArray()
// //     res.json(results)    
// //     })


// // app.listen(port, () => console.log(`Listening on port ${port}`)) //intrtpolacija stringa u js ${sa backtick navodnicima!!!!!!!!!!!!}


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
    console.log(user);
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



app.post('/oglasi', [auth.verify], async (req, res) => {
    let db = await connect();
    let doc = req.body;



    let result = await db.collection('oglasi').insertOne(doc);

    res.json(doc);
});
app.post('/poruke', [auth.verify], async (req, res) => {
    let db = await connect();
    let doc = req.body;



    let result = await db.collection('poruke').insertOne(doc);

    res.json(doc);
});

app.delete('/poruke/:id', [auth.verify], async (req, res) => {
    let db = await connect();
    let id = req.params.id;

    let result = await db.collection('poruke').deleteMany(
        { artikalid: id })

})

app.post('/upit', [auth.verify], async (req, res) => {
    let db = await connect();
    let doc = req.body;



    let result = await db.collection('upiti').insertOne(doc);

    res.json(doc);
});
app.delete('/upit/:id', [auth.verify], async (req, res) => {
    let db = await connect();
    let id = req.params.id;

    let result = await db.collection('upiti').deleteOne(
        { _id: mongo.ObjectId(id) })

})

app.delete('/oglasi/:id', [auth.verify], async (req, res) => {
    let db = await connect();
    let id = req.params.id;

    let result = await db.collection('oglasi').deleteOne(
        { _id: mongo.ObjectId(id) })

});

app.delete('/comments/:id', [auth.verify], async (req, res) => {
    let db = await connect();
    let id = req.params.id;

    let result = await db.collection('comments').deleteOne(
        { _id: mongo.ObjectId(id) })
    res.sendStatus(200);
});


app.get('/oglasi', [auth.verify], async (req, res) => {
    let db = await connect()
    let cursor = await db.collection("oglasi").find()
    let results = await cursor.toArray()
    res.json(results)
})


app.get('/oglas/:id', [auth.verify], async (req, res) => {
    let id = (req.params.id).trim();
    let db = await connect();
    let document = await db.collection('oglasi').findOne({ _id: new mongo.ObjectID(id) });

    res.json(document);
});

app.get('/upit', [auth.verify], async (req, res) => {
    let db = await connect()
    let query = req.query
    let cursor = await db.collection("upiti").find({ $or: [{ by: query.by }, { to: query.to }] })
    let results = await cursor.toArray()
    res.json(results)
    console.log(query.by)
    console.log(query.to)
})

app.get('/posts', [auth.verify], async (req, res) => {
    let db = await connect()
    let drek = await db.collection("posts");
    // console.log(drek);
    // console.log(drek.toArray())
    let cursor = await db.collection("posts").find().sort({ postedAt: -1 })
    let results = await cursor.toArray()
    res.json(results)
})

app.get('/comments/:id', [auth.verify], async (req, res) => {
    let db = await connect()
    let id = (req.params.id).trim();


    let cursor = await db.collection("komentari").find({ postId: id })
    let results = await cursor.toArray()
    res.json(results)

})

app.get('/poruke/:id', [auth.verify], async (req, res) => {
    let db = await connect()
    let id = (req.params.id).trim();
    let query = req.query
    let cursor = await db.collection("poruke").find({ artikalid: id, $and: [{ $or: [{ querysender: query.querysender }, { itemowner: query.itemowner }] }, { $or: [{ querysender: query.querysender2 }, { itemowner: query.itemowner2 }] }] })
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
