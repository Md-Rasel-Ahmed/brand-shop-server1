const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.6plls.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const mobileCollections = client.db("mobile_tech").collection("mobiles");

    app.get("/", async (req, res) => {
      res.send("Successfully connected");
    });
    app.post("/mobiles", async (req, res) => {
      const data = req.body;
      const result = await mobileCollections.insertOne(data);
      res.send(result);
    });
    app.get("/mobiles", async (req, res) => {
      const result = mobileCollections.find();
      const data = await result.toArray();
      res.send(data);
    });
    app.get("/mobiles/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: new ObjectId(id) };
      const mobile = await mobileCollections.findOne(query);
      res.send(mobile);
    });
    app.put("/mobiles/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const bName = req.body.brandName;
      console.log(bName);
      const updateDoc = {
        $set: {
          name: req.body.name,
          img: req.body.img,
          price: req.body.price,
          rating: req.body.rating,
          category: req.body.category,
          type: req.body.type,
          brandName: req.body.brandName,
          description: req.body.textArea,
        },
      };
      const result = await mobileCollections.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
app.listen(port);
