const { MongoClient, ServerApiVersion } = require("mongodb");

let client;
let db;

async function connectDB() {
  if (!client) {
    client = new MongoClient(process.env.MONGO_URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
        ssl: true,
      },
    });

    await client.connect();
    db = client.db("bonusWheelCluster");
    console.log("Connected to MongoDB");
  }
}

function getDB() {
  if (!db) {
    throw new Error("Database not initialized. Call connectDB first.");
  }
  return db;
}

async function closeDB() {
  if (client) {
    await client.close();
    console.log("MongoDB connection closed");
  }
}

module.exports = { connectDB, getDB, closeDB };
