const { getDB } = require("./db");

async function checkUserBonus(name) {
  const db = getDB();
  const bonuses = db.collection(process.env.MONGO_COLLECTION);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const oneUser = await bonuses.findOne({ name });
  console.log(oneUser);
  

  // if (oneUser) {
  //   const isSameDay =
  //     oneUser.date &&
  //     oneUser.date.getFullYear() === today.getFullYear() &&
  //     oneUser.date.getMonth() === today.getMonth() &&
  //     oneUser.date.getDate() === today.getDate();

  //   return { ...oneUser, bonusExist: isSameDay, userExist: true };
  // }
  if (!oneUser) {
    return { userExist: false, bonusExist: false };
  }
  else if (oneUser.bonus !== "No prize") {
    const bonusExist = true;

    return { ...oneUser, bonusExist: bonusExist, userExist: true };
  } else if (
    oneUser.spinsAmount < 2 &&
    oneUser.bonus === "No prize" 
  ) {
    const bonusExist = false;
    return { ...oneUser, bonusExist: bonusExist, userExist: true };
  } else {
    return { ...oneUser, bonusExist: true, userExist: true };
  }
}

async function addNewUserBonus(name, randomBonus, agreement) {
  console.log("addNewUserBonus");
  const db = getDB();
  const bonuses = db.collection(process.env.MONGO_COLLECTION);

  const newUser = {
    name,
    bonus: randomBonus,
    date: new Date(),
    spinsAmount: 1,
    agreement,
  };

  await bonuses.insertOne(newUser);
  return newUser;
}

async function updateUserBonus(name, randomBonus, oldSpinsAmount, agreement) {
  console.log("updateUserBonus");
  const db = getDB();
  const bonuses = db.collection(process.env.MONGO_COLLECTION);

  const updatedUser = {
    name,
    bonus: randomBonus,
    date: new Date(),
    spinsAmount: oldSpinsAmount + 1,
    agreement,
  };

  await bonuses.updateOne({ name }, { $set: updatedUser }, { upsert: true });
  return updatedUser;
}

module.exports = { checkUserBonus, addNewUserBonus, updateUserBonus };
