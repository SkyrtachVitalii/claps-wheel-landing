require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

async function checkUserBonus(incomingName) {
  const client = new MongoClient(process.env.MONGO_URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  const resBody = {
    name: incomingName,
    bonus: null,
    date: null,
  };

  function checkEqualsDay(dateOne, dateTwo) {
    // console.log("--------------");
    // console.log("incomingDate - ", dateOne);
    // console.log("foundDate - ", dateTwo);
    // console.log("--------------");
    const areDatesEqual =
      dateOne.getFullYear() === dateTwo.getFullYear() &&
      dateOne.getMonth() === dateTwo.getMonth() &&
      dateOne.getDate() === dateTwo.getDate();

    const existingBonus = areDatesEqual ? true : false;
    return existingBonus;
  }

  try {
    await client.connect();
    const database = client.db(process.env.MONGO_DB);
    const bonuses = database.collection(process.env.MONGO_COLLECTION);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const oneUser = await bonuses.findOne({
      name: incomingName,
    });

    console.log(oneUser);

    let incomingUserDate;
    oneUser === null || oneUser === undefined
      ? (incomingUserDate = null)
      : (incomingUserDate = oneUser.date);

    if (incomingUserDate != null || incomingUserDate != undefined) {
      const extUserData = {
        ...oneUser,
        bonusExist: checkEqualsDay(today, incomingUserDate),
      };
      return extUserData;
    } else {
      return {
        userExist: false,
        bonusExist: false,
      };
    }
  } finally {
    await client.close();
  }
}

async function addNewUserBonus(name, randomBonus) {
  const client = new MongoClient(process.env.MONGO_URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  const resBody = {
    name,
    bonus: randomBonus,
    date: new Date(),
  };

  try {
    await client.connect();
    const db = client.db(process.env.MONGO_DB);
    const collection = db.collection(process.env.MONGO_COLLECTION);
    const result = await collection.insertOne(resBody);
    // console.log("Документ створено з ID:", result.insertedId);

    return resBody;
  } catch (error) {
    console.error("Помилка запису в базу даних:", error);
    res.status(500).json({ error: "Не вдалося зберегти дані в базу" });
  }
}

async function updateUserBonus(name, randomBonus) {
  const resBody = {
    name,
    bonus: randomBonus,
    date: new Date(),
  };
  const client = new MongoClient(process.env.MONGO_URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  const filter = { name: name };
  const updateDoc = {
    $set: {
      bonus: randomBonus,
      date: resBody.date,
    },
  };
  const options = { upsert: true };

  try {
    await client.connect();
    const db = client.db(process.env.MONGO_DB);
    const collection = db.collection(process.env.MONGO_COLLECTION);
    const result = await collection.updateOne(filter, updateDoc, options);
    // console.log("Документ оновлено з ID:", result);

    return resBody;
  } catch (error) {
    console.error("Помилка запису в базу даних:", error);
    res.status(500).json({ error: "Не вдалося зберегти дані в базу" });
  }
  // console.log("updateUserBonus", name);
}

module.exports = { checkUserBonus, addNewUserBonus, updateUserBonus };
