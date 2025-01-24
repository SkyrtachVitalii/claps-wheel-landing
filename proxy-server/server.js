require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser"); // Для парсингу тіла запиту
const cors = require("cors"); // Підключаємо CORS
const axios = require("axios"); // Для виконання запиту до API
const { checkUserBonus, addNewUserBonus, updateUserBonus } = require("./modelsMongoDB/findMongoDB");
const getRandomBonus = require("./random")

const app = express();
const PORT = process.env.PORT || 3000;

// Додаємо CORS middleware
app.use(cors()); // Це дозволить усім доменам доступ до вашого API

// Використовуємо body-parser для обробки JSON
app.use(bodyParser.json()); // Для JSON в тілі запиту
app.use(bodyParser.urlencoded({ extended: true })); // Для form-urlencoded

// Стартуємо сервер
app.post("/proxy", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }
  const apiUrl = `https://api.selzy.com/en/api/subscribe?format=json&api_key=6a7x15ac8s9qnekzwufrkq85m7gsbd1b94tu83uo&list_ids=25&fields[email]=${email}&tags=new_subscriber&double_optin=3&overwrite=0`;
  try {
    // Виконуємо запит до API за сформованим URL
    const response = await axios.post(apiUrl);
    // Відправляємо відповідь клієнту
    res.json(response.data);
  } catch (error) {
    console.error("Error while calling the external API:", error);
    res.status(500).json({ error: "Failed to send data to the external API" });
  }
});

app.post("/get-bonus", async (req, res) => {
  const { name } = req.body;
console.log(req.body);

  if (!name) {
    return res.status(400).json({ error: "Name and email are required" });
  }


  const existingBonus = await checkUserBonus(name);
  console.log(existingBonus);
  
  if (existingBonus.bonusExist === "userExist_bonusExist"){
    console.log("User already got bonus today", existingBonus.incomingUserDate);
    res.json({
      getBonus: true,
      dateOfBonus: existingBonus.incomingUserDate
    });
  } else if (existingBonus.bonusExist === "userExist_bonusNotExist") {
    console.log("User doesn't have bonus today");
    res.json(await updateUserBonus(name, getRandomBonus(arr)));
  } else {
    console.log("User doesn't exist");
    res.json(await addNewUserBonus(name, getRandomBonus(arr)));
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
