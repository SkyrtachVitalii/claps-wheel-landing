const axios = require("axios");

async function fetchToSelzy(userData) {
  const { bonus, name } = userData;
  if (!bonus || !name) {
    console.log("Bonus or name is missing, user already have bonus");
    return;
  }
  const selzyList = defineSelzyList(bonus);
  const uri = createSelzyUri(selzyList, name);
  await doFetchToSelzy(uri);
}

function createSelzyUri(selzyList, email) {
  const apiUrl =
    "https://api.selzy.com/en/api/subscribe?format=json&api_key=";
  return `${apiUrl}${process.env.SELZY_API_KEY}&list_ids=${selzyList}&fields[email]=${email}&tags=new_subscriber&double_optin=3&overwrite=0`;
}

function defineSelzyList(bonus) {
  const newStr = bonus.replace(/ /g, "_").toLowerCase();
  const selzyList = {
    "10_free_spins_to_deposit": 63,
    "120%_to_deposit": 68,
    "115%_free_spins_to_deposit": 67,
    "115%_to_deposit": 66,
    "15_free_spins_to_deposit": 64,
    "120%_to_deposit": 68,
    no_prize: 69,
    "100%_to_deposit": 65,
  };
  return selzyList[newStr];
}

async function doFetchToSelzy(uri) {
    const params = new URLSearchParams();
    params.append("format", "json");
  try {
    await axios.post(uri, params.toString(), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
  } catch (error) {
    console.error("Error while calling the external API:", error);
  }
}

module.exports = { fetchToSelzy };