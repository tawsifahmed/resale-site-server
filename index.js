const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 4000;

app = express();

// middleware
app.use(cors());
app.use(express.json());




const uri = "mongodb+srv://<username>:<password>@tawsifahmed.18d0gsh.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
    const collection = client.db("test").collection("devices");
    // perform actions on the collection object
    client.close();
});


app.get('/', async (req, res) => {
    res.send('assignment12 server is running');
})

app.listen(port, () => console.log(`assignment12 portal running on ${port}`))