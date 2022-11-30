const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken')
require('dotenv').config()
const port = process.env.PORT || 4000;

app = express();

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@tawsifahmed.18d0gsh.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

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
        app.get('/productsBookings', async (req, res) => {
            const email = req.query.email;
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

        // users post api - db
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
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