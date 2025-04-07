require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { connectDB } = require("./modelsMongoDB/db");
const {
  checkUserBonus,
  addNewUserBonus,
  updateUserBonus,
} = require("./modelsMongoDB/findMongoDB");
const getRandomBonus = require("./random");
const { fetchToSelzy } = require("./selzy/selzy");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 4040;
const RECONNECT_INTERVAL = 20000;
let isConnected = false;

const allowedOrigins = [
  "https://claps.com",
  "https://claps.bet",
  "https://claps.guru",
  "https://prev.cc2.prod.bid",
  "http://127.0.0.1:5501",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["POST"],
  allowedHeaders: ["Content-Type"],
};

// app.options("*", cors(corsOptions));

// app.use(cors());
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// for server on Replit only
// const checkDBConnectionMiddleware = (req, res, next) => {
//   if (!isDBConnected()) {
//     return res.status(503).json({ error: "Database not connected yet. Try again later." });
//   }
//   next();
// };

// app.use(checkDBConnectionMiddleware);

// const getPublicIP = async () => {
//   try {
//     const response = await axios.get('https://api.ipify.org?format=json');
//     return response.data.ip;
//   } catch (error) {
//     console.error("Error getting public IP:", error);
//     return null;
//   }
// };

// const getLocalIP = () => {
//   try {
//     let command = process.platform === "win32" ? "ipconfig" : "hostname -I";
//     const output = execSync(command, { encoding: "utf8" });

//     if (process.platform === "win32") {
//       return output
//         .split("\n")
//         .filter((line) => line.includes("IPv4"))[0]
//         ?.split(":")[1]
//         ?.trim();
//     }
//     return output.split(" ")[0].trim();
//   } catch (error) {
//     console.error("Error getting local IP:", error);
//     return "Unknown";
//   }
// };

const pendingRequests = new Set();

app.post("/get-bonus", async (req, res) => {
  const { name, agreement } = req.body;

  if (pendingRequests.has(name)) {
    return res.status(429).json({ error: "Duplicate request detected" });
  }
  pendingRequests.add(name);

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  try {
    const existingBonus = await checkUserBonus(name);
    console.log(existingBonus);

    if (existingBonus.bonusExist && existingBonus.spinsAmount >= 2) {
      res.json({
        bonusExist: true,
        spinsAmount: existingBonus.spinsAmount,
        dateOfBonus: existingBonus.incomingUserDate,
      });
    } else if (
      existingBonus.userExist &&
      !existingBonus.bonusExist &&
      existingBonus.bonus === "No prize" &&
      existingBonus.spinsAmount < 2
    ) {
      const responseData = await updateUserBonus(
        name,
        getRandomBonus(existingBonus.spinsAmount),
        existingBonus.spinsAmount,
        agreement
      );
      console.log(responseData);
      res.json(responseData);

      await fetchToSelzy(responseData);
    } else {
      const responseData = await addNewUserBonus(
        name,
        getRandomBonus(),
        agreement
      );
      res.json(responseData);
      await fetchToSelzy(responseData);
    }
  } catch (error) {
    console.error("Error handling bonus:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    pendingRequests.delete(name);
  }
});

app.post("/check-bonus", async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  try {
    const existingBonus = await checkUserBonus(name);
    res.json(existingBonus);
  } catch (error) {
    console.error("Error checking bonus:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// for localhost only
app.listen(PORT, async () => {
  await connectDB(); // Підключення до бази при старті сервера
  console.log(`Server is running at http://localhost:${PORT}`);
});


// for server on Replit only
// const startServer = async () => {
//   const localIP = getLocalIP();
//   const publicIP = await getPublicIP();
  
//   console.log("🔍 IP Addresses to whitelist in MongoDB Atlas:");
//   console.log(`📍 Local IP: ${localIP}`);
//   console.log(`🌐 Public IP: ${publicIP}`);
//   console.log("⚠️ Also add 0.0.0.0/0 to allow access from anywhere");
//   console.log("\n⏳ Waiting 10 seconds for you to whitelist these IPs...\n");
  
//   await new Promise(resolve => setTimeout(resolve, 10000));
  
//   try {
//     await connectWithRetry();
    
//     const server = app.listen(PORT, '0.0.0.0', () => {
//       console.log(`🚀 Server is running at http://0.0.0.0:${PORT}`);
//       console.log(`🌍 Local network: http://${localIP}:${PORT}`);
//     });

//     server.on('error', (error) => {
//       if (error.code === 'EADDRINUSE') {
//         console.error(`⚠️ Port ${PORT} is already in use`);
//       } else {
//         console.error('Server error:', error);
//       }
//       process.exit(1);
//     });
//   } catch (error) {
//     console.error("Failed to start server:", error);
//     process.exit(1);
//   }
// };

// const connectWithRetry = async () => {
//   while (!isConnected) {
//     try {
//       await connectDB();
//       isConnected = true;
//       console.log("✅ Connected to MongoDB");
//     } catch (error) {
//       console.error("❌ MongoDB connection failed:", error.message);
//       console.log(`🔄 Retrying in ${RECONNECT_INTERVAL / 1000} seconds...`);
//       await new Promise((resolve) => setTimeout(resolve, RECONNECT_INTERVAL));
//     }
//   }
// };

// startServer();