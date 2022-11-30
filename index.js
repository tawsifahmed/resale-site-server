const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const { query } = require('express');
require('dotenv').config()
const port = process.env.PORT || 4000;

app = express();

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@tawsifahmed.18d0gsh.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function verifyJWT(req, res, next) {
    console.log('tokenins', req.headers.authorization);
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.send(401).send('unauthorized access');
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN, function (error, decoded) {
        if (error) {
            return res.status(403).send({ message: 'forbidden access' });
        }
        req.decoded = decoded;
        next();
    })
}

async function run() {
    try {
        const categoriesCollection = client.db('a12-server').collection('categories');
        const productsCollection = client.db('a12-server').collection('products');
        const productBookingsCollection = client.db('a12-server').collection('productBookings');
        const usersCollection = client.db('a12-server').collection('users');

        // categories api
        app.get('/categories', async (req, res) => {
            const query = {};
            const categories = await categoriesCollection.find(query).toArray();
            res.send(categories);
        })

        app.get('/category1/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await categoriesCollection.findOne(query);
            res.send(service);
        });

        // products api based on category types
        app.get('/category/:id', async (req, res) => {
            const id = req.params.id
            const query = { id: id };
            const category = await productsCollection.find(query).toArray();
            res.send(category);
        });

        // booking api using email query
        app.get('/productsBookings', verifyJWT, async (req, res) => {
            const email = req.query.email;
            const decodedEmail = req.decoded.email;

            if (email !== decodedEmail) {
                return res.status(403).send({ message: 'forbidden access' })
            }
            const query = { email: email }
            const productsBookings = await productBookingsCollection.find(query).toArray();
            res.send(productsBookings);
        })

        // booking post 
        app.post('/productsBookings', async (req, res) => {
            const productBooking = req.body
            const result = await productBookingsCollection.insertOne(productBooking);
            res.send(result);
        });

        app.get('/jwt', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);

            if (user) {
                const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, { expiresIn: '10d' })
                return res.send({ accessToken: token })
            }
            res.status(403).send({ accessToken: 'forbidden access' })


        })

        app.get('/users', async (req, res) => {
            const query = {};
            const users = await usersCollection.find(query).toArray();
            res.send(users);
        })



        // users post api - db
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        });


        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await usersCollection.findOne(query);
            res.send({ isAdmin: user?.role === 'admin' });
        })

        app.put('/users/admin/:id', verifyJWT, async (req, res) => {
            const decodedEmail = req.decoded.email;
            const query = { email: decodedEmail };
            const user = await usersCollection.findOne(query);

            if (user?.role !== 'admin') {
                return res.status(403).send({ message: 'forbidden access' })
            }

            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updatedDoc = {
                $set: {
                    role: 'admin'
                }
            }
            const result = await usersCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        })


    }
    finally {

    }
}

run().catch(er => console.log(er));

app.get('/', async (req, res) => {
    res.send('assignment12 server is running');
})

app.listen(port, () => {
    console.log(`a12 sever running on port ${port}`);
})