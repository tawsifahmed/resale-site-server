const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

        // categories api
        app.get('/categories', async (req, res) => {
            const query = {};
            const categories = await categoriesCollection.find(query).toArray();
            res.send(categories);
        })

        app.get('/category/:id', async (req, res) => {
            const id = req.params.id
            const query = { id: id };
            const category = await productsCollection.find(query).toArray();
            res.send(category);
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