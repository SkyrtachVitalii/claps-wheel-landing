require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser"); // Для парсингу тіла запиту
const cors = require("cors"); // Підключаємо CORS
const axios = require("axios"); // Для виконання запиту до API
const { checkUserBonus, addNewUserBonus, updateUserBonus } = require("./modelsMongoDB/findMongoDB");
const getRandomBonus = require("./random")

const app = express();
const PORT = process.env.PORT || 4040;


// Налаштовуємо CORS middleware для дозволу лише з конкретного домену
const allowedOrigins = ['https://claps.com', 'https://claps.bet', 'https://claps.guru', 'https://prev.cc2.prod.bid'];  // Дозволені домени

const corsOptions = {
  origin: function(origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      // Дозволяємо запити з дозволених доменів або з локального хоста
      callback(null, true);
    } else {
      // Блокуємо запити з інших доменів
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['POST'],  // Дозволяємо лише POST запити
  allowedHeaders: ['Content-Type'],  // Дозволяємо лише Content-Type заголовок
};



// Додаємо CORS middleware
app.use(cors(allowedOrigins)); // Це дозволить усім доменам доступ до вашого API

// Використовуємо body-parser для обробки JSON
app.use(bodyParser.json()); // Для JSON в тілі запиту
app.use(bodyParser.urlencoded({ extended: true })); // Для form-urlencoded

app.post("/get-bonus", async (req, res) => {
  const { name } = req.body;
// console.log(req.body);

  if (!name) {
    return res.status(400).json({ error: "Name and email are required" });
  }


  const existingBonus = await checkUserBonus(name);
  console.log(existingBonus);
  
  if (existingBonus.bonusExist === true){
    console.log("User already got bonus today", existingBonus.incomingUserDate);
    res.json({
      bonusExist: true,
      dateOfBonus: existingBonus.incomingUserDate
    });
  } else if (existingBonus.bonusExist === false) {
    console.log("User doesn't have bonus today");
    res.json(await updateUserBonus(name, getRandomBonus(arr)));
  } else {
    console.log("User doesn't exist");
    res.json(await addNewUserBonus(name, getRandomBonus(arr)));
  }
});

app.post("/check-bonus", async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name and email are required" });
  }


  const existingBonus = await checkUserBonus(name);
  console.log("existingBonus ----- ", existingBonus);
  
  if (existingBonus.bonusExist == true && existingBonus.bonusExist == true){
    console.log("User already got bonus today", existingBonus.incomingUserDate);
    res.json({existingBonus});
  } else if (existingBonus.bonusExist == true && existingBonus.bonusExist == false) {
    console.log("User doesn't have bonus today");
    res.json(await updateUserBonus(name, getRandomBonus(arr)));
  } else {
    console.log("User doesn't exist");
    res.json(existingBonus);
  }
});

const arr = [
  "10 free spins to deposit",
  "120% to deposit",
  "10 free spins to deposit",
  "120% to deposit",
  "15 free spins to deposit",
  "120% to deposit",
  "No prize",
  "100% to deposit",
];

// mongodb ------------------------------------------------------------------
const { MongoClient, ServerApiVersion } = require("mongodb");
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});



let db; // Змінна для бази даних

async function connectDB() {
  try {
    await client.connect();
    db = client.db("bonusWheelCluster");
    console.log("Підключено до MongoDB!");
  } catch (error) {
    console.error("Помилка підключення до MongoDB:", error);
  } finally {
    await client.close();
  }
}

connectDB();

// Стартуємо сервер
app.listen(PORT, () => {
  console.log(`Proxy server is running at http://localhost:${PORT}`);
});
